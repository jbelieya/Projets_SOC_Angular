import { Component, ElementRef, inject, viewChild, OnInit } from '@angular/core';
import { KpisService } from '../../../../services/KPIs/kpis.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-incidents-by-site',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incidents-by-site.component.html',
  styleUrl: './incidents-by-site.component.css'
})
export class IncidentsBySiteComponent implements OnInit {
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
    // Ne5tarou el chhar el 7ali wala el 3am el 7ali k-default
    const currentVal = this.currentType === 'month' ? [new Date().getMonth() + 1] : [new Date().getFullYear()];

    this.store.getKpiDatapro('incidents_by_site', this.currentType, currentVal).subscribe({
      next: (data) => {
        // Madem el data jaya { "3": [{plant_name: 'X', count: 5}] }
        // Ne5thou el lista mta3 el chhar/3am elli 3ayetlou
        const statsArray = data[currentVal[0]] || [];
        
        const labels = statsArray.map((item: any) => item.plant_name);
        const counts = statsArray.map((item: any) => item.count);

        this.createChart(labels, counts);
      },
      error: (err) => console.error('Error fetching site stats', err)
    });
  }

  createChart(labels: string[], values: any[]) {
    if (this.myChart) { this.myChart.destroy(); }

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--sys-primary').trim();
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--sys-on-surface').trim();

    this.myChart = new Chart(this.chartRef().nativeElement, {
      type: 'bar',
      plugins: [ChartDataLabels],
      data: {
        labels: labels,
        datasets: [{
          label: 'Incidents per Site',
          data: values,
          backgroundColor: 'rgba(99, 102, 241, 0.8)', // Indigo transparent chwaya
          borderColor: primaryColor,
          borderWidth: 1,
          borderRadius: 4,
          barThickness: 15,
        }]
      },
      options: {
        indexAxis: 'y', // Horizontal bars
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            anchor: 'end',
            align: 'right',
            color: textColor,
            font: { weight: 'bold', size: 11 },
            formatter: (val) => val
          }
        },
        scales: {
          x: { display: false }, // Na7iw el axe loutani khater el arkam fo9 el bars
          y: {
            grid: { display: false },
            ticks: {
              color: 'rgba(200, 200, 200, 0.9)',
              font: { size: 11, family: 'Inter' }
            }
          }
        },
        layout: { padding: { right: 30 } }
      }
    });
  }
}