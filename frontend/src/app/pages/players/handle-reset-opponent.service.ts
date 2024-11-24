import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HandleResetOpponentService {
  private reset: Subject<boolean> = new Subject();
  public $reset = this.reset.asObservable();
  public resetOpponents() {
    this.reset.next(true);
  }
}
