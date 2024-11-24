import { Component, OnInit } from '@angular/core';
import { toSqlDate } from 'src/app/shared/sql-date';
import { environment } from 'src/environments/environment';
import { LoginStateService } from '../login-state.service';
import { PlayerDTO } from '../players/player.dto';
import { ApiService } from './api.service';
import { HistoryInputDTO, OutputPayment, Payment } from './interfaces';
import { SelectHandlerService } from './select-handler.service';

@Component({
  selector: 'app-account-balance',
  templateUrl: './account-balance.component.html',
  styleUrls: ['./account-balance.component.scss'],
})
export class AccountBalanceComponent implements OnInit {
  constructor(
    private api: ApiService,
    public selectHandler: SelectHandlerService,
    public state: LoginStateService
  ) {}

  environment = environment;

  today: string = '';

  players: PlayerDTO[] = [];
  isAllPlayers: boolean = false;
  selectedPlayer: PlayerDTO | undefined;
  playerInput: string = '';
  isLoadedPlayers: boolean = false;
  dateFrom: string = '';
  dateTo: string = '';

  isLoading: boolean = false;
  history: HistoryInputDTO[] = [];
  totalPrice: number | undefined;
  balance: string = '';

  isNotPaid: boolean = false;
  isGame: boolean = false;
  isNotPaidGame: boolean = false;

  isModal: boolean = false;
  payment: HistoryInputDTO | undefined;

  isDeleteModal: boolean = false;

  ngOnInit(): void {
    this.today = toSqlDate(new Date(new Date().setHours(0, 0, 0, 0)));
    this.api.getAllPlayers().subscribe((res) => {
      this.players = res.players;
      this.selectHandler.filteredPlayers = res.players;
      this.isLoadedPlayers = true;
    });
    this.dateTo = new Date().toISOString().slice(0, 10);
  }

  resetInput() {
    this.selectedPlayer = undefined;
    this.playerInput = '';
    this.history = [];
    this.totalPrice = undefined;
    this.balance = '';
    this.isNotPaid = false;
    this.isGame = false;
    this.isNotPaidGame = false;
    this.isAllPlayers = false;
  }

  checkInput(e?: KeyboardEvent) {
    if (
      this.playerInput.length === 0 ||
      !this.playerInput ||
      (e?.key === 'Backspace' && this.selectedPlayer)
    ) {
      this.resetInput();
    }
  }

  selectPlayer() {
    this.selectedPlayer = this.selectHandler.selectPlayer();
    if (this.selectedPlayer) {
      this.playerInput =
        this.selectedPlayer?.name + ' ' + this.selectedPlayer?.surname;
    } else {
      this.resetInput();
    }
  }

  selectPlayerOnClick(id: string | null) {
    this.resetInput();
    if (id === null) {
      return;
    }
    if (id === 'all') {
      this.selectedPlayer = undefined;
      this.isAllPlayers = true;
      this.playerInput = 'Wszyscy gracze';
      return;
    }
    this.selectedPlayer = this.players.find((pl) => pl.id === id);
    this.playerInput =
      this.selectedPlayer?.name + ' ' + this.selectedPlayer?.surname;
  }

  checkDate() {
    if (this.dateFrom && this.dateTo) {
      const from = new Date(this.dateFrom).getTime();
      const to = new Date(this.dateTo).getTime();
      from > to ? (this.dateFrom = '') : null;
    }
  }

  showHistory() {
    this.isLoading = true;
    this.history = [];
    this.totalPrice = undefined;
    this.balance = '';
    const dateFrom: string = this.dateFrom ? this.dateFrom : '';
    const dateTo: string = this.dateTo ? this.dateTo : '';
    this.api
      .getPlayerHistory(this.selectedPlayer?.id!, { dateFrom, dateTo })
      .subscribe((res) => {
        this.isLoading = false;
        this.history = res.history;
        this.totalPrice = res.totalPrice;
        this.balance = res.balance;
      });
  }

  openModal(payment: HistoryInputDTO) {
    this.payment = payment;
    this.isModal = true;
  }

  closeModal() {
    this.payment = undefined;
    this.isModal = false;
  }

  acceptPayment(payment: OutputPayment) {
    this.api.payForService(payment).subscribe({
      next: (res) => {
        this.closeModal();
        this.showHistory();
      },
      error: (err) => {
        this.closeModal();
      },
    });
  }

  openDeleteModal(payment: HistoryInputDTO) {
    this.payment = payment;
    this.isDeleteModal = true;
  }

  closeDeleteModal() {
    this.isDeleteModal = false;
  }

  deleteHistory(e: boolean) {
    if (!e) {
      return this.closeDeleteModal();
    }
    this.api.deleteHistory(this.payment?.id!).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.showHistory();
      },
    });
  }
}
