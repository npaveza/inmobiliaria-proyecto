import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProyectoService } from '../../services/proyecto.service';

interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {
  proyectos: Proyecto[] = [];
  proyectoForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    ubicacion: new FormControl('', Validators.required),
    fecha_inicio: new FormControl('', Validators.required),
    fecha_fin: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required)
  });
  mostrarFormulario = false;
  proyectoCreado = false;
  proyectoEditado = false;
  proyectoSeleccionado: any = null;
  modoEdicion = false;

  constructor(private proyectoService: ProyectoService) { }

  mostrarFormularioCrear(): void {
    this.mostrarFormulario = true;
    this.modoEdicion = false;
    this.proyectoForm.reset();
  }

  ngOnInit(): void {
    this.proyectoService.getProyectos().subscribe({
      next: (response: any) => {
        console.log('Proyectos obtenidos:', response);
        this.proyectos = response.data;
      },
      error: (error: any) => {
        console.error('Error al obtener proyectos:', error);
      }
    });
  }

  crearProyecto(): void {
    if (this.proyectoForm.valid) {
      const proyecto = this.proyectoForm.value as Proyecto;
      if (this.modoEdicion) {
        this.proyectoService.editarProyecto(this.proyectoSeleccionado.id, proyecto).subscribe({
          next: (response: any) => {
            console.log(response);
            this.proyectoService.getProyectos().subscribe((response: any) => {
              this.proyectos = response.data;
              this.proyectoForm.reset();
              this.mostrarFormulario = false;
              this.proyectoEditado = true;
              setTimeout(() => {
                this.proyectoEditado = false;
              }, 2000);
            });
          },
          error: (error: any) => {
            console.error(error);
          }
        });
      } else {
        this.proyectoService.crearProyecto(proyecto).subscribe({
          next: (response: any) => {
            console.log(response);
            this.proyectoService.getProyectos().subscribe((response: any) => {
              this.proyectos = response.data;
              this.proyectoForm.reset();
              this.mostrarFormulario = false;
              this.proyectoCreado = true;
              setTimeout(() => {
                this.proyectoCreado = false;
              }, 2000);
            });
          },
          error: (error: any) => {
            console.error(error);
          }
        });
      }
    } else {
      this.proyectoForm.markAllAsTouched();
    }
  }

  editarProyecto(proyecto: any): void {
    this.mostrarFormulario = true;
    this.modoEdicion = true;
    this.proyectoSeleccionado = proyecto;
    this.proyectoForm.patchValue({
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      ubicacion: proyecto.ubicacion,
      fecha_inicio: proyecto.fecha_inicio,
      fecha_fin: proyecto.fecha_fin,
      estado: proyecto.estado
    });
  }

  eliminarProyecto(proyecto: any): void {
    this.proyectoService.eliminarProyecto(proyecto.id).subscribe(() => {
      this.proyectoService.getProyectos().subscribe((response: any) => {
        this.proyectos = response.data;
      });
    });
  }
}