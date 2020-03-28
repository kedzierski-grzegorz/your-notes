import { NavController, LoadingController, AlertController } from '@ionic/angular';
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

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private nav: NavController,
    private loading: LoadingController,
    private alert: AlertController
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, ValidatorsService.emailValidator]],
      password: ['', [Validators.required]]
    });
  }

  signInWithEmail() {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      return;
    }
    this.loading.create({ message: 'Logowanie...', spinner: 'dots' }).then(x => {
      x.present();

      this.authService.signInWithEmail(this.formGroup.controls.email.value, this.formGroup.controls.password.value).then(r => {
        this.nav.navigateForward(['/home']);
        x.dismiss();
      }).catch(e => {
        x.dismiss();
        this.showLoginErrorMessage(e);
      });
    });
  }

  signInWithFacebook() {
    this.loading.create({ message: 'Logowanie...', spinner: 'dots' }).then(x => {
      x.present();

      this.authService.signInWithFacebook().then(r => {
        this.nav.navigateForward(['/home']);
        x.dismiss();
      }).catch(e => {
        x.dismiss();
        this.showLoginErrorMessage(e);
      });
    });
  }

  signInWithGoogle() {
    this.loading.create({ message: 'Logowanie...', spinner: 'dots' }).then(x => {
      x.present();

      this.authService.signInWithGoogle().then(r => {
        this.nav.navigateForward(['/home']);
        x.dismiss();
      }).catch(e => {
        x.dismiss();
        this.showLoginErrorMessage(e);
      });
    });
  }

  showLoginErrorMessage(error: any) {
    let messageText = error.message;

    switch (error.code) {
      case 'auth/user-not-found':
        messageText = 'Nie znaleziono użytkownika.';
        break;
      case 'auth/session-cookie-revoked':
        messageText = 'Sesja została zakończona. Zaloguj się ponownie.';
        break;
      case 'auth/session-cookie-expired':
        messageText = 'Sesja została zakończona. Zaloguj się ponownie.';
        break;
      case 'auth/invalid-password':
        messageText = 'Podano niepoprawne hasło.';
        break;
      case 'auth/wrong-password':
        messageText = 'Podano niepoprawne hasło.';
        break;
      case 'auth/invalid-credential':
        messageText = 'Weryfikacja nie powiodła się.';
        break;
      case 'auth/too-many-requests':
        messageText = 'Zbyt wiele nieudanych prób logowania. Prosimy spróbować później.';
        break;
    }

    this.alert.create({
      header: 'Niepowodzenie',
      message: messageText,
      buttons: ['Ok']
    }).then(x => {
      x.present().then(r => {
        const btnOk = document.querySelector('.alert-button.ion-focusable.ion-activatable') as any;

        if (btnOk) {
          btnOk.focus();
        }
      });
    });
  }
}
