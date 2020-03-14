import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard]
    });

    navigateSpy = spyOn(TestBed.get(Router), 'navigateByUrl').and.stub();
  });

  it('when user is authenticated should let enter', inject([AuthGuard], (guard: AuthGuard) => {
    expect(guard).toBeTruthy();
    expect(navigateSpy).toHaveBeenCalledTimes(0);
  }));

  it('when user is not authenticated should navigate to login page', inject([AuthGuard], (guard: AuthGuard) => {
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  }));
});
