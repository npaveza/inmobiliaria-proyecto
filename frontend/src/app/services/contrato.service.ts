import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private apiUrl = `${environment.apiUrl}/contratos`;

  constructor(private http: HttpClient) {}

  getContratos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getContrato(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createContrato(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateContrato(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteContrato(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
