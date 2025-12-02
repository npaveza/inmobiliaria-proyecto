import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PinScreenComponent } from './pin-screen.component';

describe('PinScreenComponent', () => {
  let component: PinScreenComponent;
  let fixture: ComponentFixture<PinScreenComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinScreenComponent, HttpClientTestingModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PinScreenComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('no debe enviar si el PIN no tiene largo 4', () => {
    const spy = spyOn(component.pinValidated, 'emit');
    component.pin = '12';
    component.sessionId = 10;
    component.sendPin();
    httpMock.expectNone(`http://127.0.0.1:8000/api/pagos/10/pin`);
    expect(spy).not.toHaveBeenCalled();
  });

  it('debe enviar PIN válido y manejar loading', () => {
    component.pin = '1234';
    component.sessionId = 44;

    component.sendPin();
    expect(component.loading).toBeTrue();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/44/pin');
    req.flush({ status: 'ok', pago: { pin_validado: true } });

    expect(component.loading).toBeFalse();
  });

  it('debe emitir true si backend responde status ok', () => {
    component.pin = '1234';
    component.sessionId = 7;

    const spy = spyOn(component.pinValidated, 'emit');
    component.sendPin();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/7/pin');
    req.flush({ status: 'ok' });

    expect(spy).toHaveBeenCalledOnceWith(true);
  });

  it('debe emitir true si res.pago.pin_validado = true', () => {
    component.pin = '1234';
    component.sessionId = 9;

    const spy = spyOn(component.pinValidated, 'emit');
    component.sendPin();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/9/pin');
    req.flush({ pago: { pin_validado: true } });

    expect(spy).toHaveBeenCalledOnceWith(true);
  });

  it('debe emitir false si backend no valida el PIN', () => {
    component.pin = '1234';
    component.sessionId = 11;

    const spy = spyOn(component.pinValidated, 'emit');
    component.sendPin();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/11/pin');
    req.flush({ status: 'fail' });

    expect(spy).toHaveBeenCalledOnceWith(false);
  });

  it('debe emitir false en error HTTP', () => {
    component.pin = '1234';
    component.sessionId = 22;

    const spy = spyOn(component.pinValidated, 'emit');
    component.sendPin();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/22/pin');
    req.flush('error', { status: 500, statusText: 'Server error' });

    expect(component.loading).toBeFalse();
    expect(spy).toHaveBeenCalledOnceWith(false);
  });
});
