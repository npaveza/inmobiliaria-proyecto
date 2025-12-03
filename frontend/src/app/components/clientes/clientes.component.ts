import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

interface Cliente {
  id?: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteForm = new FormGroup({
    rut: new FormControl('', [Validators.required, validarRut]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(2)]),
    apellido: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{9}$/)
    ])
  });

  mostrarFormulario = false;
  clienteCreado = false;
  clienteEditado = false;
  clienteSeleccionado: any = null;
  modoEdicion = false;

  constructor(private clienteService: ClienteService) { }

  mostrarFormularioCrear(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.clienteForm.reset();
  }

  ngOnInit(): void {
    this.clienteService.getClientes().subscribe({
      next: (response: any) => {
        console.log('Clientes obtenidos:', response);
        this.clientes = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener clientes:', error);
      }
    });
  }

  crearCliente(): void {
    if (this.clienteForm.valid) {

      const cliente = this.clienteForm.value as Cliente;

      if (this.modoEdicion) {
        this.clienteService.editarCliente(this.clienteSeleccionado.id, cliente).subscribe({
          next: (response: any) => {
            this.clienteService.getClientes().subscribe((response: any) => {
              this.clientes = response.data;
              this.clienteForm.reset();
              this.mostrarFormulario = false;
              this.clienteEditado = true;
              setTimeout(() => this.clienteEditado = false, 2000);
            });
          },
          error: (error: any) => console.error(error)
        });

      } else {
        this.clienteService.crearCliente(cliente).subscribe({
          next: (response: any) => {
            this.clienteService.getClientes().subscribe((response: any) => {
              this.clientes = response.data;
              this.clienteForm.reset();
              this.mostrarFormulario = false;
              this.clienteCreado = true;
              setTimeout(() => this.clienteCreado = false, 2000);
            });
          },
          error: (error: any) => console.error(error)
        });
      }

    } else {
      this.clienteForm.markAllAsTouched();
    }
  }


  editarCliente(id: number, cliente: Cliente): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.clienteSeleccionado = cliente;
    this.clienteForm.patchValue({
      rut: cliente.rut,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono
    });
  }

  eliminarCliente(cliente: any): void {
  this.clienteService.eliminarCliente(cliente.id).subscribe({
    next: () => {
      this.clienteService.getClientes().subscribe((response: any) => {
        this.clientes = response.data;
      });
    },
    error: (error: any) => {
      console.error('Error al eliminar cliente:', error);
      this.clientes = []; // opcional, para tu test
    }
  });
}
}

// ---- VALIDACIÓN REAL DE RUT ----
function validarRut(control: AbstractControl): ValidationErrors | null {
  const rut = control.value?.toString().trim();
  if (!rut) return { required: true };

  const rutRegex = /^[0-9]+-[0-9kK]{1}$/;
  if (!rutRegex.test(rut)) return { formatoInvalido: true };

  const [cuerpo, dv] = rut.split('-');
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvCalculado =
    dvEsperado === 11 ? '0' :
      dvEsperado === 10 ? 'k' :
        dvEsperado.toString();

  return dv.toLowerCase() === dvCalculado ? null : { rutInvalido: true };
}
