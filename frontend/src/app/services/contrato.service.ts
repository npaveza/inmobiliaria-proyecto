// src/app/services/contrato.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Contrato {
  id: number;
  cliente_id: string;
  unidad_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  monto_total: number;
  tipo_contrato: string;
  estado: string;

  // relaciones opcionales que puede devolver el backend
  cliente?: {
    id?: string;
    nombre?: string;
    apellido?: string;
    [key: string]: any;
  };
  unidad?: {
    id?: string;
    numero_unidad?: string;
    estado?: string;
    [key: string]: any;
  };
  pagos?: any[];
  calificacion?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private base = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getContratos(): Observable<Contrato[]> {
    return this.http.get<Contrato[]>(`${this.base}/contratos`);
  }

  getContrato(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.base}/contratos/${id}`);
  }

  createContrato(contrato: Partial<Contrato>): Observable<Contrato> {
    return this.http.post<Contrato>(`${this.base}/contratos`, contrato);
  }

  updateContrato(id: number, contrato: Partial<Contrato>): Observable<Contrato> {
    return this.http.put<Contrato>(`${this.base}/contratos/${id}`, contrato);
  }

  deleteContrato(id: number): Observable<any> {
    return this.http.delete(`${this.base}/contratos/${id}`);
  }
}
