import { Injectable } from '@angular/core';
import { PlayerDTO, Week } from './player.dto';

@Injectable()
export class SearchingService {
  constructor() {}

  searchFor(input: string, array: PlayerDTO[]): PlayerDTO[] {
    // if (!input && !Object.keys(searchWeek.days).length) {
    if (!input) {
      return array;
    }
    const value = input.toLocaleLowerCase().split(' ');
    const players: PlayerDTO[] = [];
    array.forEach((p) => {
      const {
        name,
        surname,
        telephone,
        email,
        court,
        stringsName,
        balls,
        notes,
      } = p;
      let matches: number = 0;
      for (let i = 0; i < value.length; i++) {
        const word = value[i].toLocaleLowerCase();
        if (
          name.toLocaleLowerCase().startsWith(word) ||
          surname.toLocaleLowerCase().startsWith(word) ||
          telephone?.toString().startsWith(word) ||
          email?.toLocaleLowerCase().startsWith(word) ||
          stringsName?.toLocaleLowerCase().startsWith(word) ||
          balls?.toLocaleLowerCase().startsWith(word)
          // || priceSummer?.toString().includes(word) ||
          // priceWinter?.toString().includes(word)
        ) {
          matches += 1;
        }
        if ('niebieski'.startsWith(word) && court == 1) {
          matches += 1;
        }
        if ('fioletowy'.startsWith(word) && court == 2) {
          matches += 1;
        }
        if (notes) {
          const notesWords = notes.toLocaleLowerCase().split(' ');
          for (let note of notesWords) {
            if (note.startsWith(word)) {
              matches += 1;
            }
          }
        }
      }
      if (matches >= value.length) {
        players.push(p);
      }
    });
    return players;
  }

  private checkDayMatch(day: any, searchDay: any, key: any): number {
    if (day[key] === searchDay[key]) {
      return 1;
    }
    return 0;
  }

  private searchForDay(searchWeek: Week, arr: PlayerDTO[]): PlayerDTO[] {
    const players: PlayerDTO[] = [];
    arr.forEach((p) => {
      for (let week of p.weeks) {
        if (!searchWeek.time.from && !searchWeek.time.to) {
          const keys = Object.keys(searchWeek.days);
          let matches = 0;
          for (let i = 0; i < keys.length; i++) {
            const day = keys[i];
            matches += this.checkDayMatch(week.days, searchWeek.days, day);
          }
          if (matches === keys.length) {
            players.push(p);
          }
        } else if (searchWeek.time.from && !searchWeek.time.to) {
          let from: string | number = week.time.from;
          if (from) {
            from = parseFloat(from.replace(':', '.'));
          } else {
            from = 0;
          }
          const searchFrom = parseFloat(searchWeek.time.from.replace(':', '.'));
          const keys = Object.keys(searchWeek.days);
          let matches = 0;
          for (let i = 0; i < keys.length; i++) {
            const day = keys[i];
            matches += this.checkDayMatch(week.days, searchWeek.days, day);
          }
          if (from <= searchFrom && matches === keys.length) {
            players.push(p);
          }
        } else if (!searchWeek.time.from && searchWeek.time.to) {
          let to: number | string = week.time.to;
          if (to) {
            to = parseFloat(to.replace(':', '.'));
          } else {
            to = 23.59;
          }
          const searchTo = parseFloat(searchWeek.time.to.replace(':', '.'));
          const keys = Object.keys(searchWeek.days);
          let matches = 0;
          for (let i = 0; i < keys.length; i++) {
            const day = keys[i];
            matches += this.checkDayMatch(week.days, searchWeek.days, day);
          }
          if (to >= searchTo && matches === keys.length) {
            players.push(p);
          }
        } else if (searchWeek.time.from && searchWeek.time.to) {
          let from: string | number = week.time.from;
          if (from) {
            from = parseFloat(from.replace(':', '.'));
          } else {
            from = 0;
          }
          const searchFrom = parseFloat(searchWeek.time.from.replace(':', '.'));
          let to: number | string = week.time.to;
          if (to) {
            to = parseFloat(to.replace(':', '.'));
          } else {
            to = 23.59;
          }
          const searchTo = parseFloat(searchWeek.time.to.replace(':', '.'));
          const keys = Object.keys(searchWeek.days);
          let matches = 0;
          for (let i = 0; i < keys.length; i++) {
            const day = keys[i];
            matches += this.checkDayMatch(week.days, searchWeek.days, day);
          }
          if (from <= searchFrom && to >= searchTo && matches === keys.length) {
            players.push(p);
          }
        }
      }
    });
    return players;
  }
}
