import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoService } from 'src/app/info.service';
import { AddPlayerError, Opponent, Week, PlayerDTO } from '../player.dto';
import { ApiService } from '../api.service';
import { PriceListDTO } from '../../price-list/interfaces';
import { HandleResetOpponentService } from '../handle-reset-opponent.service';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.component.html',
  styleUrls: ['./add-player.component.scss'],
})
export class AddPlayerComponent implements OnInit {
  weeks: Week[] = [];
  opponents: Opponent[] = [];
  @Input() priceList: PriceListDTO[] = [];
  @Input() allPlayers: PlayerDTO[] = [];
  @Output() outputRefreshList: EventEmitter<boolean> =
    new EventEmitter<boolean>();

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

  setWeeks(event: Week[]) {
    this.weeks = event;
  }

  setOpponents(event: Opponent[]) {
    this.opponents = event;
  }

  getField(name: string) {
    return this.formAddPlayer.get(name);
  }

  resetForm() {
    this.formAddPlayer.reset();
    this.getField('account')?.setValue(0);
    this.getField('email')?.setValue('');
    this.getField('balls')?.setValue('');
    this.getField('court')?.setValue('');
    this.getField('priceListId')?.setValue('');
    this.getField('stringsName')?.setValue('');
    this.getField('tension')?.setValue('');
    this.getField('notes')?.setValue('');
    this.formAddPlayer.updateValueAndValidity();
    this.changeStatus = !this.changeStatus;
  }

  submit() {
    this.isSending = true;
    const {
      name,
      surname,
      telephone,
      email,
      account,
      priceListId,
      court,
      stringsName,
      tension,
      balls,
      notes,
    } = this.formAddPlayer.value;
    const player: PlayerDTO = {
      weeks: this.weeks,
      opponents: this.opponents,
      name,
      surname,
      telephone,
      email,
      account,
      priceListId,
      court: parseInt(court),
      stringsName,
      tension,
      balls,
      notes,
    };
    this.api.addPlayer(player).subscribe({
      next: (res: { id: string }) => {
        this.resetForm();
        this.handleResetOpponents.resetOpponents();
        this.isSending = false;
        this.errors = {};
        this.outputRefreshList.emit(true);
        this.infoService.showInfo('Stworzono gracza', true);
      },
      error: (err: { error: AddPlayerError | string }) => {
        if (typeof err.error === 'string') {
          this.infoService.showInfo(
            `Gracz ${this.getField('name')?.value} ${
              this.getField('surname')?.value
            } już istnieje`
          );
        } else {
          this.errors = err.error;
        }
        this.isSending = false;
      },
    });
  }

  ngOnInit(): void {
    this.formAddPlayer = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.minLength(2),
        ],
      ],
      surname: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(2),
        ],
      ],
      telephone: [
        '',
        [Validators.required, Validators.minLength(9), Validators.maxLength(9)],
      ],
      email: ['', [Validators.email]],
      account: [0, [Validators.required, Validators.min(0)]],
      priceListId: [''],
      court: [''],
      stringsName: ['', Validators.maxLength(250)],
      tension: ['', Validators.maxLength(250)],
      balls: ['', Validators.maxLength(150)],
      notes: ['', Validators.maxLength(500)],
    });
  }
}
