import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayerDTO } from '../../../player.dto';

@Component({
  selector: 'app-delete-player-modal',
  templateUrl: './delete-player-modal.component.html',
  styleUrls: ['./delete-player-modal.component.scss'],
})
export class DeletePlayerModalComponent implements OnInit {
  @Input() deletePlayerId: string = '';
  @Input() players: PlayerDTO[] = [];
  @Output() DeletePlayer: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  isSubmitting: boolean = false;
  name: string | undefined = '';
  surname: string | undefined = '';

  handleDelete(isDelete: boolean) {
    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.DeletePlayer.emit(isDelete);
  }

  ngOnInit(): void {
    const pl = this.players.find((p) => p.id == this.deletePlayerId);
    this.name = pl?.name;
    this.surname = pl?.surname;
  }
}
