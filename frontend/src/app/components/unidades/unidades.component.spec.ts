import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { ClienteService } from '../../services/cliente.service';
import { ProyectoService } from '../../services/proyecto.service';
import { UnidadService } from '../../services/unidad.service';
import { UnidadesComponent } from './unidades.component';

describe('UnidadesComponent', () => {
  let component: UnidadesComponent;
  let fixture: ComponentFixture<UnidadesComponent>;

  let unidadService: jasmine.SpyObj<UnidadService>;
  let proyectoService: jasmine.SpyObj<ProyectoService>;
  let clienteService: jasmine.SpyObj<ClienteService>;

  beforeEach(async () => {
    const unidadSpy = jasmine.createSpyObj('UnidadService', [
      'getUnidades',
      'crearUnidad',
      'editarUnidad',
      'eliminarUnidad'
    ]);

    const proyectoSpy = jasmine.createSpyObj('ProyectoService', ['getProyectos']);
    const clienteSpy = jasmine.createSpyObj('ClienteService', ['getClientes']);

    await TestBed.configureTestingModule({
      imports: [UnidadesComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: UnidadService, useValue: unidadSpy },
        { provide: ProyectoService, useValue: proyectoSpy },
        { provide: ClienteService, useValue: clienteSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UnidadesComponent);
    component = fixture.componentInstance;

    unidadService = TestBed.inject(UnidadService) as jasmine.SpyObj<UnidadService>;
    proyectoService = TestBed.inject(ProyectoService) as jasmine.SpyObj<ProyectoService>;
    clienteService = TestBed.inject(ClienteService) as jasmine.SpyObj<ClienteService>;

    unidadService.getUnidades.and.returnValue(of({ data: [] }));
    proyectoService.getProyectos.and.returnValue(of({ data: [] }));
    clienteService.getClientes.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar unidades, proyectos y clientes en ngOnInit', () => {
    expect(unidadService.getUnidades).toHaveBeenCalled();
    expect(proyectoService.getProyectos).toHaveBeenCalled();
    expect(clienteService.getClientes).toHaveBeenCalled();
  });

  it('debería tener un formulario inválido cuando está vacío', () => {
    expect(component.unidadForm.valid).toBeFalse();
  });

  it('debería validar el formulario cuando todos los campos son correctos', () => {
    component.unidadForm.setValue({
      numero_unidad: '101',
      tipo_unidad: 'Departamento',
      metraje: '45',
      precio_venta: '90000000',
      estado: 'Disponible',
      proyecto_id: '1',
      cliente_id: '1'
    });
    expect(component.unidadForm.valid).toBeTrue();
  });

  it('debería crear una unidad cuando el formulario es válido y NO está en modo edición', () => {
    component.modoEdicion = false;

    component.unidadForm.setValue({
      numero_unidad: '101',
      tipo_unidad: 'Depto',
      metraje: '50',
      precio_venta: '100000000',
      estado: 'Disponible',
      proyecto_id: '1',
      cliente_id: '1'
    });

    unidadService.crearUnidad.and.returnValue(of({}));
    unidadService.getUnidades.and.returnValue(of({ data: [] }));

    component.crearUnidad();

    expect(unidadService.crearUnidad).toHaveBeenCalled();
    expect(unidadService.getUnidades).toHaveBeenCalled();
  });

  it('debería editar una unidad cuando está en modo edición', () => {
    component.modoEdicion = true;
    component.unidadSeleccionada = { id: '10' };

    component.unidadForm.setValue({
      numero_unidad: '102',
      tipo_unidad: 'Casa',
      metraje: '70',
      precio_venta: '150000000',
      estado: 'Vendido',
      proyecto_id: '2',
      cliente_id: '2'
    });

    unidadService.editarUnidad.and.returnValue(of({}));
    unidadService.getUnidades.and.returnValue(of({ data: [] }));

    component.crearUnidad();

    expect(unidadService.editarUnidad).toHaveBeenCalledWith('10', jasmine.any(Object));
  });

  it('debería preparar el formulario para edición cuando se llama editarUnidad', () => {
    const unidad = {
      id: '20',
      numero_unidad: '301',
      tipo_unidad: 'Oficina',
      metraje: 100,
      precio_venta: 200000000,
      estado: 'Disponible',
      proyecto_id: '3',
      cliente_id: '5'
    };

    component.editarUnidad(unidad);

    expect(component.modoEdicion).toBeTrue();
    expect(component.unidadSeleccionada).toEqual(unidad);
    expect(component.unidadForm.value.numero_unidad).toBe('301');
  });

  it('debería eliminar una unidad correctamente', () => {
    unidadService.eliminarUnidad.and.returnValue(of({}));
    unidadService.getUnidades.and.returnValue(of({ data: [] }));

    const unidad = { id: '10' };

    component.eliminarUnidad(unidad);

    expect(unidadService.eliminarUnidad).toHaveBeenCalledWith('10');
  });

  it('getProyectoNombre debería devolver el nombre del proyecto', () => {
    component.proyectos = [{ id: '1', nombre: 'Proyecto X' }];
    expect(component.getProyectoNombre('1')).toBe('Proyecto X');
  });

  it('getClienteRut debería devolver el rut del cliente', () => {
    component.clientes = [{ id: '1', rut: '11.111.111-1' }];
    expect(component.getClienteRut('1')).toBe('11.111.111-1');
  });
});
