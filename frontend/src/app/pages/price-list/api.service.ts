import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PriceListDTO } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getPriceList() {
    return this.http.get<{ priceList: PriceListDTO[] }>(
      environment.apiLink + 'price-list'
    );
  }

  cretePriceList(priceList: PriceListDTO) {
    return this.http.post<{ status: string; id: string }>(
      environment.apiLink + 'price-list',
      priceList
    );
  }

  editPriceList(priceList: PriceListDTO) {
    return this.http.put<{ status: string }>(
      environment.apiLink + 'price-list/update/' + priceList.id,
      priceList
    );
  }

  deletePriceList(id: string) {
    return this.http.delete(environment.apiLink + 'price-list/delete/' + id);
  }
}
