import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService as PlayerService } from '../players/api.service';
import { PlayerDTO } from '../players/player.dto';
import {
  Balance,
  BalancePayment,
  OutputPayment,
  Payment,
  PlayerHistoryInputDTO,
  Timestamp,
} from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private playerService: PlayerService) {}

  getAllPlayers() {
    return this.playerService.getAllPlayers();
  }

  getPlayerBalance(playerId: string): Observable<{ balance: number }> {
    return this.http.get<{ balance: number }>(
      environment.apiLink + 'price/balance/account',
      { params: { playerId } }
    );
  }

  getPlayerHistory(playerId: string, timestamp: Timestamp) {
    const { dateFrom, dateTo } = timestamp;
    return this.http.get<PlayerHistoryInputDTO>(
      environment.apiLink + 'player/history',
      {
        params: { playerId, dateFrom, dateTo },
      }
    );
  }

  payForService(data: OutputPayment): Observable<{ updated: true }> {
    return this.http.post<{ updated: true }>(
      environment.apiLink + 'player/history/pay',
      data
    );
  }

  deleteHistory(id: number) {
    return this.http.delete(
      environment.apiLink + 'player/history/remove/' + id
    );
  }
}
