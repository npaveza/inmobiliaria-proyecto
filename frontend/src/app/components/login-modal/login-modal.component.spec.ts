import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';
import { LoginComponent } from './login-modal.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: any;
  let clienteServiceSpy: any;
  let activeModalSpy: any;
  let routerSpy: any;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'setToken']);
    authServiceSpy.login.and.returnValue(of({ token: 'token' }));

    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['setToken']);
    activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent], // standalone
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Asegurar que el spy de activeModal se use
    (component as any).activeModal = activeModalSpy;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener un formulario inválido cuando está vacío', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('debería tener un formulario válido cuando se llenan todos los campos correctamente', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password'
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('debería llamar a login del AuthService cuando se envía el formulario', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password'
    });
    component.onSubmit();
    expect(authServiceSpy.login).toHaveBeenCalledTimes(1);
    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('debería cerrar el modal y navegar después de un inicio de sesión exitoso', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password'
    });
    component.onSubmit();
    expect(activeModalSpy.close).toHaveBeenCalledTimes(1);
    expect(authServiceSpy.setToken).toHaveBeenCalledWith('token');
    expect(clienteServiceSpy.setToken).toHaveBeenCalledWith('token');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debería manejar error al iniciar sesión', () => {
    const consoleSpy = spyOn(console, 'error');
    spyOn(window, 'alert');
    authServiceSpy.login.and.returnValue(throwError({ status: 401 }));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al iniciar sesión');
  });

  it('debería cerrar modal directamente', () => {
    component.closeModal();
    expect(activeModalSpy.close).toHaveBeenCalled();
  });

  it('debería llamar a login con cadenas vacías si los valores son null o undefined', () => {
    // Usamos patchValue en lugar de setValue
    component.loginForm.patchValue({
      email: null,
      password: undefined
    });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('', '');
    expect(activeModalSpy.close).toHaveBeenCalledTimes(1);
    expect(authServiceSpy.setToken).toHaveBeenCalledWith('token');
    expect(clienteServiceSpy.setToken).toHaveBeenCalledWith('token');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
