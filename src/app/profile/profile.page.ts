import { ValidatorsService } from './../shared/validators.service';
import { Subscription } from 'rxjs';
import { AppUser } from './../models/app-user.model';
import { AuthService } from './../auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  user: AppUser;
  userSub: Subscription;

  selectedTab: 'nick' | 'school' = 'nick';
  schoolTabDisabled = true;

  @ViewChild('schoolTabButton') schoolTabButton;

  errors = {
    nick: {
      required: 'Twoja nazwa użytkownika jest wymagana.',
      nickValidator: 'Nazwa użytkownika może zawierać tylko litery, cyfry lub znaki ! $ ( ) _',
      maxlength: 'Nazwa użytkownika nie może być dłuższa niż 30 znaków.'
    }
  };

  formGroupInfo: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.userSub = authService.getCurrentUser.subscribe(u => {
      if (u) {
        this.user = u;
        this.formGroupInfo.controls.nick.setValue(u.firebaseUser.displayName);
      }
    });
  }

  ngOnInit() {
    this.formGroupInfo = this.formBuilder.group({
      nick: ['', [Validators.required, ValidatorsService.nickValidator, Validators.maxLength(30)]]
    });
  }

  next() {
    this.formGroupInfo.markAllAsTouched();

    if (this.formGroupInfo.invalid) {
      return;
    }

    this.schoolTabDisabled = false;
    this.schoolTabButton.el.click();
  }

  save() {
    console.log('save');
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
