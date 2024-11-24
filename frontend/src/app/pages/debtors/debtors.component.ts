import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

interface Debtor {
  name: string;
  surname: string;
  telephone: number | string;
  email: string;
  wallet: string | number;
}

@Component({
  selector: 'app-debtors',
  templateUrl: './debtors.component.html',
  styleUrls: ['./debtors.component.scss']
})
export class DebtorsComponent implements OnInit {

  environment = environment;

  constructor(private http: HttpClient) { }

  isLoading: boolean = false;
  noData: boolean = false;
  debtors: Debtor[] = [];

  isPopUp: boolean = false;
  debtor: Debtor | undefined;

  ngOnInit(): void {
  }

  openPopUp(debtor: Debtor) {
    this.debtor = debtor;
    this.isPopUp = true;
  }

  closePopUp() {
    this.isPopUp = false;
    this.debtor = undefined;
  }

  getDebtors() {
    this.isLoading = true;
    this.noData = false;
    this.debtors = [];
    this.http.get<Debtor[]>(environment.apiLink + 'debtor').subscribe({
      next: (res) => {
        this.isLoading = false;
        if (!res.length) { this.noData = true; }
        this.debtors = res;
      },
      error: (err) => {
        this.isLoading = false;
        this.noData = true;
      },
    });
  }

}
