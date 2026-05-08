import { Component, inject, input, OnInit, effect, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { KpisService } from '../../services/KPIs/kpis.service';
import { DashboardItem } from '../../pages/module/dashboar';

@Component({
  selector: 'app-mtta',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './mtta.component.html',
  styleUrl: './mtta.component.css'
})
export class MTTAComponent {
  store = inject(KpisService);
  router = inject(Router);

  mtta = signal<number>(0);
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

    this.store.getKpiDatapro('mtta', this.currentType, values).subscribe({
      next: (res) => {
        const valuesArray: number[] = Object.values(res);
        if (valuesArray.length > 0) {
          const sum = valuesArray.reduce((a, b) => a + b, 0);
          const avg = sum / valuesArray.length;
          this.mtta.set(Math.round(avg)); 
        } else {
          this.mtta.set(0);
        }
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        } else {
          console.error('Error fetching MTTA', err);
        }
      }
    });
  }
}