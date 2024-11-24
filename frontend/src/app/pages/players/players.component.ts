import { Component, Input, OnInit } from '@angular/core';
import { LoginStateService } from '../login-state.service';
import { PriceListDTO } from '../price-list/interfaces';
import { ApiService } from './api.service';
import { Opponent, PlayerDTO } from './player.dto';

type Overlap = 'add' | 'list';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss'],
})
export class PlayersComponent implements OnInit {
  constructor(
    private api: ApiService,
    public stateService: LoginStateService
  ) {}
  @Input() allOpponents: Opponent[] = [];

  overlap: Overlap = 'list';
  players: PlayerDTO[] = [];
  priceList: PriceListDTO[] = [];
  isLoading: boolean = true;

  ngOnInit(): void {
    this.loadPlayers();
    this.api.getPriceList().subscribe((res) => {
      this.priceList = res.priceList;
    });
  }

  changeOverlap(name: Overlap) {
    this.overlap = name;
  }

  loadPlayers() {
    this.api.getAllPlayers().subscribe({
      next: (res) => {
        this.players = res.players;
        res.players.forEach((player) => {
          this.allOpponents.push({
            id: player.id!,
            name: player.name,
            surname: player.surname,
          });
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  reloadPlayers() {
    this.isLoading = true;
    this.players = [];
    this.allOpponents = [];
    this.loadPlayers();
  }
}
