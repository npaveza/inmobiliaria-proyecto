import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, forkJoin } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import { PagoService } from '../../services/pago.service';
import { UnidadService } from '../../services/unidad.service';

@Component({
  selector: 'app-pagos',
  standalone: true,
  templateUrl: './pagos.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class PagosComponent implements OnInit, OnDestroy {

  pagoForm: FormGroup;
  pagos: any[] = [];
  clientes: any[] = [];
  unidades: any[] = [];

  loading = false;
  saving = false;
  error: string | null = null;

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private pagoService: PagoService,
    private clienteService: ClienteService,
    private unidadService: UnidadService
  ) {
    this.pagoForm = this.fb.group({
      cliente_id: ['', Validators.required],
      unidad_id: ['', Validators.required],
      metodo: ['', Validators.required],
      monto: ['', [Validators.required, Validators.min(0)]],
      fecha_pago: ['', Validators.required],
      estado: ['pendiente', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.loadPagos();
  }

  private loadInitialData() {
    this.loading = true;

    const s = forkJoin([
      this.clienteService.getClientes(),
      this.unidadService.getUnidades()
    ]).subscribe({
      next: ([clientes, unidades]: any) => {
        this.clientes = clientes;
        this.unidades = unidades;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Error cargando datos iniciales';
        this.loading = false;
      }
    });

    this.subs.push(s);
  }

  loadPagos() {
    this.loading = true;
    const s = this.pagoService.getPagos().subscribe({
      next: (res: any) => { this.pagos = res; this.loading = false; },
      error: err => { console.error(err); this.error = 'Error cargando pagos'; this.loading = false; }
    });
    this.subs.push(s);
  }

  crearPago() {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    const payload = this.pagoForm.value;
    const s = this.pagoService.createPago(payload).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.pagoForm.reset({ estado: 'pendiente' });
        this.loadPagos();
      },
      error: err => {
        console.error(err);
        this.error = err?.error?.message || 'Error registrando pago';
        this.saving = false;
      }
    });
    this.subs.push(s);
  }

  eliminarPago(id: number) {
    if (!confirm('¿Eliminar pago? Esta acción no se puede deshacer.')) return;
    const s = this.pagoService.deletePago(id).subscribe({
      next: () => { this.loadPagos(); },
      error: err => { console.error(err); this.error = 'Error eliminando pago'; }
    });
    this.subs.push(s);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe && s.unsubscribe());
  }
}
