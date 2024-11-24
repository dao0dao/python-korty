import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Opponent, PlayerDTO } from '../player.dto';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HandleResetOpponentService } from '../handle-reset-opponent.service';

@Component({
  selector: 'app-opponent',
  templateUrl: './opponent.component.html',
  styleUrls: ['./opponent.component.scss'],
})
export class OpponentComponent implements OnInit, OnChanges {
  @Input() allPayers: PlayerDTO[] = [];
  @Input() isView: boolean = false;
  @Input() playerId: string = '';
  @Input() chosenOpponents: Opponent[] = [];
  @Output() outputOpponents: EventEmitter<Opponent[]> = new EventEmitter();

  environment = environment;

  constructor(
    private fb: FormBuilder,
    private handleReset: HandleResetOpponentService
  ) {}

  formOpponent: FormGroup = new FormGroup({});

  opponents: Opponent[] = [];
  notChosenOpponents: Opponent[] = [];

  ngOnInit(): void {
    this.handleReset.$reset.subscribe({
      next: (res) => {
        if (res) {
          this.opponents = [];
          this.setNotChosenOpponents();
        }
      },
    });
    this.formOpponent = this.fb.group({
      opponent: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.['playerId']?.currentValue &&
      changes?.['chosenOpponents']?.currentValue
    ) {
      this.opponents = [...this.chosenOpponents];
      this.setNotChosenOpponents(this.playerId);
      return;
    }
    if (changes['allPayers'].currentValue) {
      this.setNotChosenOpponents();
    }
  }

  setNotChosenOpponents(avoidPlayerId?: string) {
    this.notChosenOpponents = [];
    this.formOpponent.get('opponent')?.setValue('');
    this.formOpponent.updateValueAndValidity();
    if (avoidPlayerId) {
      this.allPayers = this.allPayers.filter((pl) => pl.id !== avoidPlayerId);
    }
    for (let player of this.allPayers) {
      if (this.opponents.find((op) => op.id === player.id) === undefined) {
        this.notChosenOpponents.push({
          id: player.id!,
          name: player.name,
          surname: player.surname,
        });
      }
    }
  }

  addOpponent() {
    const player = this.allPayers.find(
      (pl) => pl.id == this.formOpponent.get('opponent')?.value
    );
    if (player) {
      this.opponents.push({
        id: player.id!,
        name: player.name,
        surname: player.surname,
      });
      this.submit();
      this.setNotChosenOpponents();
      this.formOpponent.reset();
    }
  }

  deleteOpponent(id: string) {
    const opponent = this.opponents.find((op) => op.id === id);
    if (opponent) {
      this.opponents = this.opponents.filter((op) => op.id !== opponent.id);
    }
    this.submit();
    this.setNotChosenOpponents();
  }

  submit() {
    this.outputOpponents.emit(this.opponents);
  }
}
