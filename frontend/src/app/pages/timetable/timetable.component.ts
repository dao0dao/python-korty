import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  Reservation,
  TimeTable,
  DeleteConfirm,
  ReservationPayment,
  OutputReservationDTO,
  ReservationInputDTO,
} from './interfaces';
import { environment } from 'src/environments/environment';
import { PlayerDTO } from '../players/player.dto';
import { ApiService } from './api.service';
import { DatePipe } from '@angular/common';
import { ReservationService } from './reservation.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop/drag-events';
import { LoginStateService } from '../login-state.service';
import { PriceListDTO } from '../price-list/interfaces';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss'],
})
export class TimetableComponent implements OnInit {
  environment = environment;
  @ViewChild('board') board!: ElementRef<HTMLElement>;

  constructor(
    private api: ApiService,
    private DatePipe: DatePipe,
    private reservationService: ReservationService,
    private stateService: LoginStateService
  ) {}

  isLoaded: boolean = false;
  timetable: TimeTable[] = [{ label: '00:00' }];
  isModal: boolean = false;
  modalAction: 'new' | 'edit' | undefined = undefined;
  isDragging: boolean = false;
  date: string = '';

  players: PlayerDTO[] = [];
  reservations: Reservation[] = [];

  ceilStep: number = 40;
  hourStep: number = 0.25;
  columnStep: number = 250;

  editedReservation: Reservation | undefined;

  isPaymentBtn: boolean = false;
  isDeleteBtn: boolean = false;
  isDeleteModal: boolean = false;
  deletedReservation: Reservation | undefined;

  zoom: number = 100;

  isPaymentModal: boolean = false;
  paymentReservation: Reservation | undefined;
  priceLists: PriceListDTO[] = [];

  ngOnInit(): void {
    this.date = this.DatePipe.transform(Date.now(), 'YYYY-MM-dd')!;
    this.checkCanShowDeleteBtn();
    this.loadReservations();
    this.api.getAllPlayers().subscribe({
      next: (res) => {
        this.players = res.players;
      },
    });
    let time: number = 0;
    for (let i = 0; i < 47; i++) {
      time += 0.5;
      let hour: string = '';
      if (time < 10) {
        hour = '0' + Math.trunc(time) + ':';
      } else {
        hour = Math.trunc(time) + ':';
      }
      if (time % 1) {
        hour = hour + '30';
      } else {
        hour = hour + '00';
      }
      this.timetable.push({ label: hour });
    }
  }

  scrollToHour() {
    if (this.date !== this.DatePipe.transform(Date.now(), 'YYYY-MM-dd')!) {
      return;
    }
    const interval = setInterval(() => {
      if (this.board) {
        const hour = new Date().getHours() - 0.5;
        const div = this.board.nativeElement;
        const scroll = hour * this.reservationService.ceilHeighHourStep;
        div.scrollTo(0, scroll);
        clearInterval(interval);
      }
    }, 400);
  }

  nextDay() {
    const oldDate = new Date(this.date);
    const newDate = oldDate.setDate(oldDate.getDate() + 1);
    this.date = this.DatePipe.transform(newDate, 'YYYY-MM-dd')!;
    this.reloadReservations();
  }

  prevDay() {
    const oldDate = new Date(this.date);
    const newDate = oldDate.setDate(oldDate.getDate() - 1);
    this.date = this.DatePipe.transform(newDate, 'YYYY-MM-dd')!;
    this.reloadReservations();
  }

  today() {
    this.date = this.DatePipe.transform(Date.now(), 'YYYY-MM-dd')!;
    this.reloadReservations();
  }

  handleZoomScroll() {
    if (this.zoom !== 100) {
      this.board.nativeElement.scrollTo(0, 0);
    } else {
      this.scrollToHour();
    }
  }

  loadReservations() {
    const regExp = /\d{4}-\d{2}-\d{2}/;
    if (regExp.test(this.date)) {
      this.api.getAllReservations(this.date).subscribe({
        next: (res) => {
          for (const r of res.reservations) {
            const newReservation: Reservation =
              this.parseInputReservationDTOToReservation(r);
            this.reservations.push(newReservation);
          }
          this.isLoaded = true;
          this.scrollToHour();
        },
      });
    }
  }

  private parseInputReservationDTOToReservation(
    reservationDTO: ReservationInputDTO
  ) {
    const reservation: Reservation = {
      id: reservationDTO.id,
      form: reservationDTO.form,
      timetable: {
        layer: reservationDTO.timetable.layer,
        ceilHeight: this.reservationService.setCeilHeight(
          reservationDTO.form.timeFrom,
          reservationDTO.form.timeTo
        ),
        transformX: this.reservationService.setTransformX(
          reservationDTO.form.court
        ),
        transformY: this.reservationService.setTransformY(
          reservationDTO.form.timeFrom
        ),
      },
      payment: reservationDTO.payment,
      isEditable: reservationDTO.isEditable,
      isFirstPayment: reservationDTO.isFirstPayment,
      isPlayerOnePayed: reservationDTO.isPlayerOnePayed,
      isPlayerTwoPayed: reservationDTO.isPlayerTwoPayed,
    };
    return reservation;
  }

