import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../../../auth/auth.service';
import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { AngularFireAuth } from '@angular/fire/auth';

fdescribe('UserService', () => {
  let authServiceSpyObj: jasmine.SpyObj<AuthService>;
  let fireAuthSpyObj: jasmine.SpyObj<AngularFireAuth>;
  let firestoreSpyObj: jasmine.SpyObj<AngularFirestore>;

  beforeEach(() => {
    authServiceSpyObj = jasmine.createSpyObj('AuthService', ['refreshUserData']);
    fireAuthSpyObj = jasmine.createSpyObj('AngularFireAuth', ['updateCurrentUser']);
    firestoreSpyObj = jasmine.createSpyObj('AngularFirestore', ['collection']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpyObj },
        { provide: AngularFireAuth, useValue: fireAuthSpyObj },
        { provide: AngularFirestore, useValue: firestoreSpyObj }
      ]
    });
  });

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    console.log(service);
    expect(service).toBeTruthy();
  });

  describe('checkIfWasUdpatedFirestoreData', () => {

  });
});
