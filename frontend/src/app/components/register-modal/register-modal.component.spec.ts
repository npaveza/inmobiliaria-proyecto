import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RegisterModalComponent } from './register-modal.component';

describe('RegisterModalComponent', () => {
  let component: RegisterModalComponent;
  let fixture: ComponentFixture<RegisterModalComponent>;
  let activeModalSpy: any;
  let authServiceSpy: any;

  beforeEach(async () => {
    activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['close']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterModalComponent, NgbModalModule, HttpClientTestingModule],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('form should be valid when filled correctly', () => {
    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    expect(component.registerForm.valid).toBeTruthy();
  });

  it('should alert when passwords do not match', () => {
    spyOn(window, 'alert');
    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password456'
    });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden');
  });

  it('should alert when form is invalid', () => {
    spyOn(window, 'alert');
    component.registerForm.setValue({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Por favor, complete todos los campos requeridos');
  });

  it('should call authService.register and close modal on success', () => {
    authServiceSpy.register.and.returnValue(of({}));
    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    spyOn(window, 'alert');

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith('Registro exitoso');
    expect(activeModalSpy.close).toHaveBeenCalled();
  });

  it('should alert on register error', () => {
    authServiceSpy.register.and.returnValue(throwError(() => new Error('fail')));
    spyOn(window, 'alert');

    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al registrarse');
  });

  it('should close modal when closeModal is called', () => {
    component.closeModal();
    expect(activeModalSpy.close).toHaveBeenCalled();
  });
});
