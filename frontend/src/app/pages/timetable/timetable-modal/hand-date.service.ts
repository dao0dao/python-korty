import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HandDateService {

  constructor() { }

  private timeToDecimals(time: string) {
    const hour: number = parseFloat(time.slice(0, 2));
    let minutes: number = parseFloat(time.slice(3, 5));
    minutes = (minutes / 60);
    minutes = parseFloat(minutes.toPrecision(2));
    return (hour + minutes);
  }

  checkIsHourCorrect(timeFrom: string, timeTo: string): boolean {
    const from = this.timeToDecimals(timeFrom);
    const to = this.timeToDecimals(timeTo);
    if (from >= to && to !== 0) {
      return false;
    }
    return true;
  }

  checkIsQuarterOfHour(time: string) {
    let minutes: number = parseFloat(time.slice(3, 5));
    if (minutes === 0 || minutes === 15 || minutes === 30 || minutes === 45) {
      return true;
    }
    return false;
  }

  checkIsLongEnough(timeFrom: string, timeTo: string): boolean {
    const from = this.timeToDecimals(timeFrom);
    let to = this.timeToDecimals(timeTo);
    if (to === 0) {
      to = 24;
    }
    if (to - from < 0.5 && to - from > 0) {
      return false;
    }
    return true;
  }
}
