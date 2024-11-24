import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { InfoService } from 'src/app/info.service';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { Opponent, PlayerDTO } from '../player.dto';
import { LoginStateService } from '../../login-state.service';
import { SearchingService } from '../searching.service';
import { modalView } from './interfaces';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss'],
})
export class PlayersListComponent implements OnInit, OnChanges {
  environment = environment;

  constructor(
    private api: ApiService,
    private infoService: InfoService,
    private loginStateService: LoginStateService,
    public searchingService: SearchingService
  ) {}

  @Input() inputPlayers: PlayerDTO[] = [];
  @Input() inputAllOpponents: Opponent[] = [];
  @Input() inputPriceList: any;
  @Output() outputUpdateUser: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  get isAdmin() {
    return this.loginStateService.state.isAdmin;
  }

  page: number = 1;
  itemsPerPage: number = 10;
  pageCount: number = 1;

  sortView: 'name' | 'surname' | '' = '';

  searchedWord: string = '';

  players: PlayerDTO[] = [];

  isModal: boolean = false;
  modalPlayer: PlayerDTO | undefined;
  modalViewMode: modalView = 'edition';

  isDeletedModal: boolean = false;
  deletedPlayerId: string = '';

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputPlayers']?.currentValue) {
      this.players = [...this.inputPlayers];
    }
  }

  sortBy(view: 'name' | 'surname') {
    this.sortView = view;
    if (view === 'name') {
      this.players.sort((a, b) => a.name.localeCompare(b.name));
      return;
    }
    if (view === 'surname') {
      this.players.sort((a, b) => a.surname.localeCompare(b.surname));
      return;
    }
  }

  searchFor() {
    if (!this.searchedWord) {
      this.players = [...this.inputPlayers];
      if (this.sortView) {
        this.sortBy(this.sortView);
      }
      return;
    }
    this.players = [
      ...this.searchingService.searchFor(this.searchedWord, this.inputPlayers),
    ];
    if (this.sortView) {
      this.sortBy(this.sortView);
    }
  }

  openModal(player: PlayerDTO, viewMode: modalView) {
    this.isModal = true;
    this.modalViewMode = viewMode;
    this.modalPlayer = player;
  }

  closeModal() {
    this.isModal = false;
    this.modalViewMode = 'view';
    this.modalPlayer = undefined;
  }

  openDeletedModal(id: string) {
    this.deletedPlayerId = id;
    this.isDeletedModal = true;
  }

  deletePlayer(isConfirm: boolean) {
    this.isDeletedModal = false;
    if (!isConfirm) {
      this.deletedPlayerId = '';
      return;
    }
    this.api.deletePlayer(this.deletedPlayerId).subscribe({
      next: () => {
        this.infoService.showInfo('Usunięto gracza', true);
        this.players = this.players.filter(
          (pl) => pl.id !== this.deletedPlayerId
        );
        this.deletedPlayerId = '';
      },
      error: () => {
        this.deletedPlayerId = '';
        this.infoService.showInfo('Błędne id gracza', true);
      },
    });
  }
}
