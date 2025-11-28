import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pin-screen',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pin-screen.component.html',
  styleUrls: ['./pin-screen.component.css']
})
export class PinScreenComponent {

  @Input() sessionId!: number;
  @Output() pinValidated = new EventEmitter<boolean>();

  pin = '';
  loading = false;

  constructor(private http: HttpClient) { }

  sendPin() {
    if (this.pin.length !== 4) return;

    this.loading = true;

    this.http.post<any>(`http://127.0.0.1:8000/api/pagos/${this.sessionId}/pin`, {
      pin: this.pin
    }).subscribe({
      next: res => {
        this.loading = false;
        this.pinValidated.emit(res.valid === true);
      },
      error: err => {
        this.loading = false;
        this.pinValidated.emit(false);
      }
    });
  }
}
