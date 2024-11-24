import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { PlayerDTO } from '../../players/player.dto';
import {
  ActiveFilters,
  Reservation,
  OutputReservationDTO,
} from '../interfaces';
import { FilterPlayersService } from './filter-players.service';
import { HandDateService } from './hand-date.service';
import { HandleSelectService } from './handle-select.service';

@Component({
  selector: 'app-timetable-modal',
  templateUrl: './timetable-modal.component.html',
  styleUrls: ['./timetable-modal.component.scss'],
})
export class TimetableModalComponent implements OnInit, AfterViewInit {
  environment = environment;

  constructor(
    private fb: FormBuilder,
    public filter: FilterPlayersService,
    public selectHandler: HandleSelectService,
    private dateService: HandDateService
  ) {}

  @ViewChild('start') inputRef: ElementRef<HTMLInputElement> = {} as ElementRef;
  @Input() modalAction: 'new' | 'edit' | undefined;
  @Input() players: PlayerDTO[] = [];
  @Input() date: string = '';
  @Input() editedReservation: Reservation | undefined;
  @Output() outputCloseModal: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() outputReservationForm: EventEmitter<OutputReservationDTO> =
    new EventEmitter();

  playerOne: PlayerDTO[] = [];
  playerTwo: PlayerDTO[] = [];
  filteredPlayerOne: PlayerDTO[] = [];
  filteredPlayerTwo: PlayerDTO[] = [];

  form: FormGroup = new FormGroup({});
  getFormField(name: string): AbstractControl | null {
    return this.form.get(name);
  }
  isListOne: boolean = true;
  isListTwo: boolean = true;
  isPlayerChosen: boolean = false;
  isTimeChosen: boolean = false;

  isTimeCorrect: boolean = true;
  isMinutesCorrect: boolean = true;
  isTimeLongEnough: boolean = true;

  isSending: boolean = false;

  activeFilters: ActiveFilters = {
    playerOne: { isActive: false, isDisabled: false },
    playerTwo: { isActive: false, isDisabled: false },
    allOpponentsOne: { isActive: false, isDisabled: true },
    allOpponentsTwo: { isActive: false, isDisabled: true },
  };

  ngOnInit(): void {
    this.playerOne = [...this.players];
    this.playerTwo = [...this.players];
    this.filteredPlayerOne = [...this.players];
    this.filteredPlayerTwo = [...this.players];
    this.setForm();
    if (this.editedReservation !== undefined) {
      this.setReservationToForm();
    }
  }

  ngAfterViewInit(): void {
    if (this.inputRef?.nativeElement) {
      this.inputRef.nativeElement.focus();
    }
  }

  closeModal() {
    this.outputCloseModal.emit(true);
  }

