import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoginStateService } from '../../login-state.service';
import { PlayerDTO } from '../../players/player.dto';
import { HistoryInputDTO, method, OutputPayment, Payment } from '../interfaces';

@Component({
  selector: 'app-pay-modal',
  templateUrl: './pay-modal.component.html',
  styleUrls: ['./pay-modal.component.scss'],
})
export class PayModalComponent implements OnInit {
  @Input() payment: HistoryInputDTO | undefined;
  @Input() player: PlayerDTO | undefined;
  @Output() Pay: EventEmitter<OutputPayment> = new EventEmitter();
  @Output() CloseModal: EventEmitter<Payment> = new EventEmitter();

  constructor(public loginState: LoginStateService) {}

  price: number = 0;
  paymentMethod: method = 'cash';
  isSubmitting: boolean = false;

  ngOnInit(): void {
    if (this.payment?.price) {
      this.price = this.payment?.price;
    }
  }

  closeModal() {
    this.CloseModal.emit();
  }

  acceptPayment() {
    this.isSubmitting = true;
    const payment: OutputPayment = {
      id: this.payment?.id!,
      payment_method: this.paymentMethod,
      price: this.price.toFixed(2),
    };
    this.Pay.emit(payment);
  }
}
