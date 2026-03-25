import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private apiUrl = 'http://127.0.0.1:8000';
private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient) { }
getCurrentUserId(): string | null {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  
  try {
    const decoded: any = jwtDecode(token);
    return decoded.user_id || null; // Houni rjja3na l-user_id (5)
  } catch {
    return null;
  }
}
refreshProfile() {
    this.getProfile().subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: () => this.currentUserSubject.next(null)
    });
  }
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/accounts/login/`, credentials).pipe(
      tap((res: any) => {
        // Nkhabiw el Token (access w refresh) fi localStorage
        if (res.access) {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
          this.refreshProfile();
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/accounts/register/`, userData);
  }
  getProfile(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/accounts/profile/`, { headers });
  }
  logout(): Observable<any> {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  // N-zidou el Header bch n-na7iw el 401 Unauthorized
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${accessToken}`
  });

  return this.http.post(`${this.apiUrl}/accounts/logout/`, 
    { refresh: refreshToken }, 
    { headers } // Aba3th el headers houni
  ).pipe(
    tap(() => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    })
  );
}
    verifieremail(email: string, code: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/accounts/verify-email/`, { email, code });
}
   



}
