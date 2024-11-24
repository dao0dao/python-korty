import { Injectable } from '@angular/core';
import { PlayerDTO } from '../players/player.dto';
import { FilterPlayersService } from '../timetable/timetable-modal/filter-players.service';

@Injectable({
  providedIn: 'root',
})
export class SelectHandlerService {
  constructor(private filterPlayers: FilterPlayersService) {}

  isOpen: boolean = false;
  activeIndex: number | undefined = undefined;
  filteredPlayers: PlayerDTO[] = [];

  toggleList(e: any) {
    if (e.target.id === 'player') {
      this.isOpen = true;
    } else {
      this.isOpen = false;
      this.activeIndex = undefined;
    }
  }

  keyDown(event: KeyboardEvent, arrLength: number) {
    this.isOpen = true;
    if (event.key == 'ArrowDown') {
      return this.moveDown(arrLength);
    }
    if (event.key == 'ArrowUp') {
      return this.moveUp(arrLength);
    }
  }

  private moveDown(length: number) {
    if (this.activeIndex === undefined) {
      this.activeIndex = 0;
    } else {
      this.activeIndex < length ? this.activeIndex++ : null;
    }
  }

  private moveUp(length: number) {
    if (this.activeIndex === undefined) {
      this.activeIndex = length;
    } else {
      this.activeIndex > 0 ? this.activeIndex-- : null;
    }
  }

  findPlayer(input: string, players: PlayerDTO[]) {
    this.filteredPlayers = [...this.filterPlayers.reduceList(input, players)];
  }

  selectPlayer(): PlayerDTO | undefined {
    let ind: number | undefined;
    ind = this.activeIndex === undefined ? undefined : this.activeIndex - 1;
    const player = this.filteredPlayers.find((pl, index) => index === ind);
    this.isOpen = false;
    this.activeIndex = undefined;
    return player;
  }
}
