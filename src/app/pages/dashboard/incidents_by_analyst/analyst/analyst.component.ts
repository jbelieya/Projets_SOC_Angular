import { Component, ElementRef, inject, viewChild, OnInit } from '@angular/core';
import { KpisService } from '../../../../services/KPIs/kpis.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analyst',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analyst.component.html',
  styleUrl: './analyst.component.css'
})
export class AnalystComponent implements OnInit {
  store = inject(KpisService);
  chartRef = viewChild.required<ElementRef>('chart');
  myChart: any;
  currentType: 'month' | 'year' = 'month';

  ngOnInit() { this.updateStats(); }

  toggleType(type: 'month' | 'year') {
    this.currentType = type;
    this.updateStats();
  }

  updateStats() {
    const values = this.currentType === 'month' ? [1, 2, 3, 4, 5, 6] : [2024, 2025, 2026];
    this.store.getKpiDatapro('incidents_by_analyst', this.currentType, values).subscribe({
      next: (data: any) => {
        const totalsMap = new Map<string, number>();
        Object.values(data).forEach((periodData: any) => {
          if (Array.isArray(periodData)) {
            periodData.forEach((item: any) => {
              const name = item.user_name || item.user_name__username || 'Unknown';
              totalsMap.set(name, (totalsMap.get(name) || 0) + item.count);
            });
          }
        });
        this.createChart(Array.from(totalsMap.keys()), Array.from(totalsMap.values()));
      }
    });
  }

  createChart(labels: string[], values: any[]) {
    if (this.myChart) { this.myChart.destroy(); }
    this.myChart = new Chart(this.chartRef().nativeElement, {
      type: 'bar',
      plugins: [ChartDataLabels],
      data: {
        labels: labels,
        datasets: [{
          label: 'Incidents per Analyst',
          data: values,
          backgroundColor: '#6366f1',
          borderRadius: 0,
          barThickness: 20
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
            align: 'right',
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
}