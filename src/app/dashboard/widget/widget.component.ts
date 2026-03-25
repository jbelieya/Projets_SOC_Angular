import { Component, input, signal,OnInit, OnDestroy } from '@angular/core';
import { DashboardItem } from '../../pages/module/dashboar';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { WidgetOptionComponent } from './widget-option/widget-option/widget-option.component';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-widget',
  imports: [NgComponentOutlet,MatButtonModule,MatIcon,WidgetOptionComponent,CommonModule,CdkDrag,
    CdkDragPlaceholder,
  ],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.css',
  host: {
     '[style.grid-area]':
     '"span " + (data().rows ?? 1) + "/ span " + (data().columns ?? 1)',
}
})
export class WidgetComponent implements OnInit, OnDestroy{
  data = input.required<DashboardItem>();
  showOptions = signal(false);
  style = signal(false); 
  
  private observer: MutationObserver | undefined;

  ngOnInit() {
    // 1. Thabbet awwel ma yet-7al l-widget
    this.updateStyle();

    // 2. Rakkeb el "Watcher" (MutationObserver)
    this.observer = new MutationObserver(() => {
      this.updateStyle();
    });

    // 3. 9ollou 3ess 3al tag 'html' khassatan el 'class'
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  updateStyle() {
    this.style.set(document.documentElement.classList.contains('dark'));
  }

  ngOnDestroy() {
    // mohemma bch l-app ma t-wallich t-thaqel (Memory leak)
    this.observer?.disconnect();
  }
}
  

