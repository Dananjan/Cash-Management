import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './authentication/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AuthGuard } from './authentication/auth.guard';
import { IncomeComponent } from './income/income.component';
import { ExpensesComponent} from './expense/expenses.component'
import { LoginGuard } from './authentication/login.guard';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { ProfileUpdateComponent } from  './profile-update/profile-update.component';
import { PasswordResetComponent} from './password-reset/password-reset.component';

const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent , canActivate:[LoginGuard]},
  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard] },
  { path: 'verify-email-address', component: VerifyEmailComponent , canActivate:[LoginGuard]},
  { path:'income', component:IncomeComponent , canActivate:[AuthGuard] },
  { path: 'expenses', component:ExpensesComponent , canActivate:[AuthGuard]},
  { path:'side-menu', component: SideMenuComponent , canActivate:[AuthGuard]},
  { path:'profile-update', component: ProfileUpdateComponent , canActivate:[AuthGuard]},
  {path:'password-reset', component: PasswordResetComponent , canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