  setForm() {
    this.form = this.fb.group({
      date: [this.date, [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      playerOne: [''],
      playerTwo: [''],
      guestOne: [''],
      guestTwo: [''],
      court: ['', [Validators.required]],
      // obsługa wyboru radio
      listOne: ['true'],
      listTwo: ['true'],
      // tylko wyświetlenie
      selectOneValue: [''],
      selectTwoValue: [''],
    });
  }

  setReservationToForm() {
    const { form } = this.editedReservation!;
    const {
      date,
      timeFrom,
      timeTo,
      playerOne,
      playerTwo,
      guestOne,
      guestTwo,
      court,
    } = form;
    this.getFormField('date')?.setValue(date);
    this.getFormField('from')?.setValue(timeFrom);
    this.getFormField('to')?.setValue(timeTo);
    this.getFormField('court')?.setValue(court);
    if (playerOne) {
      this.getFormField('playerOne')?.setValue(playerOne.id);
      this.getFormField('listOne')?.setValue('true');
    }
    if (playerTwo) {
      this.getFormField('playerTwo')?.setValue(playerTwo.id);
      this.getFormField('listTwo')?.setValue('true');
    }
    if (guestOne) {
      this.getFormField('guestOne')?.setValue(guestOne);
      this.getFormField('listOne')?.setValue('false');
      this.isListOne = false;
    }
    if (guestTwo) {
      this.getFormField('guestTwo')?.setValue(guestTwo);
      this.getFormField('listTwo')?.setValue('false');
      this.isListTwo = false;
    }
    this.form.updateValueAndValidity();
    this.handleIsTimeChosen();
    this.handleIsPlayerChosen();
  }

  handleIsTimeChosen() {
    if (this.getFormField('from')?.value.length == 5) {
      this.isMinutesCorrect = this.dateService.checkIsQuarterOfHour(
        this.getFormField('from')?.value
      );
    }
    if (this.getFormField('to')?.value.length == 5) {
      this.isMinutesCorrect = this.dateService.checkIsQuarterOfHour(
        this.getFormField('to')?.value
      );
    }
    if (
      this.getFormField('from')?.value.length == 5 &&
      this.getFormField('to')?.value.length == 5
    ) {
      this.isTimeCorrect = this.dateService.checkIsHourCorrect(
        this.getFormField('from')?.value,
        this.getFormField('to')?.value
      );
      this.isTimeLongEnough = this.dateService.checkIsLongEnough(
        this.getFormField('from')?.value,
        this.getFormField('to')?.value
      );
    }
    if (
      this.getFormField('from')?.value.length == 5 &&
      this.getFormField('to')?.value.length == 5 &&
      this.isTimeCorrect &&
      this.isMinutesCorrect
    ) {
      this.isTimeChosen = true;
    } else {
      this.isTimeChosen = false;
    }
  }

  handleTypeChoseOne() {
    if (this.getFormField('listOne')?.value == 'true') {
      this.isListOne = true;
      this.getFormField('guestOne')?.setValue('');
      this.form.updateValueAndValidity();
    }
    if (this.getFormField('listOne')?.value == 'false') {
      this.isListOne = false;
      this.getFormField('playerOne')?.setValue('');
      this.getFormField('selectOneValue')?.setValue('');
      this.form.updateValueAndValidity();
    }
    this.handleIsPlayerChosen();
  }

  handleTypeChoseTwo() {
    if (this.getFormField('listTwo')?.value == 'true') {
      this.isListTwo = true;
      this.getFormField('guestTwo')?.setValue('');
      this.form.updateValueAndValidity();
    }
    if (this.getFormField('listTwo')?.value == 'false') {
      this.isListTwo = false;
      this.getFormField('playerTwo')?.setValue('');
      this.getFormField('selectTwoValue')?.setValue('');
      this.form.updateValueAndValidity();
    }
    this.handleIsPlayerChosen();
  }

  private switchTypeToList(list: 'listOne' | 'listTwo') {
    if (list === 'listOne') {
      this.isListOne = true;
      this.getFormField('guestOne')?.setValue('');
      this.getFormField('playerOne')?.setValue('');
    }
    if (list === 'listTwo') {
      this.isListTwo = true;
      this.getFormField('guestTwo')?.setValue('');
      this.getFormField('playerTwo')?.setValue('');
    }
    this.getFormField(list)?.setValue('true');
    this.form.updateValueAndValidity();
    this.handleIsPlayerChosen();
  }

  handleChangeSelectOne() {
    this.handleIsPlayerChosen();
    this.refreshFilters('listOne');
  }

  handleChangeSelectTwo() {
    this.handleIsPlayerChosen();
    this.refreshFilters('listTwo');
  }

  handleKeyEnterOne() {
    const player = this.selectHandler.keyEnter(
      'listOne',
      this.filteredPlayerOne
    );
    if (player) {
      this.handleSelectPlayerOne(player.id!);
    } else {
      this.handleSelectPlayerOne('');
    }
  }
  handleKeyEnterTwo() {
    const player = this.selectHandler.keyEnter(
      'listTwo',
      this.filteredPlayerTwo
    );
    if (player) {
      this.handleSelectPlayerTwo(player.id!);
    } else {
      this.handleSelectPlayerTwo('');
    }
  }

  handleSelectPlayerOne(id: string) {
    this.getFormField('playerOne')?.setValue(id);
    const player = this.playerOne.find((pl) => pl.id === id);
    if (player) {
      this.getFormField('selectOneValue')?.setValue(
        player.name + ' ' + player.surname
      );
    } else {
      this.getFormField('selectOneValue')?.setValue('');
    }
    this.form.updateValueAndValidity();
    this.handleChangeSelectOne();
  }

  handleSelectPlayerTwo(id: string) {
    this.getFormField('playerTwo')?.setValue(id);
    const player = this.playerTwo.find((pl) => pl.id === id);
    if (player) {
      this.getFormField('selectTwoValue')?.setValue(
        player.name + ' ' + player.surname
      );
    } else {
      this.getFormField('selectTwoValue')?.setValue('');
    }
    this.form.updateValueAndValidity();
    this.handleChangeSelectOne();
  }

  handleClearPlayerOne() {
    this.getFormField('playerOne')?.setValue('');
    this.getFormField('selectOneValue')?.setValue('');
    this.form.updateValueAndValidity();
    this.handleChangeSelectOne();
  }

  handleClearPlayerTwo() {
    this.getFormField('playerTwo')?.setValue('');
    this.getFormField('selectTwoValue')?.setValue('');
    this.form.updateValueAndValidity();
    this.handleChangeSelectOne();
  }

  handleReduceListOne() {
    this.filteredPlayerOne = [
      ...this.filter.reduceList(
        this.getFormField('selectOneValue')?.value,
        this.playerOne
      ),
    ];
    if (this.activeFilters.allOpponentsOne.isActive) {
      this.findAllOpponentsOne();
    }
  }

  resetSelectValueOne() {
    this.getFormField('selectOneValue')?.setValue('');
  }

  resetSelectValueTwo() {
    this.getFormField('selectTwoValue')?.setValue('');
  }

  handleReduceListTwo() {
    this.filteredPlayerTwo = [
      ...this.filter.reduceList(
        this.getFormField('selectTwoValue')?.value,
        this.playerTwo
      ),
    ];
  }

  handleIsPlayerChosen() {
    const playerOne = this.getFormField('playerOne')?.value;
    const guestOne = this.getFormField('guestOne')?.value;
    const playerTwo = this.getFormField('playerTwo')?.value;
    const guestTwo = this.getFormField('guestTwo')?.value;
    if (
      (playerOne && this.isListOne) ||
      (guestOne && !this.isListOne) ||
      (playerTwo && this.isListTwo) ||
      (guestTwo && !this.isListTwo)
    ) {
      this.isPlayerChosen = true;
    } else {
      this.isPlayerChosen = false;
    }
    this.handleActivateOpponentsFilter();
  }

  private handleActivateOpponentsFilter() {
    const playerOne = this.getFormField('playerOne')?.value;
    const playerTwo = this.getFormField('playerTwo')?.value;
    if (
      playerOne &&
      this.isListOne &&
      !playerTwo &&
      !this.activeFilters.playerTwo.isActive
    ) {
      this.activeFilters.allOpponentsOne.isDisabled = false;
    } else {
      this.activeFilters.allOpponentsOne.isDisabled = true;
    }
    if (
      playerTwo &&
      this.isListTwo &&
      !playerOne &&
      !this.activeFilters.playerOne.isActive
    ) {
      this.activeFilters.allOpponentsTwo.isDisabled = false;
    } else {
      this.activeFilters.allOpponentsTwo.isDisabled = true;
    }
  }

  private resetOponentFilterOne() {
    this.activeFilters.allOpponentsOne.isActive = false;
    this.playerTwo = [...this.players];
    this.filteredPlayerTwo = [...this.players];
  }

  private resetOponentFilterTwo() {
    this.activeFilters.allOpponentsTwo.isActive = false;
    this.playerOne = [...this.players];
    this.filteredPlayerOne = [...this.players];
  }

  private findPlayer(): PlayerDTO[] {
    return this.filter.findPlayers(
      this.players,
      this.getFormField('from')?.value,
      this.getFormField('to')?.value,
      this.getFormField('date')?.value
    );
  }

  private findAllOpponents(playerId: string) {
    return this.filter.findAllOpponents(playerId, this.players);
  }

  reducePlayerListToDateAndHours() {
    this.findPlayerOne();
    this.findPlayerTwo();
  }

  findPlayerOne() {
    this.resetSelectValueOne();
    if (!this.activeFilters.playerOne.isActive) {
      this.switchTypeToList('listOne');
      this.playerOne = [...this.findPlayer()];
      this.filteredPlayerOne = [...this.findPlayer()];
      this.activeFilters.playerOne.isActive = true;
      this.activeFilters.allOpponentsTwo.isDisabled = true;
      this.activeFilters.allOpponentsTwo.isDisabled = false;
    } else {
      this.playerOne = [...this.players];
      this.filteredPlayerOne = [...this.players];
      this.activeFilters.playerOne.isActive = false;
      this.activeFilters.allOpponentsTwo.isDisabled = false;
      this.activeFilters.allOpponentsTwo.isDisabled = false;
      if (this.activeFilters.allOpponentsOne.isActive) {
        this.resetOponentFilterOne();
      }
    }
    this.handleActivateOpponentsFilter();
  }

  findAllOpponentsOne(refresh: boolean = false) {
    if (!this.activeFilters.allOpponentsOne.isActive || refresh) {
      if (refresh) {
        this.getFormField('playerTwo')?.setValue('');
      } else {
        this.resetSelectValueTwo();
      }
      const playerId = this.getFormField('playerOne')?.value;
      this.switchTypeToList('listTwo');
      this.playerTwo = [...this.findAllOpponents(playerId)];
      this.filteredPlayerTwo = [...this.findAllOpponents(playerId)];
      this.activeFilters.playerTwo.isDisabled = true;
      this.activeFilters.allOpponentsOne.isActive = true;
    } else {
      this.resetSelectValueTwo();
      this.playerTwo = [...this.players];
      this.filteredPlayerTwo = [...this.players];
      this.activeFilters.playerTwo.isDisabled = false;
      this.activeFilters.allOpponentsOne.isActive = false;
      if (this.activeFilters.allOpponentsTwo.isActive) {
        this.resetOponentFilterTwo();
      }
    }
  }

  findPlayerTwo() {
    this.resetSelectValueTwo();
    if (!this.activeFilters.playerTwo.isActive) {
      this.switchTypeToList('listTwo');
      this.playerTwo = [...this.findPlayer()];
      this.filteredPlayerTwo = [...this.findPlayer()];
      this.activeFilters.playerTwo.isActive = true;
      this.activeFilters.allOpponentsOne.isDisabled = true;
      this.activeFilters.allOpponentsOne.isDisabled = true;
    } else {
      this.playerTwo = [...this.players];
      this.filteredPlayerTwo = [...this.players];
      this.activeFilters.playerTwo.isActive = false;
      this.activeFilters.allOpponentsOne.isDisabled = false;
      this.activeFilters.allOpponentsOne.isDisabled = false;
    }
    this.handleActivateOpponentsFilter();
  }

  findAllOpponentsTwo(refresh: boolean = false) {
    if (!this.activeFilters.allOpponentsTwo.isActive || refresh) {
      if (refresh) {
        this.getFormField('playerOne')?.setValue('');
      } else {
        this.resetSelectValueOne();
      }
      const playerId = this.getFormField('playerTwo')?.value;
      this.switchTypeToList('listOne');
      this.playerOne = [...this.findAllOpponents(playerId)];
      this.filteredPlayerOne = [...this.findAllOpponents(playerId)];
      this.activeFilters.playerOne.isDisabled = true;
      this.activeFilters.allOpponentsTwo.isActive = true;
    } else {
      this.resetSelectValueOne();
      this.playerTwo = [...this.players];
      this.filteredPlayerTwo = [...this.players];
      this.activeFilters.playerOne.isDisabled = false;
      this.activeFilters.allOpponentsTwo.isActive = false;
      if (this.activeFilters.allOpponentsOne.isActive) {
        this.resetOponentFilterOne();
      }
    }
  }

  refreshFilters(list: 'listOne' | 'listTwo') {
    if (list === 'listOne' && this.getFormField('playerOne')?.value == '') {
      this.resetOponentFilterOne();
      this.activeFilters.playerTwo.isDisabled = false;
      return;
    }
    if (list === 'listOne' && this.getFormField('playerOne')?.value != '') {
      if (this.activeFilters.allOpponentsOne.isActive) {
        this.findAllOpponentsOne(true);
        return;
      }
    }
    if (list === 'listTwo' && this.getFormField('playerTwo')?.value == '') {
      this.resetOponentFilterTwo();
      this.activeFilters.playerOne.isDisabled = false;
      return;
    }
    if (list === 'listTwo' && this.getFormField('playerTwo')?.value != '') {
      if (this.activeFilters.allOpponentsTwo.isActive) {
        this.findAllOpponentsTwo(true);
        return;
      }
    }
  }

  findPhone(id: string): number | undefined {
    const player = this.players.find((pl) => pl.id === id);
    return player?.telephone;
  }

  samePlayers(): boolean {
    const playerOne = this.getFormField('playerOne')?.value;
    const playerTwo = this.getFormField('playerTwo')?.value;
    const guestOne = this.getFormField('guestOne')?.value.trim().toLowerCase();
    const guestTwo = this.getFormField('guestTwo')?.value.trim().toLowerCase();
    if (
      (playerOne === playerTwo && playerOne != '' && playerTwo != '') ||
      (guestOne === guestTwo && guestOne != '' && guestTwo != '')
    ) {
      return true;
    }
    return false;
  }

  submitForm() {
    const date: string = this.getFormField('date')?.value;
    const timeFrom: string = this.getFormField('from')?.value;
    const timeTo: string = this.getFormField('to')?.value;
    const court = parseInt(this.getFormField('court')?.value);
    const playerOne: PlayerDTO | undefined = this.players.find(
      (pl) => pl.id === this.getFormField('playerOne')?.value
    );
    const playerTwo: PlayerDTO | undefined = this.players.find(
      (pl) => pl.id === this.getFormField('playerTwo')?.value
    );
    const guestOne: string = this.getFormField('guestOne')?.value;
    const guestTwo: string = this.getFormField('guestTwo')?.value;

    const form: OutputReservationDTO = {
      form: {
        date,
        timeFrom,
        timeTo,
        court,
        playerOne: playerOne?.id,
        playerTwo: playerTwo?.id,
        guestOne,
        guestTwo,
      },
    };
    this.isSending = true;
    this.outputReservationForm.emit(form);
  }
}
