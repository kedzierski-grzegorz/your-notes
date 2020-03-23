import { AuthService } from './../auth.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let btnSignInEmail: DebugElement;
  let linkSignUp: DebugElement;
  let btnSingInFacebook: DebugElement;
  let btnSingInGoogle: DebugElement;
  let authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['signInWithEmail']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    btnSignInEmail = fixture.debugElement.query(By.css('#btn-sign-in-email'));
    btnSingInFacebook = fixture.debugElement.query(By.css('#btn-sign-in-facebook'));
    btnSingInGoogle = fixture.debugElement.query(By.css('#btn-sign-in-google'));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(btnSignInEmail).toBeTruthy();
    expect(btnSingInFacebook).toBeTruthy();
    expect(btnSingInGoogle).toBeTruthy();
  });
});