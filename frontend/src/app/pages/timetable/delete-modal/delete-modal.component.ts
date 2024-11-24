import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DeleteConfirm, Reservation } from '../interfaces';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss'],
})
export class DeleteModalComponent implements OnInit {
  @Input('reservation') res: Reservation | undefined;
  @Output() outputIsConfirm: EventEmitter<DeleteConfirm> =
    new EventEmitter<DeleteConfirm>();

  constructor() {}

  ngOnInit(): void {}

  confirm() {
    this.outputIsConfirm.emit({ isConfirm: true, id: this.res?.id! });
  }

  cancel() {
    this.outputIsConfirm.emit({ isConfirm: false });
  }
}
