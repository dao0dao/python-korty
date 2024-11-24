import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginStateService } from '../login-state.service';
import { PlayerDTO } from '../players/player.dto';
import { ApiService } from './api.service';
import { Action, PaymentMethod, ServicePayment, Service } from './interfaces';
import { SelectHandlerService } from './select-handler.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  constructor(
    private api: ApiService,
    public selectHandler: SelectHandlerService,
    public loginService: LoginStateService
  ) {}

  environment = environment;

  services: Service[] = [];

  isLoadedServices: boolean = false;
  isLoadedPlayers: boolean = false;

  players: PlayerDTO[] = [];
  selectedPlayer: PlayerDTO | undefined;
  playerInput: string = '';
  action: Action;

  inputCharge: number = 0;

  selectService: string = '';
  inputService: number | undefined;
  paymentMethod: PaymentMethod | undefined;

  isServiceList: boolean = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.api
      .getAllPlayers()
      .pipe(take(1))
      .subscribe((res) => {
        this.players = res.players;
        this.selectHandler.filteredPlayers = res.players;
        this.isLoadedPlayers = true;
      });
    this.api.getAllServices().subscribe((res) => {
      this.services = res.services;
      this.isLoadedServices = true;
    });
  }

  changeAction(name: Action) {
    this.action = name;
  }

  checkInput(e?: KeyboardEvent) {
    if (
      this.playerInput.length === 0 ||
      !this.playerInput ||
      (e?.key === 'Backspace' && this.selectedPlayer)
    ) {
      this.resetPayments();
    }
  }

  resetPayments() {
    this.action = undefined;
    this.selectedPlayer = undefined;
    this.playerInput = '';
    this.inputCharge = 0;
    this.inputService = undefined;
    this.selectService = '';
    this.paymentMethod = undefined;
  }

  selectPlayer() {
    this.selectedPlayer = this.selectHandler.selectPlayer();
    if (this.selectedPlayer) {
      this.playerInput =
        this.selectedPlayer?.name + ' ' + this.selectedPlayer?.surname;
    } else {
      this.resetPayments();
    }
  }

  selectPlayerOnClick(id: string | null) {
    if (id === null) {
      this.resetPayments();
      return;
    }
    this.selectedPlayer = this.players.find((pl) => pl.id === id);
    this.playerInput =
      this.selectedPlayer?.name + ' ' + this.selectedPlayer?.surname;
  }

  checkCharge() {
    if (
      this.inputCharge !== undefined &&
      (this.inputCharge < 0 || this.inputCharge === -0)
    ) {
      this.inputCharge = 0;
    }
  }

  changeService() {
    if (this.selectService) {
      for (let i in this.services) {
        const s = this.services[i];
        if (s.name === this.selectService) {
          this.inputService = s.price;
        }
      }
    } else {
      this.inputService = undefined;
    }
  }

  openServiceList() {
    this.isServiceList = true;
  }

  closeServiceList() {
    this.services = [];
    this.isServiceList = false;
    this.isLoadedServices = false;
    this.api.getAllServices().subscribe({
      next: (res) => {
        this.services = res.services;
        this.isLoadedServices = true;
      },
      error: (err) => {
        this.isLoadedServices = true;
      },
    });
  }

  chargeAccount() {
    const data: ServicePayment = {
      id: this.selectedPlayer?.id!,
      value: this.inputCharge,
      name: this.selectedPlayer?.name! + ' ' + this.selectedPlayer?.surname!,
      serviceName: 'Doładowanie konta',
      paymentMethod: 'charge',
    };
    this.api.accountChargeOrPayment(data).subscribe({
      next: (res) => {
        this.resetPayments();
      },
    });
  }

  getPaymentForService() {
    const data: ServicePayment = {
      id: this.selectedPlayer?.id!,
      value: this.inputService!,
      name: this.selectedPlayer?.name! + ' ' + this.selectedPlayer?.surname!,
      serviceName: this.selectService,
      paymentMethod: this.paymentMethod!,
    };
    this.api.accountChargeOrPayment(data).subscribe({
      next: (res) => {
        this.resetPayments();
      },
    });
  }
}
