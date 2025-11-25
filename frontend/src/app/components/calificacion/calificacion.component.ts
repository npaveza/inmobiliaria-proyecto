import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CalificacionService } from '../../services/calificacion.service';
import { ContratoService } from '../../services/contrato.service';

@Component({
  selector: 'app-calificacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent implements OnInit, OnDestroy {
  calificaciones: any[] = [];
  contratos: any[] = [];
  califForm: FormGroup;

  loading = false;
  saving = false;
  error: string | null = null;

  private subs: Subscription[] = [];

  constructor(
    private calificacionService: CalificacionService,
    private contratoService: ContratoService,
    private fb: FormBuilder
  ) {
    this.califForm = this.fb.group({
      contrato_id: ['', Validators.required],
      cliente_id: ['', Validators.required],
      unidad_id: [''],
      proyecto_id: [''],
      puntaje: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['']
    });
  }

  ngOnInit(): void {
    this.loadLookups();
    this.loadCalificaciones();
  }

  loadLookups() {
    this.loading = true;
    const s = this.contratoService.getContratos().subscribe({
      next: (res: any) => {
        this.contratos = Array.isArray(res) ? res : (res.data || []);
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Error cargando contratos';
        this.loading = false;
      }
    });
    this.subs.push(s);
  }

  loadCalificaciones() {
    this.loading = true;
    const s = this.calificacionService.getCalificaciones().subscribe({
      next: (res: any) => {
        this.calificaciones = Array.isArray(res) ? res : (res.data || []);
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Error cargando calificaciones';
        this.loading = false;
      }
    });
    this.subs.push(s);
  }

  crearCalificacion() {
    if (this.califForm.invalid) {
      this.califForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    const payload = this.califForm.value;
    const s = this.calificacionService.createCalificacion(payload).subscribe({
      next: res => {
        this.saving = false;
        this.califForm.reset({ puntaje: 5 });
        this.loadCalificaciones();
      },
      error: err => {
        console.error(err);
        this.error = err?.error?.message || 'Error creando calificación';
        this.saving = false;
      }
    });
    this.subs.push(s);
  }

  eliminarCalificacion(id: number) {
    if (!confirm('¿Eliminar calificación?')) return;
    const s = this.calificacionService.deleteCalificacion(id).subscribe({
      next: () => this.loadCalificaciones(),
      error: err => {
        console.error(err);
        this.error = 'Error eliminando calificación';
      }
    });
    this.subs.push(s);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe && s.unsubscribe());
  }
}
