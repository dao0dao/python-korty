import { Routes } from "@angular/router";
import { AccountBalanceComponent } from "./account-balance/account-balance.component";
import { CoachesComponent } from "./coaches/coaches.component";
import { IsLoginGuard } from "./is-login.guard";
import { LoginComponent } from "./login/login.component";
import { PaymentsComponent } from "./payments/payments.component";
import { PlayersComponent } from "./players/players.component";
import { PriceListComponent } from "./price-list/price-list.component";
import { TimetableComponent } from "./timetable/timetable.component";
import { DebtorsComponent } from "./debtors/debtors.component";

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'users', component: CoachesComponent, canActivate: [IsLoginGuard] },
    { path: 'players', component: PlayersComponent, canActivate: [IsLoginGuard] },
    { path: 'player/history', component: AccountBalanceComponent, canActivate: [IsLoginGuard] },
    { path: 'timetable', component: TimetableComponent, canActivate: [IsLoginGuard] },
    { path: 'price/list', component: PriceListComponent, canActivate: [IsLoginGuard] },
    { path: 'price/services', component: PaymentsComponent, canActivate: [IsLoginGuard] },
    { path: 'price/debtors', component: DebtorsComponent, canActivate: [IsLoginGuard] }
];

export default routes;