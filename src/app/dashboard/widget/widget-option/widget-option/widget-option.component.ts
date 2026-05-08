import { Component, inject, input, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { WidgetComponent } from '../../widget.component';
import { DashboardItem } from '../../../../pages/module/dashboar';
import { KpisService } from '../../../../services/KPIs/kpis.service';
import { MatFormField } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatOptionModule } from '@angular/material/core'; 
@Component({
  selector: 'app-widget-option',
  imports: [MatButtonModule, 
    MatIcon, MatButtonToggleModule, MatFormField,
  MatSelectModule,     
    MatFormFieldModule,   
    MatOptionModule],
  templateUrl: './widget-option.component.html',
  styleUrl: './widget-option.component.css'
})
export class WidgetOptionComponent {
  monthsList = [
    { value: 1, viewValue: 'Jan' },
    { value: 2, viewValue: 'Feb' },
    { value: 3, viewValue: 'Mar' },
    { value: 4, viewValue: 'Apr' },
    { value: 5, viewValue: 'May' },
    { value: 6, viewValue: 'Jun' },
    { value: 7, viewValue: 'Jul' },
    { value: 8, viewValue: 'Aug' },
    { value: 9, viewValue: 'Sep' },
    { value: 10, viewValue: 'Oct' },
    { value: 11, viewValue: 'Nov' },
    { value: 12, viewValue: 'Dec' }
  ];
  yearsList = [2023, 2024, 2025, 2026];
  data = input.required<DashboardItem>();
  showOptions = model<boolean>(false);
  store=inject(KpisService)
onSelectionChange(newValues: number[], type: 'month' | 'year') {
  if (type === 'month') {
    this.store.updateWidget(this.data().id, { moin: newValues });
  } else {
    this.store.updateWidget(this.data().id, { year: newValues });
  }
}
}
