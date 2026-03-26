import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AiService {
  // Thabbet f-el URL mte3ek hasb el urls.py f-Django
  private apiUrl = 'http://127.0.0.1:8000/todo/ai-advisor/'; 

  constructor(private http: HttpClient) { }

  askAi(type: string, description: string): Observable<any> {
    const token = localStorage.getItem('access_token'); // walla esm el token mte3ek
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });

    return this.http.post(this.apiUrl, { type, description }, { headers });
}
}