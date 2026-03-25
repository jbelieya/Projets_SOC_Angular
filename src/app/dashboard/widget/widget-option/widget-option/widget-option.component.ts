import { Component, inject, input, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { WidgetComponent } from '../../widget.component';
import { DashboardItem } from '../../../../pages/module/dashboar';
import { KpisService } from '../../../../services/KPIs/kpis.service';
@Component({
  selector: 'app-widget-option',
  imports: [MatButtonModule,MatIcon,MatButtonToggleModule],
  templateUrl: './widget-option.component.html',
  styleUrl: './widget-option.component.css'
})
export class WidgetOptionComponent {
  data = input.required<DashboardItem>();
  showOptions = model<boolean>(false);
  store=inject(KpisService)
}
