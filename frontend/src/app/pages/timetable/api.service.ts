import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PlayerDTO } from '../players/player.dto';
import {
  CreateReservationDTO,
  Reservation,
  OutputReservationDTO,
  ReservationPayment,
  ReservationInputDTO,
  ReservationPriceDTO,
} from './interfaces';
import { ApiService as PriceListApi } from '../../pages/price-list/api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private priceListApi: PriceListApi) {}

  getAllPlayers() {
    return this.http.get<{ players: PlayerDTO[] }>(
      environment.apiLink + 'players'
    );
  }

  getAllReservations(date: string) {
    return this.http.get<{ reservations: ReservationInputDTO[] }>(
      environment.apiLink + 'timetable',
      { params: { date } }
    );
  }

  addReservation(reservation: OutputReservationDTO) {
    return this.http.post<CreateReservationDTO>(
      environment.apiLink + 'timetable/reservation/add',
      reservation
    );
  }

  updateReservation(reservation: OutputReservationDTO) {
    return this.http.put<{ reservation: ReservationInputDTO }>(
      environment.apiLink + 'timetable/reservation/update',
      reservation
    );
  }

  deleteReservation(id: number): Observable<any> {
    return this.http.delete(
      environment.apiLink + 'timetable/reservation/delete/' + id
    );
  }

  getReservationPriceById(id: number) {
    return this.http.get<ReservationPriceDTO>(
      environment.apiLink + 'timetable/reservation/price/' + id
    );
  }

  payForReservation(
    data: ReservationPayment
  ): Observable<{ updated: boolean }> {
    return this.http.post<{ updated: boolean }>(
      environment.apiLink + 'timetable/reservation/pay',
      data
    );
  }
}