  reloadReservations() {
    this.isLoaded = false;
    this.reservations = [];
    this.loadReservations();
    this.checkCanShowDeleteBtn();
  }

  checkCanShowDeleteBtn() {
    if (this.stateService.state.isAdmin) {
      this.isDeleteBtn = true;
      this.isPaymentBtn = true;
      return;
    }
    const todayDay = new Date().getDate();
    const todayMonth = new Date().getMonth();
    const todayYear = new Date().getFullYear();

    const chosenDate = new Date(this.date);
    const chosenDay = chosenDate.getDate();
    const chosenMonth = chosenDate.getMonth();
    const chosenYear = chosenDate.getFullYear();

    if (chosenYear < todayYear) {
      this.isDeleteBtn = false;
      this.isPaymentBtn = false;
      return;
    }
    if (chosenMonth < todayMonth && chosenYear <= todayYear) {
      this.isDeleteBtn = false;
      this.isPaymentBtn = false;
      return;
    }
    if (
      chosenDay < todayDay &&
      chosenDay <= todayDay &&
      chosenYear <= todayYear
    ) {
      this.isDeleteBtn = false;
      this.isPaymentBtn = false;
      return;
    }
    this.isDeleteBtn = true;
    this.isPaymentBtn = true;
    return;
  }

  newReservation() {
    this.isModal = true;
    this.modalAction = 'new';
  }

  editReservation(res: Reservation) {
    this.isModal = true;
    this.modalAction = 'edit';
    this.editedReservation = res;
  }

  closeModal() {
    this.isModal = false;
    this.modalAction = undefined;
    this.editedReservation = undefined;
  }

  async submit(data: OutputReservationDTO) {
    if (this.modalAction === 'edit') {
      data.layer = this.reservationService.setHighestIndexInColumn(
        data.form.court,
        this.reservations,
        data.id
      );
      data.id = this.editedReservation?.id;
      await this.updateReservation(data);
      this.closeModal();
      this.modalAction = undefined;
      this.editedReservation = undefined;
    } else {
      this.addReservation(data);
    }
  }

  addReservation(data: OutputReservationDTO) {
    data.layer = this.reservationService.setHighestIndexInColumn(
      data.form.court,
      this.reservations
    );
    this.api.addReservation(data).subscribe({
      next: () => {
        this.closeModal();
        this.reloadReservations();
      },
      error: () => {
        this.closeModal();
      },
    });
  }

  openDeleteModal(item: Reservation) {
    this.isDeleteModal = true;
    this.deletedReservation = item;
  }

  closeDeleteModa() {
    this.isDeleteModal = false;
    this.deletedReservation = undefined;
  }

  handleDeleteModal(event: DeleteConfirm) {
    if (event.isConfirm) {
      this.deleteReservation(event.id!);
    }
    this.closeDeleteModa();
  }

  deleteReservation(id: number) {
    this.api.deleteReservation(id).subscribe({
      next: () => {
        const index = this.reservations.findIndex((r) => r.id === id);
        this.reservations.splice(index, 1);
        this.closeModal();
      },
      error: () => {
        this.closeModal();
      },
    });
  }

  moveLeft(res: Reservation) {
    if (!(res.form.court > 1)) {
      return;
    }
    const court = res.form.court - 1;
    const layer = this.reservationService.setHighestIndexInColumn(
      court,
      this.reservations,
      res.id
    );
    const updatedRes: OutputReservationDTO = {
      id: res.id,
      layer: layer,
      form: {
        date: res.form.date,
        timeFrom: res.form.timeFrom,
        timeTo: res.form.timeTo,
        playerOne: res.form.playerOne?.id,
        playerTwo: res.form.playerTwo?.id,
        guestOne: res.form.guestOne,
        guestTwo: res.form.guestTwo,
        court: court,
      },
    };
    this.updateReservation(updatedRes);
  }

  moveRight(res: Reservation) {
    if (!(res.form.court < 3)) {
      return;
    }
    const court = res.form.court + 1;
    const layer = this.reservationService.setHighestIndexInColumn(
      court,
      this.reservations,
      res.id
    );
    const updatedRes: OutputReservationDTO = {
      id: res.id,
      layer: layer,
      form: {
        date: res.form.date,
        timeFrom: res.form.timeFrom,
        timeTo: res.form.timeTo,
        playerOne: res.form.playerOne?.id,
        playerTwo: res.form.playerTwo?.id,
        guestOne: res.form.guestOne,
        guestTwo: res.form.guestTwo,
        court,
      },
    };
    this.updateReservation(updatedRes);
  }

