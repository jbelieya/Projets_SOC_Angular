import { Component, effect, ElementRef, inject, input, OnInit, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import Chart from 'chart.js/auto'
import { KpisService } from '../../../../services/KPIs/kpis.service';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import { DashboardItem } from '../../../module/dashboar';

@Component({
  selector: 'app-true-positives',
  imports: [MatButtonModule],
  templateUrl: './true-positives.component.html',
  styleUrl: './true-positives.component.css'
})
export class TruePositivesComponent {
  store = inject(KpisService);
  chartRef = viewChild.required<ElementRef>('chart');
  myChart: any;
  data = input.required<DashboardItem>();
  currentType: 'month' | 'year' = 'month';
totalTrue = signal<number>(0);
  totalFalse = signal<number>(0);
  
  truePercentage = signal<number>(0);
  truePercentageLabel = signal<number>(0);
  falsePercentageLabel = signal<number>(0);
  constructor() {
 effect(() => {
      this.updateStats();
    }); 
  }
  

  toggleType(type: 'month' | 'year') {
    this.currentType = type;
    this.updateStats();
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
    this.store.getKpiDatapro('false_positive_rate', this.currentType, values).subscribe({
      next: (falseData) => {
        this.store.getKpiDatapro('get_true_positives_stats', this.currentType, values).subscribe({
          next: (trueData) => {
            const fSum = Object.values(falseData).reduce((a: any, b: any) => a + b, 0) as number;
            const tSum = Object.values(trueData).reduce((a: any, b: any) => a + b, 0) as number;
            
            this.totalFalse.set(fSum);
            this.totalTrue.set(tSum);

            const total = fSum + tSum;
            if (total > 0) {
              const tPercent = Math.round((tSum / total) * 100);
              this.truePercentageLabel.set(tPercent);
              this.falsePercentageLabel.set(100 - tPercent);
              this.truePercentage.set((tPercent / 100) * 150.8);
            }
          }
        });
      }
    });
  }

  createChart(labels: string[], values: any[]) {
    if (this.myChart) { this.myChart.destroy(); }

    const primaryColor =  '#f16368';
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--sys-on-surface').trim() || '#ffffff';

    this.myChart = new Chart(this.chartRef().nativeElement, {
      type: 'bar',
      plugins: [ChartDataLabels],
      data: {
        labels: labels,
        datasets: [{
          label: this.currentType === 'month' ? 'False Positives' : 'False Positives',
          data: values,
          backgroundColor: primaryColor,
          borderRadius: 0,
          barThickness: 30,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, // Na7iha madem el arkam fo9 el bars
          
          // --- HNA EL FAZA EL MOHAMMA (Data Labels) ---
          datalabels: {
            anchor: 'end',        // El blasa: f-el e5er mta3 el bar
            align: 'top',         // Fo9 el bar bed-dabt
            color: textColor,     // Lon el ra9m (System text color)
            font: {
              weight: 'bold',
              size: 12
            },
            formatter: (value) => value // Y-affichi el ra9m kima houwa
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            display: false, // T-najem t-na7ih el axe Y tawa khater el arkam fo9 el bars
            grid: { display: false }
          },
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(150, 150, 150, 0.8)' }
          }
        },
        layout: {
          padding: {
            top: 25 // Zid chwaya espace mel fo9 bch el ra9m ma yet9as-sech
          }
        }
      }
    });
  }

  getMonthName(monthNumber: string): string {
    const date = new Date();
    date.setMonth(parseInt(monthNumber) - 1);
    return date.toLocaleString('fr-FR', { month: 'short' });
  }
}