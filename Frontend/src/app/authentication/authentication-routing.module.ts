import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoginGuard } from '../core/guards/login-guard.guard';
import { OtpComponent } from './otp/otp.component';

const routes: Routes = [{ path: '', redirectTo: 'login', pathMatch: 'full'  },

{path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
{path: 'signup', component: SignupComponent},
{path: 'otp', component: OtpComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
