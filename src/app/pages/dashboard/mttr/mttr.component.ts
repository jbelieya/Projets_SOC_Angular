import { Component, inject, input, OnInit, effect, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { KpisService } from '../../../services/KPIs/kpis.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DashboardItem } from '../../module/dashboar';

@Component({
  selector: 'app-mttr',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './mttr.component.html',
  styleUrl: './mttr.component.css'
})
export class MTTRComponent {
  store = inject(KpisService);
  router = inject(Router);

  mttr = signal<number>(0);
  data = input.required<DashboardItem>();
  currentType: 'month' | 'year' = 'month';

  constructor() {
    effect(() => {
      this.updateStats();
    });
  }

  updateStats() {
    let values: number[] = [];
    
    const currentData = this.data();
if (!currentData) return;

if (this.currentType === 'month') {
  values = (currentData.moin && currentData.moin.length > 0) 
           ? currentData.moin 
           : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Default: kol el chhour
} else {
  values = (currentData.year && currentData.year.length > 0) 
           ? currentData.year 
           : [2024, 2025, 2026]; 
}

    this.store.getKpiDatapro('mttr', this.currentType, values).subscribe({
      next: (res) => {
        const valuesArray: number[] = Object.values(res);
        if (valuesArray.length > 0) {
          const sum = valuesArray.reduce((a, b) => a + b, 0);
          const avg = sum / valuesArray.length;
          this.mttr.set(Math.round(avg)); 
        } else {
          this.mttr.set(0);
        }
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error fetching MTTR', err);
        }
      }
    });
  }
}