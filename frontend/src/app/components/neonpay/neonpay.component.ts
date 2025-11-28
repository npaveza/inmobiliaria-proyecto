import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NeonCardComponent } from './neon-card/neon-card.component';
import { OtpScreenComponent } from './otp-screen/otp-screen.component';
import { PinScreenComponent } from './pin-screen/pin-screen.component';
import { ResultScreenComponent } from './result-screen/result-screen.component';

@Component({
  selector: 'app-neonpay',
  standalone: true,
  templateUrl: './neonpay.component.html',
  styleUrls: ['./neonpay.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    NeonCardComponent,
    PinScreenComponent,
    OtpScreenComponent,
    ResultScreenComponent
  ]
})
export class NeonpayComponent {

  sessionId: number | null = null;
  paymentId: number | null = null;

  step = 1; // 1: card → 2: PIN → 3: OTP → 4: Resultado

  paymentResult: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Obtener el parámetro ID desde /neonpay/:id
    const contratoId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Contrato recibido:", contratoId);

    this.sessionId = contratoId;
  }

  /**
   * PASO 1 → SE RECIBE EL ID DEL PAGO CREADO
   */
  onPaymentStarted(pagoId: number) {
    console.log("ID de pago recibido desde NeonCard:", pagoId);
    this.paymentId = pagoId;
    this.step = 2; // mostrar pantalla PIN
  }

  /**
   * PASO 2 → PIN validado → avanzar a OTP
   */
  onPinValidated(success: boolean) {
    if (success) {
      console.log("PIN validado correctamente");
      this.step = 3;
    }
  }

  /**
   * PASO 3 → OTP validado → mostrar resultado final
   */
  onOtpValidated(result: any) {
    console.log("OTP validado. Resultado:", result);
    this.paymentResult = result;
    this.step = 4;
  }

  /**
   * Reiniciar todo el flujo
   */
  restart() {
    this.step = 1;
    this.paymentResult = null;
    this.paymentId = null;
  }

}
