import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-neon-card',
  standalone: true,
  templateUrl: './neon-card.component.html',
  styleUrls: ['./neon-card.component.css']
})
export class NeonCardComponent {

  @Input() sessionId!: number;
  @Output() paymentStarted = new EventEmitter<number>();
  loading = false;

  constructor(private http: HttpClient) {}

  iniciarPago() {
    this.loading = true;

    this.http.post<any>(`http://127.0.0.1:8000/api/pagos/${this.sessionId}/init`, {})
      .subscribe({
        next: res => {
          this.loading = false;
          this.paymentStarted.emit(res.pago.id); // enviamos el ID real del pago
        },
        error: err => {
          this.loading = false;
          console.error('Error iniciando pago', err);
        }
      });
  }
}