import { Component } from '@angular/core';

@Component({
  selector: 'app-neonpay',
  templateUrl: './neonpay.component.html',
  styleUrls: ['./neonpay.component.css']
})
export class NeonpayComponent {

  step = 1;              // 1=tarjeta, 2=pin, 3=otp, 4=resultado
  sessionId: number | null = null;
  pinValidated = false;
  otpValidated = false;
  paymentResult: 'approved' | 'rejected' | null = null;

  // 👉 Recibimos eventos desde los subcomponentes
  onPaymentStarted(sessionId: number) {
    this.sessionId = sessionId;
    this.step = 2;
  }

  onPinValidated(ok: boolean) {
    if (ok) {
      this.pinValidated = true;
      this.step = 3;
    } else {
      this.paymentResult = 'rejected';
      this.step = 4;
    }
  }

  onOtpValidated(result: 'approved' | 'rejected') {
    this.paymentResult = result;
    this.step = 4;
  }

  restart() {
    this.step = 1;
    this.sessionId = null;
    this.pinValidated = false;
    this.otpValidated = false;
    this.paymentResult = null;
  }
}
