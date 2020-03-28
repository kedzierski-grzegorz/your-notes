import { Subscription } from 'rxjs';
import { AppUser } from './../auth/app-user.model';
import { AuthService } from './../auth/auth.service';
import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  user: AppUser;
  userSub: Subscription;

  constructor(private authService: AuthService) {
    this.userSub = authService.getCurrentUser.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    this.authService.signOut().then(r => {
      window.location.reload();
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
