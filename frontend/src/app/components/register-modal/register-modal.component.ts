import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css']
})
export class RegisterModalComponent implements OnInit {

  registerForm!: FormGroup;

  constructor(private authService: AuthService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    if (this.registerForm && this.registerForm.valid) {
      const user = {
        name: this.registerForm.get('name')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value
      };

      if (user?.password === this.registerForm.get('confirmPassword')?.value) {
        this.authService.register(user).subscribe({
          next: (response: any) => {
            console.log(response);
            alert('Registro exitoso');
            this.activeModal.close();
          },
          error: (error: any) => {
            console.error(error);
            alert('Error al registrarse');
          }
        });
      } else {
        alert('Las contraseñas no coinciden');
      }
    } else {
      alert('Por favor, complete todos los campos requeridos');
    }
  }

  closeModal(): void {
    this.activeModal.close();
  }

}