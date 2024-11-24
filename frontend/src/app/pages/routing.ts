import { CoachesComponent } from "./coaches/coaches.component";
import { IsLoginGuard } from "./is-login.guard";
import { LoginComponent } from "./login/login.component";
import { PlayersComponent } from "./players/players.component";

export const Routing = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'users', component: CoachesComponent, canActivate: [IsLoginGuard] },
    { path: 'players', component: PlayersComponent, canActivate: [IsLoginGuard] },
];