import { ValidatorsService } from './../../shared/validators.service';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  errors = {
    email: {
      required: 'Do logowania wymagany jest adres email',
      emailValidator: 'Podano niepoprawny adres email'
    },
    password: {
      required: 'Do logowania wymagane jest hasło',
    }
  };

  formGroup: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, ValidatorsService.emailValidator]],
      password: ['', [Validators.required]]
    });
  }

  signInWithFacebook() {
    this.authService.signInWithFacebook().then(x => {
      console.log(x);
    }).catch(e => console.log(e));
  }

  signInWithEmail() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }

    this.authService.signInWithEmail('test@test.pl', 'password123').then(x => {
      console.log(x);
    }).catch(e => console.log(e));
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle().then(x => {
      console.log(x);
    }).catch(e => console.log(e));
  }
}
