import { User } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { TestBed, fakeAsync } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { of } from 'rxjs';

fdescribe('AuthService', () => {
  let fireAuthSpyObj: jasmine.SpyObj<AngularFireAuth>;

  let service: AuthService;
  const testEmail = 'test@test.pl';
  const testPassword = 'password123';

  beforeEach(() => {
    fireAuthSpyObj = {
      ...jasmine.createSpyObj('AngularFireAuth', [
        'signInWithEmailAndPassword',
        'signOut',
        'signInWithPopup',
        'setPersistence',
        'createUserWithEmailAndPassword'
      ]),
      authState: of(null)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: fireAuthSpyObj },
        { provide: AngularFirestore, useValue: { collection: () => { } } }
      ]
    });

    service = TestBed.get(AuthService);
    fireAuthSpyObj.signOut.and.returnValue(Promise.resolve(null));
    fireAuthSpyObj.setPersistence.and.returnValue(Promise.resolve());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('when user is logged in should has currentUser', (done) => {
    spyOnProperty(service, 'getCurrentUser').and.returnValue(of({}));

    service.getCurrentUser.subscribe(u => {
      expect(u).toBeTruthy();
      done();
    });
  });

  it('when user is not logged in should has no currentUser', () => {
    service.getCurrentUser.subscribe(u => {
      expect(u).toBeFalsy();
    });
  });

  describe('signInWithEmail', () => {
    beforeEach(() => {
      fireAuthSpyObj.signOut.and.returnValue(Promise.resolve());
      spyOn(service, 'refreshUserData').and.returnValue(Promise.resolve(null));
    });

    it('when credentials are correct should has currentUser', fakeAsync(() => {
      fireAuthSpyObj.signInWithEmailAndPassword.and.returnValue(
        Promise.resolve({ user: {}, additionalUserInfo: {} } as firebase.auth.UserCredential)
      );

      expectAsync(service.signInWithEmail(testEmail, testPassword)).toBeResolved();
    }));

    it('when credentials are not correct should has no currentUser', fakeAsync(() => {
      fireAuthSpyObj.signInWithEmailAndPassword.and.returnValue(
        Promise.reject(new Error('Cannot sign in'))
      );

      expectAsync(service.signInWithEmail(testEmail, testPassword)).toBeRejectedWith(new Error('Cannot sign in'));
    }));
  });

  describe('signUpWithEmail', () => {
    beforeEach(() => {
      fireAuthSpyObj.signOut.and.returnValue(Promise.resolve());
      spyOn(service, 'refreshUserData').and.returnValue(Promise.resolve(null));
    });

    it('when credentials are correct should has currentUser', fakeAsync(() => {
      fireAuthSpyObj.createUserWithEmailAndPassword.and.returnValue(
        Promise.resolve({ user: {}, additionalUserInfo: {} } as firebase.auth.UserCredential)
      );

      expectAsync(service.signUpWithEmail(testEmail, testPassword)).toBeResolved();
    }));

    it('when credentials are not correct should has no currentUser', fakeAsync(() => {
      fireAuthSpyObj.createUserWithEmailAndPassword.and.returnValue(
        Promise.reject(new Error('Cannot sign up'))
      );

      expectAsync(service.signUpWithEmail(testEmail, testPassword)).toBeRejectedWith(new Error('Cannot sign up'));
    }));
  });

  describe('signInWithFacebook', () => {
    beforeEach(() => {
      fireAuthSpyObj.signOut.and.returnValue(Promise.resolve());
      spyOn(service, 'refreshUserData').and.returnValue(Promise.resolve(null));
    });

    it('when credentials are correct should has currentUser', fakeAsync(() => {
      fireAuthSpyObj.signInWithPopup.and.returnValue(Promise.resolve({ user: {}, additionalUserInfo: {} } as firebase.auth.UserCredential));
      expectAsync(service.signInWithFacebook()).toBeResolved();
    }));

    it('when credentials are not correct should has no currentUser', fakeAsync(() => {
      fireAuthSpyObj.signInWithPopup.and.returnValue(Promise.reject(new Error('')));
      expectAsync(service.signInWithFacebook()).toBeRejected();
    }));
  });

  describe('signInWithGoogle', () => {
    beforeEach(() => {
      fireAuthSpyObj.signOut.and.returnValue(Promise.resolve());
      spyOn(service, 'refreshUserData').and.returnValue(Promise.resolve(null));
    });

    it('when credentials are correct should has currentUser', fakeAsync(() => {
      fireAuthSpyObj.signInWithPopup.and.returnValue(Promise.resolve({ user: {}, additionalUserInfo: {} } as firebase.auth.UserCredential));
      expectAsync(service.signInWithGoogle()).toBeResolved();
    }));

    it('when credentials are not correct should has no currentUser', fakeAsync(() => {
      fireAuthSpyObj.signInWithPopup.and.returnValue(Promise.reject(new Error('')));
      expectAsync(service.signInWithGoogle()).toBeRejected();
    }));
  });

  describe('signOut', () => {
    beforeEach(() => {
      fireAuthSpyObj.signOut.and.returnValue(Promise.resolve());
      spyOn(service, 'refreshUserData').and.returnValue(Promise.resolve(null));
    });

    it('when user was signed out should resolve', fakeAsync(() => {
      fireAuthSpyObj.signOut.and.returnValue(Promise.resolve());
      expectAsync(service.signOut()).toBeResolved();
    }));

    it('when user was not signed out should reject', fakeAsync(() => {
      fireAuthSpyObj.signOut.and.returnValue(Promise.reject());
      expectAsync(service.signOut()).toBeRejected();
    }));
  });

  describe('refreshUserData', () => {
    it('when user is not logged should throw error', fakeAsync(() => {
      spyOn(TestBed.get(AngularFirestore), 'collection').and.returnValue({
        get: () => ({ toPromise: () => Promise.resolve(null) })
      });

      expectAsync(service.refreshUserData()).toBeRejectedWith(new Error('User is not logged in'));
    }));

    it('when user is logged but there is no matching user account in db in should throw error', fakeAsync(() => {
      Object.defineProperty(fireAuthSpyObj, 'authState', {
        value: of({ uid: '12345' } as User)
      });

      service = new AuthService(fireAuthSpyObj, TestBed.get(AngularFirestore));

      spyOn(TestBed.get(AngularFirestore), 'collection').and.returnValue({
        doc: s => ({ get: () => ({ pipe: () => ({ toPromise: () => Promise.reject(new Error('There is no user in db of the id')) }) }) })
      });

      expectAsync(service.refreshUserData()).toBeRejectedWith(new Error('There is no user in db of the id'));
    }));

    it('when user is logged in should return appUser', fakeAsync(() => {
      let user;

      Object.defineProperty(fireAuthSpyObj, 'authState', {
        value: of({ uid: '12345' } as User)
      });

      service = new AuthService(fireAuthSpyObj, TestBed.inject(AngularFirestore));
      let userObs = service.getCurrentUser.subscribe(u => {
        user = u;
      });

      spyOn(TestBed.get(AngularFirestore), 'collection').and.returnValue({
        doc: () => ({
          get: () => ({
            pipe: () => ({
              toPromise: () => Promise.resolve({
                subscriptionDateEnd: new Date(),
                schoolRef: 'schoolId'
              })
            })
          })
        }
        )
      });

      service.refreshUserData().then(s => {
        expect(user.subscriptionDateEnd).toBeTruthy();
        expect(user.schoolRef).toBeDefined();
        expect(user.firebaseUser.uid).toEqual('12345');
        userObs.unsubscribe();
      });
    }));

  });
});
