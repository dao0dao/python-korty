import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HourPrice, ModalAction, PriceListDTO } from '../interfaces';

interface Day {
  id: number;
  name: string;
}

@Component({
  selector: 'app-price-list-modal',
  templateUrl: './price-list-modal.component.html',
  styleUrls: ['./price-list-modal.component.scss'],
})
export class PriceListModalComponent implements OnInit {
  environment = environment;

  @Input() action: ModalAction | undefined;
  @Input() priceList: PriceListDTO | undefined;
  @Output() outputClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() outputNewList: EventEmitter<PriceListDTO> =
    new EventEmitter<PriceListDTO>();

  fields: { [key: string]: HourPrice } = {};
  days: Day[] = [
    { id: 1, name: 'Pn' },
    { id: 2, name: 'Wt' },
    { id: 3, name: 'Śr' },
    { id: 4, name: 'Cz' },
    { id: 5, name: 'Pt' },
    { id: 6, name: 'Sb' },
    { id: 0, name: 'Nd' },
  ];

  form: FormGroup = new FormGroup({});
  isSameHours: boolean = false;
  existedHourIndex: string = '';
  wrongHours: { [key: string]: boolean } = {};
  isWrongHours: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.action === 'new' || this.action === 'edit') {
      this.form = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(150)]],
        defaultPrice: [0, [Validators.required, Validators.min(0)]],
      });
    }
    if (this.action === 'edit' && this.priceList) {
      this.fields = this.priceList.hours;
      this.form.get('name')?.setValue(this.priceList.name);
      this.form.get('defaultPrice')?.setValue(this.priceList.defaultPrice);
      this.setFormForEdition();
      this.form.updateValueAndValidity();
    }
  }

  getField(groupNumber: string, fieldName: string) {
    const group = this.form.get('group-' + groupNumber);
    const field = group?.get(fieldName);
    return field;
  }

  getGroup(groupNumber: string) {
    return this.form.get('group-' + groupNumber);
  }

  addField() {
    let lastIndex: number = 0;
    Object.keys(this.fields).forEach((k) =>
      parseInt(k) >= lastIndex ? (lastIndex = parseInt(k) + 1) : null
    );
    const field: HourPrice = { from: '', to: '', days: [], price: 0 };
    const fields = this.fb.group({
      from: ['', [Validators.required]],
      to: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      d0: [false],
      d1: [false],
      d2: [false],
      d3: [false],
      d4: [false],
      d5: [false],
      d6: [false],
    });
    const groupName = 'group-' + lastIndex;
    this.fields[lastIndex] = field;
    this.form.addControl(groupName, fields);
    this.form.updateValueAndValidity();
  }

  removeField(groupNumber: string) {
    const groupName = 'group-' + groupNumber;
    this.form.removeControl(groupName);
    this.form.updateValueAndValidity();
    delete this.fields[groupNumber];
  }

  isErrorRequired(groupNumber: string): boolean | undefined {
    const isFrom =
      this.getField(groupNumber, 'from')?.invalid &&
      this.getField(groupNumber, 'from')?.touched;
    const isTo =
      this.getField(groupNumber, 'to')?.invalid &&
      this.getField(groupNumber, 'to')?.touched;
    const isPrice =
      this.getField(groupNumber, 'price')?.invalid &&
      this.getField(groupNumber, 'price')?.touched;
    return isFrom || isTo || isPrice;
  }

  validateSameHours(key: string) {
    this.checkCoveringHours();
    this.checkFromToHours(key);
    this.checkWrongHour();
  }

  checkCoveringHours() {
    let isError: boolean = false;
    let sameHourIndex: string = '';
    for (let i in this.fields) {
      const fromA = parseFloat(
        this.getField(i, 'from')?.value.replace(':', '.')
      );
      let toA = parseFloat(this.getField(i, 'to')?.value.replace(':', '.'));
      if (toA === 0) {
        toA = 24.0;
      }
      for (let j in this.fields) {
        if (i != j) {
          const daysA: number[] = [];
          const daysB: number[] = [];
          for (let d = 0; d < 7; d++) {
            if (this.getField(i, 'd' + d)?.value) {
              daysA.push(d);
            }
            if (this.getField(j, 'd' + d)?.value) {
              daysB.push(d);
            }
          }
          let isSameDays: boolean = false;
          for (const d of daysA) {
            daysB.includes(d) ? (isSameDays = true) : null;
          }
          for (const d of daysB) {
            daysA.includes(d) ? (isSameDays = true) : null;
          }
          daysA.length === 0 && daysB.length === 0 ? (isSameDays = true) : null;
          const fromB = parseFloat(
            this.getField(j, 'from')?.value.replace(':', '.')
          );
          let toB = parseFloat(this.getField(j, 'to')?.value.replace(':', '.'));
          if (toB === 0) {
            toB = 24.0;
          }
          if (
            (fromA < fromB && toA > fromB && isSameDays) ||
            (fromA >= fromB && toA <= toB && isSameDays) ||
            (fromA < toB && toA > toB && isSameDays)
          ) {
            isError = true;
            sameHourIndex = i;
          }
        }
      }
    }
    this.isSameHours = isError;
    this.existedHourIndex = sameHourIndex;
  }

  checkFromToHours(key: string) {
    const fromField = this.getField(key, 'from')?.value;
    const toField = this.getField(key, 'to')?.value;
    if (!fromField || !toField) {
      return;
    }
    const from = parseFloat(fromField.replace(':', '.'));
    let to = parseFloat(toField.replace(':', '.'));
    to == 0 ? (to = 24) : null;
    from < to ? (this.wrongHours[key] = false) : (this.wrongHours[key] = true);
  }

  checkWrongHour() {
    let isWrong = false;
    for (let i in this.wrongHours) {
      this.wrongHours[i] === true ? (isWrong = true) : null;
    }
    this.isWrongHours = isWrong;
  }

  setFormForEdition() {
    for (let i in this.priceList?.hours) {
      const { from, to, price, days } = this.priceList?.hours[i]!;
      const groupName = 'group-' + i;
      const fields = this.fb.group({
        from: [from, Validators.required],
        to: [to, Validators.required],
        price: [price, [Validators.required, Validators.min(0)]],
        d0: [days.includes(0)],
        d1: [days.includes(1)],
        d2: [days.includes(2)],
        d3: [days.includes(3)],
        d4: [days.includes(4)],
        d5: [days.includes(5)],
        d6: [days.includes(6)],
      });
      this.form.addControl(groupName, fields);
    }
  }

  submit() {
    const priceList: PriceListDTO = {
      id: this.priceList?.id,
      name: this.form.get('name')?.value,
      hours: this.fields,
      defaultPrice: parseFloat(this.form.get('defaultPrice')?.value),
    };
    for (let i in this.fields) {
      const { hours } = priceList;
      hours[i].from = this.getField(i, 'from')?.value;
      hours[i].to = this.getField(i, 'to')?.value;
      hours[i].price = this.getField(i, 'price')?.value;
      const days: number[] = [];
      for (let d = 0; d < 7; d++) {
        if (this.getField(i, 'd' + d)?.value) {
          days.push(d);
        }
      }
      hours[i].days = days;
    }
    this.outputNewList.emit(priceList);
  }

  closeModal() {
    this.outputClose.emit(true);
  }
}
