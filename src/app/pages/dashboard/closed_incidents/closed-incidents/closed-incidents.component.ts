import { Component, ElementRef, inject, viewChild, OnInit, effect, input } from '@angular/core';
import { KpisService } from '../../../../services/KPIs/kpis.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DashboardItem } from '../../../module/dashboar';
@Component({
  selector: 'app-closed-incidents',
  imports: [],
  templateUrl: './closed-incidents.component.html',
  styleUrl: './closed-incidents.component.css'
})
export class ClosedIncidentsComponent {
  store = inject(KpisService);
  chartRef = viewChild.required<ElementRef>('chart');
  myChart: any;
  data = input.required<DashboardItem>();
  currentType: 'month' | 'year' = 'month';

  constructor() {
    effect(() => {
      const dashboardData = this.data();
      const canvas = this.chartRef();
      
      if (dashboardData && canvas) {
        this.updateStats();
      }
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
    this.store.getKpiDatapro('closed_incidents_count', this.currentType, values).subscribe({
      next: (data) => {
        const labels = Object.keys(data).map(key => 
          this.currentType === 'month' ? this.getMonthName(key) : key
        );
        const valuesData = Object.values(data);
        this.createChart(labels, valuesData);
      },
      error: (err) => console.error('Error', err)
    });
  }

  createChart(labels: string[], values: any[]) {
    if (this.myChart) { this.myChart.destroy(); }

    const primaryColor = '#d32828';
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--sys-on-surface').trim() || '#ffffff';

    this.myChart = new Chart(this.chartRef().nativeElement, {
      type: 'bar',
      plugins: [ChartDataLabels],
      data: {
        labels: labels,
        datasets: [{
          label: 'Open Incidents',
          data: values,
          backgroundColor: primaryColor,
          borderRadius: 0,
          barThickness: 20,
        }]
      },
      options: {
        indexAxis: 'y', 
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'right', 
            color: textColor,
            font: { weight: 'bold', size: 12 },
            formatter: (val) => val
          }
        },
        scales: {
          x: { display: false, grid: { display: false } },
          y: {
            grid: { display: false },
            ticks: { color: 'rgba(150, 150, 150, 0.9)', font: { size: 11 } }
          }
        },
        layout: { padding: { right: 40 } } 
      }
    });
  }

  getMonthName(monthNumber: string): string {
    const date = new Date();
    date.setMonth(parseInt(monthNumber) - 1);
    return date.toLocaleString('fr-FR', { month: 'short' });
  }
}