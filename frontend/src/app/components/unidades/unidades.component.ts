import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { ProyectoService } from '../../services/proyecto.service';
import { UnidadService } from '../../services/unidad.service';

interface Unidad {
  id: string;
  numero_unidad: string;
  tipo_unidad: string;
  metraje: number;
  precio_venta: number;
  estado: string;
  proyecto_id: string;
  cliente_id: string;
}

@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit {
  unidades: Unidad[] = [];
  proyectos: any[] = [];
  clientes: any[] = [];

  unidadForm = new FormGroup({
    numero_unidad: new FormControl<string | null>('', Validators.required),
    tipo_unidad: new FormControl<string | null>('', Validators.required),
    metraje: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^[1-9][0-9]*$/)
    ]),
    precio_venta: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^[1-9][0-9]*$/)
    ]),
    estado: new FormControl<string | null>('', Validators.required),
    proyecto_id: new FormControl<string | null>('', Validators.required),
    cliente_id: new FormControl<string | null>('')
  });

  mostrarFormulario = false;
  unidadCreada = false;
  unidadEditada = false;

  unidadSeleccionada: any = null;
  modoEdicion = false;

  constructor(
    private unidadService: UnidadService,
    private proyectoService: ProyectoService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.unidadService.getUnidades().subscribe(response => {
      this.unidades = response.data.map((u: any) => ({
        ...u,
        metraje: Number(u.metraje) > 0 ? Number(u.metraje) : 1,
        precio_venta: Number(u.precio_venta) > 0 ? Number(u.precio_venta) : 1
      }));
    });

    this.proyectoService.getProyectos().subscribe(response => {
      this.proyectos = response.data;
    });

    this.clienteService.getClientes().subscribe((response: any) => {
      this.clientes = response.data;
    });
  }

  crearUnidad(): void {
    if (!this.unidadForm.valid) {
      this.unidadForm.markAllAsTouched();
      alert("Los valores deben ser mayores a 0");
      return;
    }

    const metraje = Number(this.unidadForm.value.metraje);
    const precio = Number(this.unidadForm.value.precio_venta);

    if (metraje < 1 || precio < 1 || isNaN(metraje) || isNaN(precio)) {
      alert("Valores inválidos: deben ser mayores a 0.");
      return;
    }

    const unidadData: any = {
      ...this.unidadForm.value,
      metraje,
      precio_venta: precio
    };

    if (this.modoEdicion) {
      this.editar(unidadData);
    } else {
      this.crear(unidadData);
    }
  }

  private crear(unidad: any) {
    this.unidadService.crearUnidad(unidad).subscribe(() => {
      this.unidadService.getUnidades().subscribe(response => {
        this.unidades = response.data;
        this.unidadForm.reset();
        this.mostrarFormulario = false;
        this.unidadCreada = true;
        setTimeout(() => this.unidadCreada = false, 2000);
      });
    });
  }

  private editar(unidad: any) {
    const id = this.unidadSeleccionada.id;

    this.unidadService.editarUnidad(id, unidad).subscribe(() => {
      this.unidadService.getUnidades().subscribe(response => {
        this.unidades = response.data;
        this.unidadForm.reset();
        this.mostrarFormulario = false;
        this.unidadEditada = true;
        setTimeout(() => this.unidadEditada = false, 2000);
      });
    });
  }

  editarUnidad(unidad: any): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.unidadSeleccionada = unidad;

    this.unidadForm.patchValue({
      numero_unidad: unidad.numero_unidad,
      tipo_unidad: unidad.tipo_unidad,
      metraje: unidad.metraje,
      precio_venta: unidad.precio_venta,
      estado: unidad.estado,
      proyecto_id: unidad.proyecto_id,
      cliente_id: unidad.cliente_id
    });
  }

  eliminarUnidad(unidad: any): void {
    this.unidadService.eliminarUnidad(unidad.id).subscribe(() => {
      this.unidadService.getUnidades().subscribe(response => {
        this.unidades = response.data;
      });
    });
  }

  getProyectoNombre(id: string): string {
    const proyecto = this.proyectos.find(p => p.id === id);
    return proyecto ? proyecto.nombre : '';
  }

  getClienteRut(id: string): string {
    const cliente = this.clientes.find(c => c.id === id);
    return cliente ? cliente.rut : '';
  }
}
