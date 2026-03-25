import { Component, ElementRef, inject, OnInit, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import Chart from 'chart.js/auto'
import { KpisService } from '../../../../services/KPIs/kpis.service';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

@Component({
  selector: 'app-true-positives',
  imports: [MatButtonModule],
  templateUrl: './true-positives.component.html',
  styleUrl: './true-positives.component.css'
})
export class TruePositivesComponent implements OnInit{
  store = inject(KpisService);
  chartRef = viewChild.required<ElementRef>('chart');
  myChart: any;

  // Variable bch na3rfou ana type tawa
  currentType: 'month' | 'year' = 'month';

  ngOnInit() {
    this.updateStats(); // N-lansiwha f-el bideya
  }

  // Fonction bch t-baddel el type w t-lansi el API
  toggleType(type: 'month' | 'year') {
    this.currentType = type;
    this.updateStats();
  }

  updateStats() {
    // 1. Ne5tarou el values 3ala 7asb el type
    const values = this.currentType === 'month' 
      ? [1, 2, 3, 4, 5, 6] // Chhour
      : [2024, 2025, 2026]; // A3wem

    this.store.getKpiDatapro('get_true_positives_stats', this.currentType, values).subscribe({
      next: (data) => {
        // 2. Formatage mta3 el labels (Ken ch-har n-rodouh Ism, ken 3am nkhallouh kima houwa)
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

    const primaryColor =  '#f16368';
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--sys-on-surface').trim() || '#ffffff';

    this.myChart = new Chart(this.chartRef().nativeElement, {
      type: 'bar',
      plugins: [ChartDataLabels], // <--- Activate the plugin here
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