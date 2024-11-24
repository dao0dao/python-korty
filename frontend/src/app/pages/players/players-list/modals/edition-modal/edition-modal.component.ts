import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoService } from 'src/app/info.service';
import { PriceListDTO } from 'src/app/pages/price-list/interfaces';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../../api.service';
import { HandleResetOpponentService } from '../../../handle-reset-opponent.service';
import {
  AddPlayerError,
  Opponent,
  PlayerDTO,
  PlayerUpdateDTO,
  Week,
} from '../../../player.dto';
import { modalView } from '../../interfaces';

@Component({
  selector: 'app-edition-modal',
  templateUrl: './edition-modal.component.html',
  styleUrls: ['./edition-modal.component.scss'],
})
export class EditionModalComponent implements OnInit {
  title: string = '';
  private weeks: Week[] = [];
  private opponents: Opponent[] = [];
  @Input() player: PlayerDTO = {} as PlayerDTO;
  @Input() viewMode: modalView = 'view';
  @Input() priceList: PriceListDTO[] = [];
  @Input() allPlayers: PlayerDTO[] = [];
  @Output() outputRefreshList: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() Close: EventEmitter<boolean> = new EventEmitter();

  isSending: boolean = false;
  changeStatus: boolean = false;

  formAddPlayer: FormGroup = new FormGroup({});
  errors: AddPlayerError = {};

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private infoService: InfoService,
    private handleResetOpponents: HandleResetOpponentService
  ) {}

  ngOnInit(): void {
    this.title = this.player.name + ' ' + this.player.surname;
    this.formAddPlayer = this.fb.group({
      name: [
        this.player.name,
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(2),
        ],
      ],
      surname: [
        this.player.surname,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(2),
        ],
      ],
      telephone: [
        this.player.telephone,
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      email: [this.player.email, [Validators.email]],
      priceListId: [this.player.priceListId],
      court: [this.player.court],
      stringsName: [this.player.stringsName, Validators.maxLength(250)],
      tension: [this.player.tension, Validators.maxLength(250)],
      balls: [this.player.balls, Validators.maxLength(150)],
      notes: [this.player.notes, Validators.maxLength(500)],
    });
  }

  setWeeks(event: Week[]) {
    this.weeks = event;
  }

  setOpponents(event: Opponent[]) {
    this.opponents = event;
  }

  getField(name: string) {
    return this.formAddPlayer.get(name);
  }

  closeModal() {
    this.Close.emit(true);
  }

  submit() {
    this.isSending = true;
    const {
      name,
      surname,
      telephone,
      email,
      priceListId,
      court,
      stringsName,
      tension,
      balls,
      notes,
    } = this.formAddPlayer.value;
    const player: PlayerUpdateDTO = {
      id: this.player.id,
      weeks: this.weeks,
      opponents: this.opponents,
      name,
      surname,
      telephone,
      email,
      priceListId,
      court: parseInt(court),
      stringsName,
      tension,
      balls,
      notes,
    };
    this.api.updatePlayer(player).subscribe({
      next: () => {
        this.infoService.showInfo('Zaktualizowano gracza', true);
        this.closeModal();
      },
      error: () => {
        this.infoService.showInfo('Błędne dane');
        this.closeModal();
      },
    });
  }
}
