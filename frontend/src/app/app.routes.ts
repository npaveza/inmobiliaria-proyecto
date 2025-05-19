import { Routes } from '@angular/router';
import { ClientesComponent } from './components/clientes/clientes.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login-modal/login-modal.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';
import { UnidadesComponent } from './components/unidades/unidades.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'proyectos', component: ProyectosComponent },
    { path: 'clientes', component: ClientesComponent },
    { path: 'unidades', component: UnidadesComponent },
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegisterModalComponent },
];