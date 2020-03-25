import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './../auth.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { LoginPage } from './login.page';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

fdescribe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let btnSignInEmail: DebugElement;
  let linkSignUp: DebugElement;
  let inputEmail: DebugElement;
  let inputPassword: DebugElement;
  let btnSingInFacebook: DebugElement;
  let btnSingInGoogle: DebugElement;
  let authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['signInWithEmail']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ],
      imports: [IonicModule.forRoot(), RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    btnSignInEmail = fixture.debugElement.query(By.css('#btn-sign-in-email'));
    btnSingInFacebook = fixture.debugElement.query(By.css('#btn-sign-in-facebook'));
    btnSingInGoogle = fixture.debugElement.query(By.css('#btn-sign-in-google'));
    inputEmail = fixture.debugElement.query(By.css('#input-email'));
    inputPassword = fixture.debugElement.query(By.css('#input-password'));
    linkSignUp = fixture.debugElement.query(By.css('[ng-reflect-router-link]'));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(btnSignInEmail).toBeTruthy();
    expect(btnSingInFacebook).toBeTruthy();
    expect(btnSingInGoogle).toBeTruthy();
    expect(inputEmail).toBeTruthy();
    expect(inputPassword).toBeTruthy();
    expect(linkSignUp).toBeTruthy();
  });
});