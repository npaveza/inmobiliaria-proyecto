import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {

  private apiUrl = `${environment.apiUrl}/calificacion`;

  constructor(private http: HttpClient) {}

  getCalificaciones(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCalificacion(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createCalificacion(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateCalificacion(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteCalificacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
