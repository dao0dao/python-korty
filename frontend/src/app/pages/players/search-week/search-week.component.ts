import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Week } from '../player.dto';

@Component({
  selector: 'app-search-week',
  templateUrl: './search-week.component.html',
  styleUrls: ['./search-week.component.scss'],
})
export class SearchWeekComponent implements OnInit {
  @Output() outputSearchDay: EventEmitter<Week> = new EventEmitter<Week>();

  environment = environment;

  weeks: Week[] = [];
  formDay: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formDay = this.fb.group({
      s0: [''],
      s1: [''],
      s2: [''],
      s3: [''],
      s4: [''],
      s5: [''],
      s6: [''],
      sFrom: [''],
      sTo: [''],
    });
  }

  emitSearch() {
    const week: Week = {
      days: {},
      time: {
        from: this.formDay.get('sFrom')?.value,
        to: this.formDay.get('sTo')?.value,
      },
    };
    for (let i = 0; i < 7; i++) {
      const day: boolean | undefined = this.formDay.get(`s${i}`)?.value;
      if (day) {
        week.days = Object.assign({}, week.days, { [i]: day });
      }
    }
    this.outputSearchDay.emit(week);
  }
}
