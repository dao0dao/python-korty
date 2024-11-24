import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService as PlayerService } from '../players/api.service';
import { PlayerDTO } from '../players/player.dto';
import { ServicePayment, Service } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private playerService: PlayerService) {}

  getAllPlayers() {
    return this.playerService.getAllPlayers();
  }

  getAllServices() {
    return this.http.get<{ services: Service[] }>(
      environment.apiLink + 'services'
    );
  }

  submitList(list: Service[]) {
    return this.http.patch<{ status: 201; message: 'created/updated' }>(
      environment.apiLink + 'services',
      { services: list }
    );
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete(environment.apiLink + 'services/' + id);
  }

  accountChargeOrPayment(
    data: ServicePayment
  ) {
    return this.http.post<{ status: 201; message: 'updated' }>(
      environment.apiLink + 'services/account',
      data
    );
  }
}
