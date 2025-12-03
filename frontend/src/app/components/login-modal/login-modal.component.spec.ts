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
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    (component as any).activeModal = activeModalSpy;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener un formulario inválido cuando está vacío', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('debería marcar campos como touched y NO llamar login cuando el formulario es inválido', () => {
    const markSpy = spyOn(component.loginForm, 'markAllAsTouched').and.callThrough();

    component.onSubmit();

    expect(markSpy).toHaveBeenCalled();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(activeModalSpy.close).not.toHaveBeenCalled();
  });

  it('debería tener un formulario válido con datos correctos', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: '123456'
    });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('debería llamar a login con email y password válidos', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password'
    });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('debería cerrar modal y navegar en login exitoso', () => {
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password'
    });

    component.onSubmit();

    expect(activeModalSpy.close).toHaveBeenCalled();
    expect(authServiceSpy.setToken).toHaveBeenCalledWith('token');
    expect(clienteServiceSpy.setToken).toHaveBeenCalledWith('token');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('debería manejar error al iniciar sesión', () => {
    const consoleSpy = spyOn(console, 'error');
    spyOn(window, 'alert');

    authServiceSpy.login.and.returnValue(throwError(() => ({ status: 401 })));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'wrongpass'
    });

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al iniciar sesión');
  });

  it('debería cerrar modal directamente', () => {
    component.closeModal();
    expect(activeModalSpy.close).toHaveBeenCalled();
  });

  it('NO debería llamar login cuando email o password son null/undefined (por validación agregada)', () => {
    component.loginForm.patchValue({
      email: null,
      password: undefined
    });

    const markSpy = spyOn(component.loginForm, 'markAllAsTouched').and.callThrough();

    component.onSubmit();

    expect(markSpy).toHaveBeenCalled();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(activeModalSpy.close).not.toHaveBeenCalled();
  });
});
