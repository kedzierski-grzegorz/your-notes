import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  test() {
    this.authService.signInWithFacebook().then(x => console.log(x)).catch(e => alert(e.message));
  }
}
