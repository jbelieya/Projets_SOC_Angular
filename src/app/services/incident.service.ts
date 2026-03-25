import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
private apiUrl = 'http://localhost:8000/api/incidents'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/`, { headers });
  }

  // 2. Get Single (Détails)
  getById(id: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/${id}/`, { headers });
  }

  // 3. Create New Incident
  create(data: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/`, data, { headers });
  }

  // 4. Acknowledge (Action)
  acknowledge(id: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/${id}/acknowledge/`, {},
       { headers }
    );
  }

  // 5. Investigate (Patch - Update field by field)
  investigate(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.patch<any>(`${this.apiUrl}/${id}/investigate/`, data, { headers });
  }

  // 6. Close Incident (Action)
  close(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/${id}/close_incident/`, data, { headers });
  }
  updateincident(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/${id}/`, data, { headers });
  }
  downloadRapport(incidentId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // N-7ottou responseType: 'blob' bch Angular y-fhem ennou m-ich JSON
    return this.http.get(`${this.apiUrl}/${incidentId}/export_incident_pdf/`, {
      responseType: 'blob',headers
    });
  }
}
