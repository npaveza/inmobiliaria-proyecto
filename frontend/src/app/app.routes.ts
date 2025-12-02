import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login-modal/login-modal.component';
import { RegisterModalComponent } from './components/register-modal/register-modal.component';

import { BuscarContratoComponent } from './components/buscar-contrato/buscar-contrato.component';
import { CalificacionComponent } from './components/calificacion/calificacion.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ContratosComponent } from './components/contratos/contratos.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { ProyectosComponent } from './components/proyectos/proyectos.component';
import { UnidadesComponent } from './components/unidades/unidades.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },

    // AUTENTICACIÓN
    { path: 'login', component: LoginComponent },
    { path: 'registro', component: RegisterModalComponent },

    // PÁGINAS PRINCIPALES
    { path: 'clientes', component: ClientesComponent, canActivate: [authGuard]  },
    { path: 'unidades', component: UnidadesComponent, canActivate: [authGuard]  },
    { path: 'proyectos', component: ProyectosComponent, canActivate: [authGuard]  },

    // CONTRATOS
    { path: 'contratos', component: ContratosComponent, canActivate: [authGuard]  },

    // PAGOS
    { path: 'pagos', component: PagosComponent, canActivate: [authGuard]  },

    // CALIFICACION
    { path: 'calificacion', component: CalificacionComponent, canActivate: [authGuard]  },

    // BUSCAR CONTRATO POR RUT
    { path: 'buscar-contrato', component: BuscarContratoComponent },

    // NEONPAY
    {
        path: 'neonpay/:id',
        loadComponent: () =>
            import('./components/neonpay/neonpay.component')
                .then(c => c.NeonpayComponent)
    }
];
