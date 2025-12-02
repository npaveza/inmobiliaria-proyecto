import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import { ContratoService } from '../../services/contrato.service';
import { UnidadService } from '../../services/unidad.service';
import { ContratosComponent } from '../contratos/contratos.component';

describe('ContratosComponent', () => {
  let component: ContratosComponent;
  let fixture: ComponentFixture<ContratosComponent>;
  let clienteServiceSpy: any;
  let unidadServiceSpy: any;
  let contratoServiceSpy: any;

  beforeEach(async () => {
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['getClientes']);
    unidadServiceSpy = jasmine.createSpyObj('UnidadService', ['getUnidades']);
    contratoServiceSpy = jasmine.createSpyObj('ContratoService', ['getContratos', 'createContrato', 'deleteContrato']);

    clienteServiceSpy.getClientes.and.returnValue(of({ data: [] }));
    unidadServiceSpy.getUnidades.and.returnValue(of({ data: [] }));
    contratoServiceSpy.getContratos.and.returnValue(of({ data: [] }));

    await TestBed.configureTestingModule({
      imports: [ContratosComponent, HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: UnidadService, useValue: unidadServiceSpy },
        { provide: ContratoService, useValue: contratoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clientes and unidades on init', () => {
    expect(clienteServiceSpy.getClientes).toHaveBeenCalled();
    expect(unidadServiceSpy.getUnidades).toHaveBeenCalled();
    expect(component.clientes).toEqual([]);
    expect(component.unidades).toEqual([]);
  });

  it('should handle error on loadLookup', () => {
    clienteServiceSpy.getClientes.and.returnValue(throwError(() => new Error('fail')));
    unidadServiceSpy.getUnidades.and.returnValue(throwError(() => new Error('fail')));
    component.ngOnInit();
    expect(component.error).toBe('Error al cargar clientes o unidades');
  });

  it('should load contratos', () => {
    expect(contratoServiceSpy.getContratos).toHaveBeenCalled();
    expect(component.contratos).toEqual([]);
  });

  it('should handle error when loading contratos', () => {
    contratoServiceSpy.getContratos.and.returnValue(throwError(() => new Error('fail')));
    component.loadContratos();
    expect(component.error).toBe('Error al cargar contratos');
  });

  it('should create contrato when form valid', () => {
    contratoServiceSpy.createContrato.and.returnValue(of({}));
    contratoServiceSpy.getContratos.and.returnValue(of({ data: [] }));

    component.contratoForm.setValue({
      cliente_id: 1,
      unidad_id: 1,
      tipo_contrato: 'arriendo',
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-12-01',
      monto_total: 500000
    });

    component.crearContrato();
    expect(contratoServiceSpy.createContrato).toHaveBeenCalledTimes(1);
  });

  it('should not create contrato if form invalid', () => {
    component.contratoForm.patchValue({ cliente_id: '' });
    component.crearContrato();
    expect(contratoServiceSpy.createContrato).not.toHaveBeenCalled();
  });

  it('should handle error on createContrato', () => {
    contratoServiceSpy.createContrato.and.returnValue(throwError(() => ({ error: { message: 'fail' } })));
    component.contratoForm.setValue({
      cliente_id: 1,
      unidad_id: 1,
      tipo_contrato: 'arriendo',
      fecha_inicio: '2024-01-01',
      fecha_fin: '2024-12-01',
      monto_total: 500000
    });
    component.crearContrato();
    expect(component.error).toBe('fail');
  });

  it('should delete contrato when confirm true', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    contratoServiceSpy.deleteContrato.and.returnValue(of({}));
    contratoServiceSpy.getContratos.and.returnValue(of({ data: [] }));

    component.eliminarContrato(5);
    expect(contratoServiceSpy.deleteContrato).toHaveBeenCalledWith(5);
  });

  it('should not delete contrato when confirm false', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    contratoServiceSpy.deleteContrato.and.returnValue(of({}));

    component.eliminarContrato(5);
    expect(contratoServiceSpy.deleteContrato).not.toHaveBeenCalled();
  });

  it('should handle error on deleteContrato', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    contratoServiceSpy.deleteContrato.and.returnValue(throwError(() => new Error('fail')));

    component.eliminarContrato(5);
    expect(component.error).toBe('Error eliminando contrato');
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');
    (component as any).subs = [{ unsubscribe: unsubscribeSpy }];
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should validate monto_total min value', () => {
    component.contratoForm.patchValue({ monto_total: -1 });
    expect(component.contratoForm.valid).toBeFalse();
  });
});
