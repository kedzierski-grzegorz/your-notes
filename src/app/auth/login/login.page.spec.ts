import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
      imports: [IonicModule.forRoot(), RouterTestingModule, FormsModule, ReactiveFormsModule]
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

    authServiceSpy.signInWithEmail.and.returnValue(Promise.resolve() as any);
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

  describe('form validation', () => {
    it('when fields are empty and clicked sign in button should show two errors', () => {
      btnSignInEmail.nativeElement.click();
      fixture.detectChanges();

      expect(component.formGroup.touched).toBeTruthy();
      expect(component.formGroup.invalid).toBeTruthy();
    });

    it('when fields are filled should has valid form', () => {
      component.formGroup.controls.email.setValue('test@test.pl');
      component.formGroup.controls.password.setValue('testpl');

      btnSignInEmail.nativeElement.click();
      fixture.detectChanges();

      expect(component.formGroup.touched).toBeTruthy();
      expect(component.formGroup.valid).toBeTruthy();
    });

    describe('email field', () => {
      it('when email is empty should has invalid email', () => {
        component.formGroup.controls.email.setValue('');

        btnSignInEmail.nativeElement.click();
        fixture.detectChanges();

        expect(component.formGroup.controls.email.invalid).toBeTruthy();
      });

      it('when email is test should has invalid email', () => {
        component.formGroup.controls.email.setValue('test');

        btnSignInEmail.nativeElement.click();
        fixture.detectChanges();

        expect(component.formGroup.controls.email.invalid).toBeTruthy();
      });

      it('when email is test@ should has invalid email', () => {
        component.formGroup.controls.email.setValue('test@');

        btnSignInEmail.nativeElement.click();
        fixture.detectChanges();

        expect(component.formGroup.controls.email.invalid).toBeTruthy();
      });

      it('when email is test@23.pl should has valid email', () => {
        component.formGroup.controls.email.setValue('test@23.pl');

        btnSignInEmail.nativeElement.click();
        fixture.detectChanges();

        expect(component.formGroup.controls.email.valid).toBeTruthy();
      });

      it('when email is test@2@3.pl should has valid email', () => {
        component.formGroup.controls.email.setValue('test@2@3.pl');

        btnSignInEmail.nativeElement.click();
        fixture.detectChanges();

        expect(component.formGroup.controls.email.valid).toBeTruthy();
      });

      it('when email is test@s should has invalid email', () => {
        component.formGroup.controls.email.setValue('test@s');

        btnSignInEmail.nativeElement.click();
        fixture.detectChanges();

        expect(component.formGroup.controls.email.invalid).toBeTruthy();
      });
    });
  });
});