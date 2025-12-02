import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [NgbActiveModal],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  constructor(private authService: AuthService, private clienteService: ClienteService, private activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';
    this.authService.login(email, password)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.authService.setToken(response.token);
          this.clienteService.setToken(response.token);
          this.activeModal.close();
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          console.error(error);
          alert('Error al iniciar sesión');
        }
      });
  }

  closeModal(): void {
    this.activeModal.close();
  }
}