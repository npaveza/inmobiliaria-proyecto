import { Component } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { RegisterModalComponent } from '../register-modal/register-modal.component';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgbModalModule, LoginModalComponent, RegisterModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

constructor(private authService: AuthService, private modalService: NgbModal) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  openLoginModal(): void {
    this.modalService.open(LoginModalComponent);
  }

  openRegisterModal(): void {
    this.modalService.open(RegisterModalComponent);
  }

  logout(): void {
    this.authService.logout();
  }

}