import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

interface Proyecto {
  id: number;
  nombre: string;
  ubicacion: string;
  descripcion: string;
}

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  proyectos: Proyecto[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getProyectos().subscribe(response => {
      this.proyectos = response as Proyecto[];
    });
  }
}