import { computed, effect, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardItem } from '../../pages/module/dashboar';
import { MTTDComponent } from '../../pages/dashboard/mttd/mttd.component';
import { MttrComponent } from '../../pages/dashboard/mttr/mttr.component';
import { MTTAComponent } from '../../dashboard/widget/mtta.component';
import { FalsePositiveComponent } from '../../pages/dashboard/false_positive/false-positive/false-positive.component';
import { TruePositivesComponent } from '../../pages/dashboard/true_positives/true-positives/true-positives.component';
import { OpenIncidentsComponent } from '../../pages/dashboard/open_incidents/open-incidents/open-incidents.component';
import { ClosedIncidentsComponent } from '../../pages/dashboard/closed_incidents/closed-incidents/closed-incidents.component';
import { IncidentsBySiteComponent } from '../../pages/dashboard/incidents_by_site/incidents-by-site/incidents-by-site.component';
import { TypeComponent } from '../../pages/dashboard/incidents_by_type/type/type.component';
import { CategorieComponent } from '../../pages/dashboard/incidents_by_categorie/categorie/categorie.component';
import { AnalystComponent } from '../../pages/dashboard/incidents_by_analyst/analyst/analyst.component';

@Injectable({
  providedIn: 'root'
})
export class KpisService {
  private apiUrl = 'http://localhost:8000/api/incidents'; 
  widgets = signal<DashboardItem[]> ([ 
    {
         id:1,
         label:'MTTD',
         content:MTTDComponent,
         rows:1,
         columns:2,
         backgroundColor: '#003f5c',
         color:'whitesmoke'
       },
      {
         id:2,
         label:'MTTR',
         content:MttrComponent,
         rows:1,
         columns:2,
         backgroundColor: '#003f5c',
         color:'whitesmoke'
       },
       {
         id:3,
         label:'MTTA',
         content:MTTAComponent,
         rows:1,
         columns:2,
         backgroundColor: '#003f5c',
         color:'whitesmoke'
       },
      {
         id:4,
         label:'false-positive',
         content:FalsePositiveComponent,
         rows:2,
         columns:2,
       },
       {
         id:5,
         label:'true-positive',
         content:TruePositivesComponent,
         rows:2,
         columns:2
       },
       {
         id:6,
         label:'open-incident',
         content:OpenIncidentsComponent,
         rows:2,
         columns:3
       },
       {
         id:7,
         label:'closed-incident',
         content:ClosedIncidentsComponent,
         rows:2,
         columns:2
       },
      {
         id:8,
         label:'incident-by-site',
         content:IncidentsBySiteComponent,
         rows:2,
         columns:2
       },
       {
         id:9,
         label:'incident-by-type',
         content:TypeComponent,
         rows:2,
         columns:2
       },
       {
         id:10,
         label:'incident-by-categorie',
         content:CategorieComponent,
         rows:2,
         columns:2
       },
       {
         id:11,
         label:'incident-by-analyst',
         content:AnalystComponent,
         rows:2,
         columns:2
       },
      
      ]);

  addedWidgets = signal<DashboardItem[]>([
  ]);
  
  widgetsToAdd = computed(()=> {
    const addedIds = this.addedWidgets().map(w => w.id);
    return this.widgets().filter(w => !addedIds.includes(w.id));
  });
  




  constructor(private http: HttpClient) {
    this.fetchWidgets();
  }

  fetchWidgets(){
    const widgetsAsString = localStorage.getItem('dashboardwidgets');
    if (widgetsAsString) {
      const widgets = JSON.parse(widgetsAsString) as DashboardItem[];
      widgets.forEach(widget => {
      const content = this.widgets().find(w => w.id === widget.id)?.content;
      if (content) {
        widget.content = content;
      }
    })
    this.addedWidgets.set(widgets);
  }
  }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
 // Method wa7da generique l-kol KPIs
  getKpiData(endpoint: string, year?: number, month?: number): Observable<any> {
    let params = new HttpParams();
    
    if (year) params = params.set('year', year.toString());
    if (month) params = params.set('month', month.toString());

    // URL: http://localhost:8000/api/incidents/mttd/?year=2026&month=3
    return this.http.get<any>(`${this.apiUrl}/${endpoint}/`, { params, headers: this.getHeaders() });
  }
  getKpiDatapro(endpoint: string, type: 'month' | 'year', values: number[]): Observable<any> {
    let params = new HttpParams()
      .set('type', type)
      .set('values', values.join(',')); // t-7awel [1, 2, 3] l- "1,2,3"

    // URL twalli: http://localhost:8000/api/incidents/get_mttd_stats/?type=month&values=1,2,3
    return this.http.get<any>(`${this.apiUrl}/${endpoint}/`, { 
      params, 
      headers: this.getHeaders() 
    });
}
  addWidget(widget: DashboardItem) {
    this.addedWidgets.set([...this.addedWidgets(), {...widget}]);
  }
  updateWidget(id: number,widget: Partial<DashboardItem>) {
    const index = this.addedWidgets().findIndex(w => w.id === id);
    if (index !== -1) {
      const newWidgets = [...this.addedWidgets()];
      newWidgets[index] = { ...newWidgets[index], ...widget };
      this.addedWidgets.set(newWidgets);
    }
  }
  moveWidgetToRight(id: number) {
     const index = this.addedWidgets().findIndex(w => w.id === id);
     if ( index === this.addedWidgets().length - 1) return; // Already at the rightmost position
     const newWidgets = [...this.addedWidgets()];
      [newWidgets[index], newWidgets[index + 1]] = [{...newWidgets[index + 1]}, {...newWidgets[index]}];
      this.addedWidgets.set(newWidgets);
  }
   moveWidgetToLeft(id: number) {
     const index = this.addedWidgets().findIndex(w => w.id === id);
     if ( index === 0) return; // Already at the leftmost position
     const newWidgets = [...this.addedWidgets()];
      [newWidgets[index], newWidgets[index - 1]] = [{...newWidgets[index - 1]}, {...newWidgets[index]}];
      this.addedWidgets.set(newWidgets);
  }
  removeWidget(id: number) {
    this.addedWidgets.set(this.addedWidgets().filter(w => w.id !== id));
  }
  saveWidgets = effect(() => {
    const widgetsWithoutContent: Partial<DashboardItem>[] = this.addedWidgets().map(w => ({ ...w }));
    widgetsWithoutContent.forEach(w => {
      delete w.content;
    });
    localStorage.setItem('dashboardwidgets', JSON.stringify(widgetsWithoutContent));

  });

  updatewidgetPosition(sourcewidgetId:number,targetWidgetId:number){
    const sourceIndex = this.addedWidgets().findIndex(
      (w) => w.id === sourcewidgetId
    );
    if(sourceIndex === -1){
      return;
    }
    const newWidgets = [...this.addedWidgets()];
    const sourceWidget = newWidgets.splice(sourceIndex,1)[0];

    const targetIndex = newWidgets.findIndex((w) => w.id === targetWidgetId);
    if(targetIndex === -1){
      return;
    }
    const insertAt = targetIndex === sourceIndex ? targetIndex + 1 : targetIndex;
    newWidgets.splice(insertAt, 0, sourceWidget);
    this.addedWidgets.set(newWidgets);
  }
}