import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  test() {
    this.authService.signInWithFacebook().then(x => {
      console.log(x);
      this.email = x.firebaseUser.email;
    }).catch(e => console.log(e));
  }

  test2() {
    this.authService.signInWithEmail('test@test.pl', 'password123').then(x => {
      console.log(x);
      this.email = x.firebaseUser.email;

    }).catch(e => console.log(e));
  }

  test3() {
    this.authService.signInWithGoogle().then(x => {
      console.log(x);
      this.email = x.firebaseUser.email;

    }).catch(e => this.email = e.message);
  }
}
