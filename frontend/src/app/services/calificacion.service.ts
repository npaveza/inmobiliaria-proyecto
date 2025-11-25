// src/app/services/calificacion.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Calificacion {
  id: number;
  contrato_id: number;
  cliente_id: string;
  unidad_id?: string;
  proyecto_id?: string;
  puntaje: number;
  comentario?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {
  private base = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getCalificaciones(): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(`${this.base}/calificacion`);
  }

  getCalificacion(id: number): Observable<Calificacion> {
    return this.http.get<Calificacion>(`${this.base}/calificacion/${id}`);
  }

  createCalificacion(data: Partial<Calificacion>): Observable<Calificacion> {
    return this.http.post<Calificacion>(`${this.base}/calificacion`, data);
  }

  updateCalificacion(id: number, data: Partial<Calificacion>): Observable<Calificacion> {
    return this.http.put<Calificacion>(`${this.base}/calificacion/${id}`, data);
  }

  deleteCalificacion(id: number): Observable<any> {
    return this.http.delete(`${this.base}/calificacion/${id}`);
  }

  getByContrato(contratoId: number): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(`${this.base}/calificacion?contrato_id=${contratoId}`);
  }
}
