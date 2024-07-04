import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard {
  constructor(
    private _token: AuthService,
    private _locationService: Location,
    private router : Router
  ) {} 

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const accessToken = this._token.getToken();
    if (accessToken) {
      this.router.navigate(['/pages/home']);
      return false;
    } else {
      return true;
    }
  }
}
