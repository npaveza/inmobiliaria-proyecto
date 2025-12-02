import { CommonModule } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { OtpScreenComponent } from './otp-screen.component';

describe('OtpScreenComponent', () => {

  let component: OtpScreenComponent;
  let fixture: ComponentFixture<OtpScreenComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpScreenComponent, HttpClientTestingModule, FormsModule, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(OtpScreenComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crearse', () => {
    expect(component).toBeTruthy();
  });

  it('no debe generar OTP si sessionId es inválido', () => {
    const spy = spyOn(console, 'log');
    component.sessionId = 0;

    component.generarOtp();

    httpMock.expectNone(req => req.url.includes('/otp'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('debe generar OTP correctamente', () => {
    component.sessionId = 12;

    component.generarOtp();
    expect(component.loading).toBeTrue();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/12/otp');
    req.flush({ otp: '111222', expires_in: 30 });

    expect(component.loading).toBeFalse();
    expect(component.generated).toBeTrue();
    expect(component.expiresIn).toBe(30);
  });

  it('debe manejar error al generar OTP', () => {
    component.sessionId = 8;

    component.generarOtp();
    expect(component.loading).toBeTrue();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/8/otp');
    req.flush('error', { status: 500, statusText: 'err' });

    expect(component.loading).toBeFalse();
    expect(component.generated).toBeFalse();
  });

  it('no debe validar OTP si es menor a 6 caracteres', () => {
    const spy = spyOn(component.otpValidated, 'emit');
    component.sessionId = 33;
    component.otp = '12 3';

    component.validarOtp();

    httpMock.expectNone(req => req.url.includes('/validar'));
    expect(spy).not.toHaveBeenCalled();
  });

  it('debe validar OTP y emitir approved cuando status success', () => {
    const spy = spyOn(component.otpValidated, 'emit');
    component.sessionId = 44;
    component.otp = '111222';

    component.validarOtp();
    expect(component.loading).toBeTrue();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/44/otp/validar');
    req.flush({ status: 'success' });

    expect(component.loading).toBeFalse();
    expect(spy).toHaveBeenCalledOnceWith('approved');
  });

  it('debe emitir rejected cuando status no es success ni ok', () => {
    const spy = spyOn(component.otpValidated, 'emit');
    component.sessionId = 55;
    component.otp = '999888';

    component.validarOtp();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/55/otp/validar');
    req.flush({ status: 'fail' });

    expect(component.loading).toBeFalse();
    expect(spy).toHaveBeenCalledOnceWith('rejected');
  });

  it('debe emitir rejected en error HTTP', () => {
    const spy = spyOn(component.otpValidated, 'emit');
    component.sessionId = 99;
    component.otp = '333444';

    component.validarOtp();

    const req = httpMock.expectOne('http://127.0.0.1:8000/api/pagos/99/otp/validar');
    req.flush('err', { status: 500, statusText: 'Server error' });

    expect(component.loading).toBeFalse();
    expect(spy).toHaveBeenCalledOnceWith('rejected');
  });

});
