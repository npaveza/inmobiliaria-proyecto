// src/app/services/pago.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Pago {
  id: number;
  contrato_id: number;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
  estado: string;
  contrato?: any; // opcional si backend devuelve relación
}

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private base = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getPagos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.base}/pagos`);
  }

  getPago(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.base}/pagos/${id}`);
  }

  createPago(pago: Partial<Pago>): Observable<Pago> {
    return this.http.post<Pago>(`${this.base}/pagos`, pago);
  }

  updatePago(id: number, pago: Partial<Pago>): Observable<Pago> {
    return this.http.put<Pago>(`${this.base}/pagos/${id}`, pago);
  }

  deletePago(id: number): Observable<any> {
    return this.http.delete(`${this.base}/pagos/${id}`);
  }

  // helper: obtener pagos por contrato (si quieres)
  getPagosByContrato(contratoId: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.base}/pagos?contrato_id=${contratoId}`);
  }
}
