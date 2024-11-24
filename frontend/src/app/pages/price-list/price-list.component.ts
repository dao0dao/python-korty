import { Component, OnInit } from '@angular/core';
import { InfoService } from 'src/app/info.service';
import { environment } from 'src/environments/environment';
import { LoginStateService } from '../login-state.service';
import { ApiService } from './api.service';
import { ApiError, ModalAction, PriceListDTO } from './interfaces';

@Component({
  selector: 'app-price-list',
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.scss'],
})
export class PriceListComponent implements OnInit {
  environment = environment;

  isSortAscending: boolean = true;

  searchingContent: string = '';

  priceList: PriceListDTO[] = [];
  sortedPriceList: PriceListDTO[] = [];

  page: number = 1;
  itemsPerPage: number = 10;
  pageCount: number = 1;

  isEditModal: boolean = false;
  editedPriceList: PriceListDTO | undefined;
  modalAction: ModalAction | undefined;

  isDeleteModal: boolean = false;
  deletedPriceList: PriceListDTO | undefined;

  constructor(
    public stateService: LoginStateService,
    private api: ApiService,
    private infoService: InfoService
  ) {}

  ngOnInit(): void {
    if (this.page > this.pageCount) {
      this.page = this.pageCount;
    }
    if (this.page < 1) {
      this.page = 1;
    }
    this.getAllPriceList();
  }

  getAllPriceList() {
    this.api.getPriceList().subscribe((res) => {
      this.priceList = res.priceList;
      this.sortedPriceList = this.priceList;
      this.setPageCount();
      this.changeSortDirection();
    });
  }

  openEditModal(action: ModalAction, editedId?: string) {
    this.editedPriceList = this.priceList.find((el) => el.id === editedId);
    this.isEditModal = true;
    this.modalAction = action;
  }

  closeEditModal(event: boolean) {
    if (event) {
      this.isEditModal = false;
      this.editedPriceList = undefined;
    }
  }

  createList(event: PriceListDTO) {
    if (this.modalAction === 'new') {
      this.api.cretePriceList(event).subscribe({
        next: (res) => {
          if (res.status === 'created') {
            event.id = res.id;
            this.priceList.push(event);
            this.searchForName();
            this.isEditModal = false;
            return;
          }
        },
        error: (err: ApiError) => {
          if (err.status === 400 && err.error.alreadyExist) {
            this.infoService.showInfo('Taki cennik już istnieje');
            return;
          }
          this.isEditModal = false;
          return;
        },
      });
    }
    if (this.modalAction === 'edit') {
      this.api.editPriceList(event).subscribe({
        next: (res) => {
          if (res.status === 'updated') {
            this.priceList.forEach((pl) => {
              if (pl.id === event.id) {
                pl.name = event.name;
                pl.hours = event.hours;
              }
            });
            this.searchForName();
            this.isEditModal = false;
            return;
          }
        },
        error: (err: ApiError) => {
          if (err.status === 400 && err.error.alreadyExist) {
            this.infoService.showInfo('Taki cennik już istnieje');
            return;
          }
          this.isEditModal = false;
          return;
        },
      });
    }
  }

  openDeleteModal(priceList: PriceListDTO) {
    this.deletedPriceList = priceList;
    this.isDeleteModal = true;
  }

  hideDeleteModal() {
    this.isDeleteModal = false;
    this.deletedPriceList = undefined;
  }

  closeDeleteModal(isConfirm: boolean) {
    if (isConfirm) {
      this.api.deletePriceList(this.deletedPriceList?.id!).subscribe({
        next: (res) => {
          this.priceList = this.priceList.filter(
            (p) => p.id !== this.deletedPriceList?.id
          );
          this.searchForName();
          this.hideDeleteModal();
        },
        error: () => {
          this.hideDeleteModal();
        },
      });
    } else {
      this.hideDeleteModal();
    }
  }

  changeSortDirection(click?: boolean) {
    if (click) {
      this.isSortAscending = !this.isSortAscending;
    }
    if (this.isSortAscending) {
      this.sortedPriceList.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.sortedPriceList.sort((a, b) => b.name.localeCompare(a.name));
    }
  }

  searchForName() {
    if (!this.searchingContent) {
      this.sortedPriceList = this.priceList;
      return;
    }
    const newList = [...this.priceList];
    this.sortedPriceList = newList.filter((el) =>
      el.name.toLowerCase().includes(this.searchingContent.toLowerCase())
    );
    this.changeSortDirection();
  }

  setPageCount() {
    this.pageCount = Math.ceil(this.sortedPriceList.length / this.itemsPerPage);
    if (this.page > this.pageCount) {
      this.page = this.pageCount;
    }
    if (this.page < 1) {
      this.page = 1;
    }
  }

  nextPage() {
    if (this.page < this.pageCount) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }
}
