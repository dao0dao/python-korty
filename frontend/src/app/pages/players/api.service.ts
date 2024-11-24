import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PriceListDTO } from '../price-list/interfaces';
import { PlayerDTO, PlayerUpdateDTO } from './player.dto';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  addPlayer(player: PlayerDTO) {
    return this.http.post<{ id: string }>(
      environment.apiLink + 'players/add',
      player
    );
  }

  getAllPlayers() {
    return this.http.get<{ players: PlayerDTO[] }>(
      environment.apiLink + 'players'
    );
  }

  updatePlayer(player: PlayerUpdateDTO) {
    return this.http.post<{ updated: boolean }>(
      environment.apiLink + 'players/update/' + player.id,
      player
    );
  }

  deletePlayer(playerId: string): Observable<any> {
    return this.http.delete<any>(
      environment.apiLink + 'players/delete/' + playerId
    );
  }

  getPriceList() {
    return this.http.get<{ priceList: PriceListDTO[] }>(
      environment.apiLink + 'price-list'
    );
  }
}
