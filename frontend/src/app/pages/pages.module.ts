import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PagesComponent } from './pages.component';
import { CoachesComponent } from './coaches/coaches.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ListComponent } from './coaches/list/list.component';
import { AddComponent } from './coaches/add/add.component';
import { PlayersComponent } from './players/players.component';
import { AddPlayerComponent } from './players/add-player/add-player.component';
import { WeekComponent } from './players/week/week.component';
import { OpponentComponent } from './players/opponent/opponent.component';
import { PlayersListComponent } from './players/players-list/players-list.component';
import { SearchingService } from './players/searching.service';
import { SearchWeekComponent } from './players/search-week/search-week.component';
import { TimetableComponent } from './timetable/timetable.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TimetableModalComponent } from './timetable/timetable-modal/timetable-modal.component';
import { DeleteModalComponent } from './timetable/delete-modal/delete-modal.component';
import { PriceListComponent } from './price-list/price-list.component';
import { PriceListModalComponent } from './price-list/price-list-modal/price-list-modal.component';
import { PriceDeleteModalComponent } from './price-list/price-delete-modal/price-delete-modal.component';
import { PaymentsComponent } from './payments/payments.component';
import { ServiceListComponent } from './payments/service-list/service-list.component';
import { AccountBalanceComponent } from './account-balance/account-balance.component';
import { PayModalComponent } from './account-balance/pay-modal/pay-modal.component';
import { DeleteHistoryModalComponent } from './account-balance/delete-modal/delete-modal.component';
import { DebtorsComponent } from './debtors/debtors.component';

import routes from './routes';
import { PaymentModalComponent } from './timetable/payment-modal/payment-modal.component';
import { EditionModalComponent } from './players/players-list/modals/edition-modal/edition-modal.component';
import { DeletePlayerModalComponent } from './players/players-list/modals/delete-player-modal/delete-player-modal.component';

@NgModule({
  declarations: [
    PagesComponent,
    CoachesComponent,
    LoginComponent,
    ListComponent,
    AddComponent,
    PlayersComponent,
    AddPlayerComponent,
    WeekComponent,
    OpponentComponent,
    PlayersListComponent,
    SearchWeekComponent,
    TimetableComponent,
    TimetableModalComponent,
    DeleteModalComponent,
    PriceListComponent,
    PriceListModalComponent,
    PriceDeleteModalComponent,
    PaymentsComponent,
    ServiceListComponent,
    AccountBalanceComponent,
    PayModalComponent,
    DeleteHistoryModalComponent,
    DebtorsComponent,
    PaymentModalComponent,
    EditionModalComponent,
    DeletePlayerModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    DragDropModule,
    MatDatepickerModule,
  ],
  exports: [PagesComponent],
  providers: [SearchingService, DatePipe],
})
export class PagesModule {}
