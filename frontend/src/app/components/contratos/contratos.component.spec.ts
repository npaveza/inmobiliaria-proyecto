import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import { ContratoService } from '../../services/contrato.service';
import { UnidadService } from '../../services/unidad.service';
import { ContratosComponent } from './contratos.component';

describe('ContratosComponent', () => {
  let component: ContratosComponent;
  let fixture: ComponentFixture<ContratosComponent>;
  let contratoService: ContratoService;
  let clienteService: ClienteService;
  let unidadService: UnidadService;

  const mockClientes = [
    { rut: '12345678-9', nombre: 'Cliente 1', apellido: 'Apellido 1', email: 'cliente1@example.com', telefono: '123456789' }
  ];

  const mockUnidades = [
    { id: '1', nombre: 'Unidad 1' }
  ];

  const mockContratos = [
    { id: 1, cliente_id: '1', unidad_id: '1', tipo_contrato: 'arriendo', fecha_inicio: '2024-01-01', fecha_fin: '2024-12-31', monto_total: 1000, estado: 'activo' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, CommonModule],
      declarations: [],
      providers: [FormBuilder, ClienteService, ContratoService, UnidadService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContratosComponent);
    component = fixture.componentInstance;
    contratoService = TestBed.inject(ContratoService);
    clienteService = TestBed.inject(ClienteService);
    unidadService = TestBed.inject(UnidadService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(clienteService, 'getClientes').and.returnValue(of(mockClientes));
      spyOn(unidadService, 'getUnidades').and.returnValue(of(mockUnidades));
      spyOn(contratoService, 'getContratos').and.returnValue(of(mockContratos));
      fixture.detectChanges();
    });

    it('should load clientes and unidades on init', fakeAsync(() => {
      tick();
      expect(component.clientes).toEqual(mockClientes);
      expect(component.unidades).toEqual(mockUnidades);
    }));

    it('should load contratos on init', fakeAsync(() => {
      tick();
      expect(component.contratos).toEqual(mockContratos);
    }));
  });

  describe('crearContrato', () => {
    it('should create contrato', fakeAsync(() => {
      const createContratoSpy = spyOn(contratoService, 'createContrato').and.returnValue(of(mockContratos[0]));
      spyOn(clienteService, 'getClientes').and.returnValue(of(mockClientes));
      spyOn(unidadService, 'getUnidades').and.returnValue(of(mockUnidades));
      spyOn(contratoService, 'getContratos').and.returnValue(of(mockContratos));

      // NO llamar fixture.detectChanges() todavía
      // Configurar el formulario PRIMERO
      component.contratoForm.patchValue({
        cliente_id: '1',
        unidad_id: '1',
        tipo_contrato: 'arriendo',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        monto_total: 1000,
        estado: 'activo'
      });

      // Verificar que el formulario sea válido
      expect(component.contratoForm.valid).toBeTruthy();

      component.crearContrato();
      tick();

      expect(createContratoSpy).toHaveBeenCalledTimes(1);
      expect(createContratoSpy).toHaveBeenCalledWith({
        cliente_id: '1',
        unidad_id: '1',
        tipo_contrato: 'arriendo',
        fecha_inicio: '2024-01-01',
        fecha_fin: '2024-12-31',
        monto_total: 1000,
        estado: 'activo'
      });
    }));

    it('should not create contrato if form is invalid', () => {
      const createContratoSpy = spyOn(contratoService, 'createContrato').and.returnValue(of(mockContratos[0]));

      // Dejar el formulario vacío (inválido)
      component.contratoForm.reset();

      component.crearContrato();

      expect(createContratoSpy).not.toHaveBeenCalled();
      expect(component.contratoForm.invalid).toBeTruthy();
    });
  });

  describe('eliminarContrato', () => {
    beforeEach(() => {
      spyOn(clienteService, 'getClientes').and.returnValue(of(mockClientes));
      spyOn(unidadService, 'getUnidades').and.returnValue(of(mockUnidades));
      spyOn(contratoService, 'getContratos').and.returnValue(of(mockContratos));
      fixture.detectChanges();
    });

    it('should delete contrato', fakeAsync(() => {
      spyOn(contratoService, 'deleteContrato').and.returnValue(of({}));
      spyOn(window, 'confirm').and.returnValue(true);
      component.eliminarContrato(1);
      tick();
      expect(contratoService.deleteContrato).toHaveBeenCalledTimes(1);
      expect(contratoService.deleteContrato).toHaveBeenCalledWith(1);
    }));

    it('should handle error on delete contrato', fakeAsync(() => {
      spyOn(contratoService, 'deleteContrato').and.returnValue(throwError({}));
      spyOn(window, 'confirm').and.returnValue(true);
      component.eliminarContrato(1);
      tick();
      expect(component.error).toBe('Error eliminando contrato');
    }));
  });

  it('should unsubscribe on destroy', () => {
    spyOn(clienteService, 'getClientes').and.returnValue(of(mockClientes));
    spyOn(unidadService, 'getUnidades').and.returnValue(of(mockUnidades));
    spyOn(contratoService, 'getContratos').and.returnValue(of(mockContratos));
    fixture.detectChanges();
    const subs = component['subs'];
    subs.forEach(sub => spyOn(sub, 'unsubscribe'));
    component.ngOnDestroy();
    subs.forEach(sub => expect(sub.unsubscribe).toHaveBeenCalledTimes(1));
  });
});