  moveOnTop(res: Reservation) {
    if (this.isDragging) {
      return false;
    }
    const layer = this.reservationService.setHighestIndexInColumn(
      res.form.court,
      this.reservations,
      res.id
    );
    const updatedRes: OutputReservationDTO = {
      id: res.id,
      layer: layer,
      form: {
        date: res.form.date,
        timeFrom: res.form.timeFrom,
        timeTo: res.form.timeTo,
        playerOne: res.form.playerOne?.id,
        playerTwo: res.form.playerTwo?.id,
        guestOne: res.form.guestOne,
        guestTwo: res.form.guestTwo,
        court: res.form.court,
      },
    };
    this.updateReservation(updatedRes);
  }

  moveDown(res: Reservation) {
    const updatedRes: OutputReservationDTO = {
      id: res.id,
      layer: res.timetable.layer - 1,
      form: {
        date: res.form.date,
        timeFrom: res.form.timeFrom,
        timeTo: res.form.timeTo,
        playerOne: res.form.playerOne?.id,
        playerTwo: res.form.playerTwo?.id,
        guestOne: res.form.guestOne,
        guestTwo: res.form.guestTwo,
        court: res.form.court,
      },
    };
    this.updateReservation(updatedRes);
  }

  dragStart() {
    this.isDragging = true;
  }

  async dragEnd(res: Reservation, event: CdkDragEnd, el: HTMLElement) {
    const layer = this.reservationService.setHighestIndexInColumn(
      res.form.court,
      this.reservations,
      res.id
    );
    const translateY =
      Math.floor(event.distance.y / this.reservationService.ceilStep) *
      this.reservationService.ceilStep;
    let transformY = res.timetable.transformY + translateY;
    //Ograniczenie od góry
    if (transformY < 0) {
      transformY = 0;
    }
    //Ograniczenie od dołu
    if (transformY > this.reservationService.lastCeilStep) {
      transformY = this.reservationService.lastCeilStep;
    }

    const time = this.reservationService.setTimeFromTransformY(
      transformY,
      res.payment!.hourCount
    );
    const updatedRes: OutputReservationDTO = {
      id: res.id,
      layer: layer,
      form: {
        date: res.form.date,
        timeFrom: time.timeStart,
        timeTo: time.timeEnd,
        playerOne: res.form.playerOne?.id,
        playerTwo: res.form.playerTwo?.id,
        guestOne: res.form.guestOne,
        guestTwo: res.form.guestTwo,
        court: res.form.court,
      },
    };
    await this.updateReservation(updatedRes);
    el.style.transform = '';
    event.source._dragRef.reset();
    this.isDragging = false;
  }

  private updateReservation(reservation: OutputReservationDTO) {
    return new Promise<boolean>((resolve, reject) => {
      this.api.updateReservation(reservation).subscribe({
        next: (res) => {
          const index = this.reservations.findIndex(
            (el) => el.id === res.reservation.id
          );
          if (index >= 0) {
            this.reservations[index] =
              this.parseInputReservationDTOToReservation(res.reservation);
          }
          resolve(true);
        },
        error: () => {
          resolve(true);
        },
      });
    });
  }

  openPaymentModal(res: Reservation) {
    this.paymentReservation = res;
    this.isPaymentModal = true;
  }

  closePaymentModal() {
    this.isPaymentModal = false;
    this.paymentReservation = undefined;
  }

  payForReservation(data: ReservationPayment) {
    const body = data;
    if (!body.playerOne?.name) {
      delete body.playerOne;
    }
    if (!body.playerTwo?.name) {
      delete body.playerTwo;
    }
    this.api.payForReservation(body).subscribe({
      next: () => {
        this.reservations.forEach((r) => {
          if (r.id === this.paymentReservation?.id) {
            body.playerOne?.method !== 'none' && body.playerOne?.method
              ? (r.isPlayerOnePayed = true)
              : null;
            body.playerTwo?.method !== 'none' && body.playerTwo?.method
              ? (r.isPlayerTwoPayed = true)
              : null;
            r.isFirstPayment = true;
          }
        });
        this.closePaymentModal();
      },
      error: (err) => {
        this.closePaymentModal();
      },
    });
  }

  getReservationPaymentStatus(res: Reservation) {
    const fullPayed = 'full';
    const partPayed = 'partly';
    if (res.isPlayerOnePayed && res.isPlayerTwoPayed) {
      return fullPayed;
    }
    if (
      (res.isPlayerOnePayed && !res.form.playerTwo && !res.form.guestTwo) ||
      (res.isPlayerTwoPayed && !res.form.playerOne && !res.form.guestOne)
    ) {
      return fullPayed;
    }
    if (res.isPlayerOnePayed || res.isPlayerTwoPayed) {
      return partPayed;
    }
    return 'none';
  }
}
