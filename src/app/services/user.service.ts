// src/app/admin/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  role_display: string;
  telephone: string;
  is_approved: boolean;
  is_verified: boolean;
  is_online: boolean;
  is_active: boolean;
  last_login_time: string | null;
  date_joined: string;
}

export interface UserStats {
  total: number;
  approved: number;
  pending: number;
  online: number;
  by_role: Record<string, number>;
}

export interface UserFilters {
  role?: string;
  is_approved?: boolean;
  is_active?: boolean;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = 'http://localhost:8000/api/admin/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.base}/stats/`, {
      headers: this.getHeaders()
    });
  }

  getUsers(filters: UserFilters = {}): Observable<User[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return this.http.get<User[]>(`${this.base}/`, {
      params,
      headers: this.getHeaders()
    });
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.base}/${id}/`, {
      headers: this.getHeaders()
    });
  }

  createUser(data: Partial<User> & { password: string }): Observable<User> {
    return this.http.post<User>(`${this.base}/`, data, {
      headers: this.getHeaders()
    });
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.base}/${id}/`, data, {
      headers: this.getHeaders()
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}/`, {
      headers: this.getHeaders()
    });
  }

  approveUser(id: number): Observable<any> {
    return this.http.patch(`${this.base}/${id}/approve/`, {}, {
      headers: this.getHeaders()
    });
  }

  rejectUser(id: number): Observable<any> {
    return this.http.patch(`${this.base}/${id}/reject/`, {}, {
      headers: this.getHeaders()
    });
  }

  bulkAction(ids: number[], action: string): Observable<any> {
    return this.http.post(`${this.base}/bulk/`, { ids, action }, {
      headers: this.getHeaders()
    });
  }
}