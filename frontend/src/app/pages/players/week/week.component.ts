import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Week } from '../player.dto';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss'],
})
export class WeekComponent implements OnInit, OnChanges {
  @Output() outputWeeks: EventEmitter<Week[]> = new EventEmitter<Week[]>();
  @Input() changeStatus: boolean = false;
  @Input() editedWeeks: Week[] | undefined;
  @Input() isView: boolean | undefined;

  environment = environment;

  weeks: Week[] = [];
  formWeek: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formWeek = this.fb.group({
      isDay: ['', Validators.required],
      0: [''],
      1: [''],
      2: [''],
      3: [''],
      4: [''],
      5: [''],
      6: [''],
      isHour: ['', Validators.required],
      from: [''],
      to: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.['changeStatus']?.currentValue !=
      changes?.['changeStatus']?.previousValue
    ) {
      this.formWeek.reset();
      this.weeks = [];
      this.outputWeeks.emit([]);
    }
    if (changes?.['editedWeeks']?.currentValue) {
      this.weeks = [...this.editedWeeks!];
      this.outputWeeks.emit(this.weeks);
    }
  }

  checkDay() {
    let isDay: boolean | string = '';
    for (let i = 0; i < 7; i++) {
      const day = this.formWeek.get(`${i}`);
      day?.value === true ? (isDay = true) : null;
    }
    this.formWeek.get('isDay')?.setValue(isDay);
    this.formWeek.get('isDay')?.updateValueAndValidity();
  }

  checkHour() {
    let isHour: boolean | string = '';
    const from = this.formWeek.get('from')?.value;
    const to = this.formWeek.get('to')?.value;
    from !== '' ? (isHour = true) : null;
    to !== '' ? (isHour = true) : null;
    this.formWeek.get('isHour')?.setValue(isHour);
    this.formWeek.get('isHour')?.updateValueAndValidity();
  }

  addTerm() {
    const week: Week = {
      days: {},
      time: {
        from: this.formWeek.get('from')?.value,
        to: this.formWeek.get('to')?.value,
      },
    };
    for (let i = 0; i < 7; i++) {
      const day: boolean | undefined = this.formWeek.get(`${i}`)?.value;
      if (day) {
        week.days = Object.assign({}, week.days, { [i]: day });
      }
    }
    this.weeks.push(week);
    this.formWeek.reset();
    this.outputWeeks.emit(this.weeks);
  }

  removeTerm(index: number) {
    this.weeks = this.weeks.filter((el, i) => i != index);
    this.outputWeeks.emit(this.weeks);
  }
}
