import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerDTO } from '../../players/player.dto';
import { HistoryInputDTO } from '../interfaces';

@Component({
  selector: 'app-history-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteHistoryModalComponent {
  @Input() payment: HistoryInputDTO | undefined;
  @Input() player: PlayerDTO | undefined;
  @Output() Delete: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  closeModal() {
    this.Delete.emit(false);
  }

  deletePayment() {
    this.Delete.emit(true);
  }
}
