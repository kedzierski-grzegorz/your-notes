import { take, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {
  constructor(private router: Router, private authService: AuthService) { }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.authState$.pipe(take(1), map(user => {
      if (user !== null && (state.url === '/login' || state.url === '/sign-up')) {
        this.router.navigate(['/home']);
        return false;
      }

      if (user !== null) {
        if (!user?.displayName) {
          // alert('test');
        }
        return true;
      }

      if (state.url === '/login' || state.url === '/sign-up') {
        return true;
      }

      this.router.navigate(['/login']);
      return false;
    }));
  }

}
