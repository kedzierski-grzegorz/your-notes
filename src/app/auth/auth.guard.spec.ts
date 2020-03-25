import { AuthService } from './auth.service';
import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';

describe('AuthGuard', () => {
  let navigateSpy: jasmine.Spy;
  let authServiceSpy;
  let guard: AuthGuard;

  beforeEach(() => {
    authServiceSpy = {
      authState$: of({})
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    navigateSpy = spyOn(TestBed.get(Router), 'navigate').and.stub();
  });

  it('when user is authenticated and enter to login or sing-up page should redirect to home', () => {
    Object.defineProperty(authServiceSpy, 'authState$', {
      value: of({})
    });

    guard = new AuthGuard(TestBed.get(Router), authServiceSpy);

    ((guard.canActivateChild(null, { url: '/login' } as any)) as Observable<boolean>).subscribe(r => {
      expect(r).toEqual(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    });

    guard = new AuthGuard(TestBed.get(Router), authServiceSpy);

    ((guard.canActivateChild(null, { url: '/sign-up' } as any)) as Observable<boolean>).subscribe(r => {
      expect(r).toEqual(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    });
  });

  it('when user is authenticated and enter to home page should let enter', () => {
    Object.defineProperty(authServiceSpy, 'authState$', {
      value: of({})
    });

    guard = new AuthGuard(TestBed.get(Router), authServiceSpy);

    ((guard.canActivateChild(null, { url: '/home' } as any)) as Observable<boolean>).subscribe(r => {
      expect(r).toEqual(true);
      expect(navigateSpy).toHaveBeenCalledTimes(0);
    });

    guard = new AuthGuard(TestBed.get(Router), authServiceSpy);

    ((guard.canActivateChild(null, { url: '/test' } as any)) as Observable<boolean>).subscribe(r => {
      expect(r).toEqual(true);
      expect(navigateSpy).toHaveBeenCalledTimes(0);
    });
  });

  it('when user is not authenticated and enter to home page should redirect to login', () => {
    Object.defineProperty(authServiceSpy, 'authState$', {
      value: of(null)
    });

    guard = new AuthGuard(TestBed.get(Router), authServiceSpy);

    ((guard.canActivateChild(null, { url: '/home' } as any)) as Observable<boolean>).subscribe(r => {
      expect(r).toEqual(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });
  });
});
