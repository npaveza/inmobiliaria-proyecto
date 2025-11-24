import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private apiUrl = `${environment.apiUrl}/pagos`;

  constructor(private http: HttpClient) {}

  getPagos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPago(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createPago(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updatePago(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deletePago(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
