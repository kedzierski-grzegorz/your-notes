import { User } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/firestore';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

fdescribe('AuthService', () => {
  let fireAuthSpyObj: jasmine.SpyObj<AngularFireAuth>;

  let service: AuthService;
  const testEmail = 'test@test.pl';
  const testPassword = 'password123';

  beforeEach(() => {
    fireAuthSpyObj = {
      ...jasmine.createSpyObj('AngularFireAuth', ['signInWithEmailAndPassword']),
      currentUser: Promise.resolve(null)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AngularFireAuth, useValue: fireAuthSpyObj },
        { provide: AngularFirestore, useValue: { collection: () => { } } }
      ]
    });

    service = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('when user is logged in should has currentUser', () => {
    expect(service.getCurrentUser).toBeTruthy();
  });

  it('when user is not logged in should has no currentUser', () => {
    expect(service.getCurrentUser).toBeNull();
  });

  describe('signInWithEmail', () => {
    it('when credentials are correct should has currentUser', () => {
      service.signInWithEmail(testEmail, testPassword);
      expect(service.getCurrentUser).toBeTruthy();
    });

    it('when credentials are not correct should has no currentUser', () => {
      service.signInWithEmail(testEmail, testPassword);
      expect(service.getCurrentUser).toBeNull();
    });
  });

  describe('signInWithFacebook', () => {
    it('when credentials are correct should has currentUser', () => {
      service.signInWithFacebook();
      expect(service.getCurrentUser).toBeTruthy();
    });

    it('when credentials are not correct should has no currentUser', () => {
      service.signInWithFacebook();
      expect(service.getCurrentUser).toBeNull();
    });
  });

  describe('signInWithGoogle', () => {
    it('when credentials are correct should has currentUser', () => {
      service.signInWithGoogle();
      expect(service.getCurrentUser).toBeTruthy();
    });

    it('when credentials are not correct should has no currentUser', () => {
      service.signInWithGoogle();
      expect(service.getCurrentUser).toBeNull();
    });
  });

  fdescribe('refreshUserData', () => {
    it('when user is not logged in should throw error', fakeAsync(() => {
      spyOn(TestBed.get(AngularFirestore), 'collection').and.returnValue({
        get: () => ({ toPromise: () => Promise.resolve(null) })
      });

      expectAsync(service.refreshUserData()).toBeRejectedWith(new Error('User is not logged in'));
    }));

    it('when user is logged but there is no matching user account in db in should throw error', fakeAsync(() => {
      Object.defineProperty(fireAuthSpyObj, 'currentUser', {
        value: Promise.resolve({ uid: 'sdsa' } as User)
      });

      service = new AuthService(fireAuthSpyObj, TestBed.get(AngularFirestore));

      spyOn(TestBed.get(AngularFirestore), 'collection').and.returnValue({
        get: () => ({ toPromise: () => Promise.reject(new Error('There is no user in db of the id')) })
      });

      expectAsync(service.refreshUserData()).toBeRejectedWith(new Error('There is no user in db of the id'));
    }));

    it('when user is logged in should return appUser', fakeAsync(() => {
      Object.defineProperty(fireAuthSpyObj, 'currentUser', {
        value: Promise.resolve({ uid: '12345' } as User)
      });

      service = new AuthService(fireAuthSpyObj, TestBed.get(AngularFirestore));

      spyOn(TestBed.get(AngularFirestore), 'collection').and.returnValue({
        get: () => ({
          toPromise: () => Promise.resolve({
            size: 1,
            metadata: {},
            empty: false,
            query: {},
            docs: [
              {
                data: () => {
                  return {
                    nick: 'nick',
                    subscriptionDateEnd: new Date(),
                    schoolId: 'schoolId',
                    schoolName: 'tps'
                  }
                }
              }
            ]
          })
        })
      });

      service.refreshUserData().then(user => {
        expect(user.nick).toEqual('nick');
        expect(user.subscriptionDateEnd).toBeTruthy();
        expect(user.schoolId).toEqual('schoolId');
        expect(user.schoolName).toEqual('tps');
        expect(user.firebaseUser.uid).toEqual('12345');
      });
    }));
  });
});
