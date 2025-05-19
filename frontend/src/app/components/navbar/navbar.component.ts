import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgbModalModule, CommonModule, RouterModule, LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

constructor(private authService: AuthService, private modalService: NgbModal) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  openLoginModal() {
    this.modalService.open(LoginComponent);
  }

  openRegisterModal(): void {
    this.modalService.open(RegisterModalComponent);
  }

  logout(): void {
    this.authService.logout();
  }

}