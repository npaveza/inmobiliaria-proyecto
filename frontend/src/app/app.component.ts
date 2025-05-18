import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProyectosComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inmobiliaria-frontend';
}