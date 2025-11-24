import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { CalificacionService } from '../../services/calificacion.service';
import { ClienteService } from '../../services/cliente.service';
import { ContratoService } from '../../services/contrato.service';


@Component({
  selector: 'app-calificacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calificacion.component.html',
  styleUrl: './calificacion.component.css'
})
export class CalificacionComponent implements OnInit, OnDestroy {

  calificacionForm: FormGroup;
  calificaciones: any[] = [];
  clientes: any[] = [];
  contratos: any[] = [];

  loading = false;
  saving = false;
  error: string | null = null;

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private calificacionService: CalificacionService,
    private clienteService: ClienteService,
    private contratoService: ContratoService
  ) {
    this.calificacionForm = this.fb.group({
      cliente_id: ['', Validators.required],
      contrato_id: ['', Validators.required],
      puntuacion: ['5', [Validators.required]],
      comentario: ['']
    });
  }

  ngOnInit(): void {
    this.loadLookup();
    this.loadCalificaciones();
  }

  private loadLookup() {
    this.loading = true;
    const clientes$ = this.clienteService.getClientes();
    const contratos$ = this.contratoService.getContratos();

    const s = forkJoin([clientes$, contratos$]).subscribe({
      next: ([clientes, contratos]: any) => {
        this.clientes = clientes;
        this.contratos = contratos;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Error cargando clientes o contratos';
        this.loading = false;
      }
    });

    this.subs.push(s);
  }

  loadCalificaciones() {
    this.loading = true;
    const s = this.calificacionService.getCalificaciones().subscribe({
      next: (res: any) => { this.calificaciones = res; this.loading = false; },
      error: err => { console.error(err); this.error = 'Error cargando calificaciones'; this.loading = false; }
    });
    this.subs.push(s);
  }

  crearCalificacion() {
    if (this.calificacionForm.invalid) {
      this.calificacionForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const payload = this.calificacionForm.value;
    const s = this.calificacionService.createCalificacion(payload).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.calificacionForm.reset({ puntuacion: '5' });
        this.loadCalificaciones();
      },
      error: err => {
        console.error(err);
        this.error = err?.error?.message || 'Error registrando calificación';
        this.saving = false;
      }
    });

    this.subs.push(s);
  }

  eliminarCalificacion(id: number) {
    if (!confirm('¿Eliminar calificación?')) return;
    const s = this.calificacionService.deleteCalificacion(id).subscribe({
      next: () => this.loadCalificaciones(),
      error: err => { console.error(err); this.error = 'Error eliminando calificación'; }
    });
    this.subs.push(s);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe && s.unsubscribe());
  }
}