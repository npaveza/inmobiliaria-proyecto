import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-screen',
  templateUrl: './otp-screen.component.html',
  styleUrls: ['./otp-screen.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class OtpScreenComponent {

  @Input() sessionId!: number;
  @Output() otpValidated = new EventEmitter<'approved' | 'rejected'>();

  otp = '';
  loading = false;
  generated = false;

  constructor(private http: HttpClient) { }

  generarOtp() {
    this.loading = true;

    this.http.post<any>(`http://127.0.0.1:8000/api/pagos/${this.sessionId}/otp`, {})
      .subscribe({
        next: () => {
          this.loading = false;
          this.generated = true;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  validarOtp() {
    if (this.otp.length !== 6) return;

    this.loading = true;

    this.http.post<any>(`http://localhost/api/pagos/${this.sessionId}/otp/validar`, {
      otp: this.otp
    }).subscribe({
      next: res => {
        this.loading = false;
        this.otpValidated.emit(res.approved ? 'approved' : 'rejected');
      },
      error: () => {
        this.loading = false;
        this.otpValidated.emit('rejected');
      }
    });
  }
}
