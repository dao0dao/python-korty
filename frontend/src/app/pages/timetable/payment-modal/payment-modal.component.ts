import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PlayerDTO } from '../../players/player.dto';
import { PriceListDTO, PriceListNumber } from '../../price-list/interfaces';
import { ApiService } from '../api.service';
import { Method, ReservationPayment, Reservation } from '../interfaces';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent implements OnInit {
  environment = environment;
  @Input() reservation: Reservation | undefined;
  @Input() priceLists: PriceListDTO[] = [];
  @Input() players: PlayerDTO[] = [];
  priceListsNumbers: PriceListNumber[] = [];
  @Output() CloseModal: EventEmitter<undefined> = new EventEmitter();
  @Output() PayForReservation: EventEmitter<ReservationPayment> =
    new EventEmitter();

  constructor(private httpTimetable: ApiService) {}

  isSubmitting: boolean = false;

  timeFrom: string = '';
  timeTo: string = '';

  court: string = '';

  playerOneName: string = '';
  isPlayerOneFromBase: boolean = false;
  playerTwoName: string = '';
  isPlayerTwoFromBase: boolean = false;

  isPlayerOnePayed: boolean = false;
  isPlayerTwoPayed: boolean = false;
  paymentOne: number | undefined;
  paymentTwo: number | undefined;

  methodOne: Method = 'none';
  methodTwo: Method = 'none';

  ngOnInit(): void {
    this.httpTimetable
      .getReservationPriceById(this.reservation?.id!)
      .subscribe({
        next: (data) => {
          for (const p of data.prices) {
            if (p.player_position === 1) {
              this.paymentOne = p.price;
              this.isPlayerOnePayed = p.is_paid;
              this.playerOneName = p.player.name + ' ' + p.player.surname;
              this.isPlayerOneFromBase = true;
            } else if (
              this.reservation?.form.guestOne &&
              !this.reservation.isPlayerOnePayed
            ) {
              this.playerOneName = this.reservation?.form.guestOne;
            }
            if (p.player_position === 2) {
              this.paymentTwo = p.price;
              this.isPlayerTwoPayed = p.is_paid;
              this.playerTwoName = p.player.name + ' ' + p.player.surname;
              this.isPlayerTwoFromBase = true;
            } else if (
              this.reservation?.form.guestTwo &&
              !this.reservation.isPlayerTwoPayed
            ) {
              this.playerTwoName = this.reservation?.form.guestTwo;
            }
          }
          this.timeFrom = this.reservation?.form?.timeFrom!;
          this.timeTo = this.reservation?.form.timeTo!;
          this.setCourt();
        },
      });
  }

  setCourt() {
    switch (this.reservation?.form.court) {
      case 1:
        this.court = 'Niebieski';
        break;
      case 2:
        this.court = 'Fioletowy';
        break;
    }
  }

  checkValue(key: 'one' | 'two') {
    if (key === 'one') {
      this.paymentOne === null
        ? (this.paymentOne = undefined)
        : (this.paymentOne = parseFloat(this.paymentOne?.toFixed(2)!));
    }
    if (key === 'two') {
      this.paymentTwo === null
        ? (this.paymentTwo = undefined)
        : (this.paymentTwo = parseFloat(this.paymentTwo?.toFixed(2)!));
    }
  }

  closeModal() {
    this.CloseModal.emit();
  }

  payForReservation() {
    this.isSubmitting = true;
    const plOne = this.reservation?.form.playerOne;
    const plTwo = this.reservation?.form.playerTwo;
    const payment: ReservationPayment = {
      reservationId: this.reservation?.id!,
      playerOne: {
        id: plOne?.id,
        name: this.playerOneName,
        method: this.methodOne,
        value: this.paymentOne!,
      },
      playerTwo: {
        id: plTwo?.id,
        name: this.playerTwoName,
        method: this.methodTwo,
        value: this.paymentTwo!,
      },
    };
    this.PayForReservation.emit(payment);
  }
}
