import { Component, ElementRef, inject, input, OnInit, Type, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { KpisService } from '../../services/KPIs/kpis.service';
import { DashboardItem } from '../module/dashboar';
import { MTTDComponent } from './mttd/mttd.component';
import { WidgetComponent } from '../../dashboard/widget/widget.component';
import { CommonModule } from '@angular/common';
import {wrapGrid} from 'animate-css-grid';
import { CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-dashboard',
  imports: [WidgetComponent, MatButtonModule, MatIcon, MatMenuModule, CommonModule, CdkDropListGroup, CdkDropList],
  providers: [KpisService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent  {
      
    store =  inject(KpisService);

    dashboard = viewChild.required<ElementRef>('dashboard');
    
    ngOnInit(): void {
      wrapGrid(this.dashboard().nativeElement,{ duration: 300 });

      const { unwrapGrid } = wrapGrid(this.dashboard().nativeElement, {
        duration: 300,
      });
      this.clearAnimations = unwrapGrid;
    }
    ngOnDestroy(){
      this.clearAnimations();
    }
  clearAnimations() {
    throw new Error('Method not implemented.');
  }
  drop(event: CdkDragDrop<number,any>){
    const { previousContainer, container} = event;
    this.store.updatewidgetPosition(previousContainer.data,container.data);
  }


}