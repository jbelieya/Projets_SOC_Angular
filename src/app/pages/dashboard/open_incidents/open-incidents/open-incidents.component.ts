import { Component, ElementRef, inject, viewChild, OnInit } from '@angular/core';
import { KpisService } from '../../../../services/KPIs/kpis.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-open-incidents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './open-incidents.component.html',
  styleUrl: './open-incidents.component.css'
})
export class OpenIncidentsComponent implements OnInit {
  store = inject(KpisService);
  chartRef = viewChild.required<ElementRef>('chart');
  myChart: any;
  currentType: 'month' | 'year' = 'month';

  ngOnInit() {
    this.updateStats();
  }

  toggleType(type: 'month' | 'year') {
    this.currentType = type;
    this.updateStats();
  }

  updateStats() {
    const values = this.currentType === 'month' ? [1, 2, 3, 4, 5, 6] : [2024, 2025, 2026];

    this.store.getKpiDatapro('open_incidents_count', this.currentType, values).subscribe({
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

    const primaryColor =  'rgb(99, 241, 163)';
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
        indexAxis: 'y', // <--- HEDHI EL FAZA: T-raddou Horizontal kima el taswira
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'right', // Ra9m i-ji 3al imin el bar
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
        layout: { padding: { right: 40 } } // Espace lel arkam bch ma y-toufouch
      }
    });
  }

  getMonthName(monthNumber: string): string {
    const date = new Date();
    date.setMonth(parseInt(monthNumber) - 1);
    return date.toLocaleString('fr-FR', { month: 'short' });
  }
}