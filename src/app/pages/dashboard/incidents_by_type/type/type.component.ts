import { Component, ElementRef, inject, viewChild, OnInit } from '@angular/core';
import { KpisService } from '../../../../services/KPIs/kpis.service';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-type',
  imports: [CommonModule],
  templateUrl: './type.component.html',
  styleUrl: './type.component.css'
})
export class TypeComponent implements OnInit {
  store = inject(KpisService);
  chartRef = viewChild.required<ElementRef>('chart');
  myChart: any;
  currentType: 'month' | 'year' = 'month';
  
  // Variable bch n-7ottu fiha el Total summation
  totalIncidents: number = 0;

  ngOnInit() {
    this.updateStats();
  }

  toggleType(type: 'month' | 'year') {
    this.currentType = type;
    this.updateStats();
  }

  updateStats() {
    const values = this.currentType === 'month' ? [1, 2, 3, 4, 5, 6] : [2024, 2025, 2026];
    
    this.store.getKpiDatapro('incidents_by_type', this.currentType, values).subscribe({
      next: (data: any) => {
        console.log("Raw Data from API:", data);
        const totalsMap = new Map<string, number>();
        let grandTotal = 0;

        Object.values(data).forEach((monthData: any) => {
          // monthData hna hiya el Array kima [ {severity_level: 'High', count: 2}, ... ]
          if (Array.isArray(monthData)) {
            monthData.forEach((item: any) => {
              // 1. NESTHA3MLOU severity_level kima jé mel API
              // 2. Kenou null, n-sammiweh "Unspecified" bch ma i-fasedch el chart
              const label = item.severity_level || 'Unspecified';
              const count = item.count || 0;

              const currentCount = totalsMap.get(label) || 0;
              totalsMap.set(label, currentCount + count);
              grandTotal += count;
            });
          }
        });

        // N-kharjou el Labels wel Values m-ritylin
        const labels = Array.from(totalsMap.keys());
        const valuesData = Array.from(totalsMap.values());

        this.totalIncidents = grandTotal;

        if (labels.length > 0) {
          this.createChart(labels, valuesData);
        } else {
          console.warn("No data found to display in chart");
          if (this.myChart) { this.myChart.destroy(); }
        }
      },
      error: (err) => console.error('Error fetching KPI data', err)
    });
  }
  createChart(labels: string[], values: any[]) {
    if (this.myChart) { this.myChart.destroy(); }

    this.myChart = new Chart(this.chartRef().nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#e74c3c', // Critical
            '#e67e22', // High
            '#3498db', // Medium
            '#2ecc71', // Low
            '#9b59b6'  // Others
          ],
          borderColor: 'transparent',
          borderRadius: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'rgba(200, 200, 200, 0.9)',
              font: { size: 11, weight: 'bold' }
            }
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
