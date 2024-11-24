import { Injectable } from '@angular/core';
import { PlayerDTO } from '../../players/player.dto';

interface Click {}

@Injectable({
  providedIn: 'root',
})
export class HandleSelectService {
  constructor() {}

  isOneOpen: boolean = false;
  isTwoOpen: boolean = false;

  indexOne: undefined | number;
  indexTwo: undefined | number;

  toggleClick(event: any) {
    const listOne = event.target.closest('#listOne');
    const listOneSvg = event.target.id === 'listOneSvg' ? true : false;
    const listTwo = event.target.closest('#listTwo');
    const listTwoSvg = event.target.id === 'listTwoSvg' ? true : false;
    if (!(listOne || listOneSvg)) {
      this.isOneOpen = false;
    }
    if (!(listTwo || listTwoSvg)) {
      this.isTwoOpen = false;
    }
  }

  mouseEnter(event: any | { target: HTMLElement }) {
    this.indexOne = undefined;
    this.indexTwo = undefined;
    event.target.classList.add('list_element--active');
  }

  mouseLeave(event: any | { target: HTMLElement }) {
    event.target.classList.remove('list_element--active');
  }

  focusIn(select: 'one' | 'two') {
    select === 'one' ? (this.isOneOpen = true) : null;
    select === 'two' ? (this.isTwoOpen = true) : null;
  }

  keyDown(event: KeyboardEvent, select: 'one' | 'two', length: number) {
    if (event.key != 'Enter') {
      select === 'one' ? (this.isOneOpen = true) : null;
      select === 'two' ? (this.isTwoOpen = true) : null;
    }
    if (event.key == 'Tab') {
      select == 'one' ? (this.isOneOpen = false) : null;
      select == 'two' ? (this.isTwoOpen = false) : null;
    }
    if (event.key == 'ArrowDown') {
      return this.moveDown(select, length);
    }
    if (event.key == 'ArrowUp') {
      return this.moveUp(select, length);
    }
  }

  moveDown(event: 'one' | 'two', length: number) {
    if (event === 'one') {
      if (this.indexOne === undefined) {
        this.indexOne = 0;
      } else {
        this.indexOne >= length ? null : (this.indexOne += 1);
      }
    }
    if (event === 'two') {
      if (this.indexTwo === undefined) {
        this.indexTwo = 0;
      } else {
        this.indexTwo >= length ? null : (this.indexTwo += 1);
      }
    }
  }

  moveUp(event: 'one' | 'two', length: number) {
    if (event === 'one') {
      if (this.indexOne) {
        this.indexOne === 0
          ? (this.indexOne = undefined)
          : (this.indexOne -= 1);
      }
    }
    if (event === 'two') {
      if (this.indexTwo) {
        this.indexTwo === 0
          ? (this.indexTwo = undefined)
          : (this.indexTwo -= 1);
      }
    }
  }

  keyEnter(
    index: 'listOne' | 'listTwo',
    players: PlayerDTO[]
  ): PlayerDTO | undefined {
    let elIndex: number | undefined;
    if (index === 'listOne') {
      elIndex = this.indexOne;
    }
    if (index === 'listTwo') {
      elIndex = this.indexTwo;
    }
    const player = players.find((pl, index) => index + 1 === elIndex);
    this.indexOne = undefined;
    this.indexTwo = undefined;
    this.isOneOpen = false;
    this.isTwoOpen = false;
    return player;
  }
}
