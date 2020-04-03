import { DocumentReference } from '@angular/fire/firestore/interfaces';
import { AppUser } from './../../../auth/app-user.model';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './../../../auth/auth.service';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserService } from './user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

describe('UserService', () => {
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
    expect(service).toBeTruthy();
  });

  describe('checkIfWasUdpatedFirestoreData', () => {
    it('nothing from firestore was changed should return false', async () => {
      let user = {
        firebaseUser: {} as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(JSON.parse(JSON.stringify(user)))
      });

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFirestoreData(user);

      expect(result).toBeFalsy();
    });

    it('schoolRef was changed should return true', async () => {
      let user = {
        firebaseUser: {} as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(JSON.parse(JSON.stringify(user)))
      });

      user.schoolRef = { id: 'test2' } as DocumentReference;

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFirestoreData(user);

      expect(result).toBeTruthy();
    });

    it('subscriptionDateEnd was changed should return true', async () => {
      let user = {
        firebaseUser: {} as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(JSON.parse(JSON.stringify(user)))
      });

      user.subscriptionDateEnd = new Date();

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFirestoreData(user);

      expect(result).toBeTruthy();
    });

    it('subscriptionDateEnd was changed to the same value should return false', async () => {
      let user = {
        firebaseUser: {} as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(JSON.parse(JSON.stringify(user)))
      });

      user.subscriptionDateEnd = new Date('2020-01-01');

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFirestoreData(user);

      expect(result).toBeFalsy();
    });

    it('firebaseUser was changed should return false', async () => {
      let user = {
        firebaseUser: {} as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(JSON.parse(JSON.stringify(user)))
      });

      user.firebaseUser = { uid: 'test' } as User;

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFirestoreData(user);

      expect(result).toBeFalsy();
    });

    it('authService returns null user should return false', async () => {
      let user = {
        firebaseUser: {} as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(null)
      });

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFirestoreData(user);

      expect(result).toBeFalsy();
    });

    it('authService throws should return false', async () => {
      let user = {
        firebaseUser: {} as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(Promise.reject())
      });

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFirestoreData(user);

      expect(result).toBeFalsy();
    });
  });

  describe('checkIfWasUdpatedFiresAutheData', () => {
    it('nothing from fireAuth was changed should return false', async () => {
      let user = {
        firebaseUser: { uid: 'test' } as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(JSON.parse(JSON.stringify(user)))
      });

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFireAutheData(user);

      expect(result).toBeFalsy();
    });

    it('uid from fireAuth was changed should return true', async () => {
      let user = {
        firebaseUser: { uid: 'test' } as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(JSON.parse(JSON.stringify(user)))
      });

      user.firebaseUser.uid = 'new value';

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFireAutheData(user);

      expect(result).toBeTruthy();
    });

    it('displayName from fireAuth was changed should return true', async () => {
      let user = {
        firebaseUser: { uid: 'test' } as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(JSON.parse(JSON.stringify(user)))
      });

      user.firebaseUser.displayName = 'new value';

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFireAutheData(user);

      expect(result).toBeTruthy();
    });

    it('schoolRef from firestore was changed should return false', async () => {
      let user = {
        firebaseUser: { uid: 'test' } as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(JSON.parse(JSON.stringify(user)))
      });

      user.schoolRef = { id: 'test231' } as DocumentReference;

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFireAutheData(user);

      expect(result).toBeFalsy();
    });

    it('authService returns null user should return false', async () => {
      let user = {
        firebaseUser: {} as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(null)
      });

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFireAutheData(user);

      expect(result).toBeFalsy();
    });

    it('authService throws should return false', async () => {
      let user = {
        firebaseUser: {} as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;

      Object.defineProperty(authServiceSpyObj, 'getCurrentUser', {
        value: of(Promise.reject())
      });

      const service = TestBed.get(UserService) as UserService;

      const result = await service.checkIfWasUdpatedFireAutheData(user);

      expect(result).toBeFalsy();
    });
  });

  describe('updateUser', () => {
    let user: AppUser;
    beforeEach(() => {
      user = {
        firebaseUser: { uid: 'test' } as User,
        schoolRef: { id: 'test' } as DocumentReference,
        subscriptionDateEnd: new Date('2020-01-01')
      } as AppUser;
    });

    it('all user data was changed and succesfuly updated should return observable', async () => {
      const service = TestBed.get(UserService) as UserService;

      spyOn(service, 'checkIfWasUdpatedFireAutheData').and.returnValue(Promise.resolve(true));
      spyOn(service, 'checkIfWasUdpatedFirestoreData').and.returnValue(Promise.resolve(true));

      firestoreSpyObj.collection.and.returnValue({
        doc: () => ({
          update: () => Promise.resolve()
        })
      } as any);

      fireAuthSpyObj.updateCurrentUser.and.returnValue(Promise.resolve());
      authServiceSpyObj.refreshUserData.and.returnValue(Promise.resolve(of(user)));

      const result = await service.updateUser(user);

      expect(result).toBeTruthy();
      expect(firestoreSpyObj.collection).toHaveBeenCalled();
      expect(fireAuthSpyObj.updateCurrentUser).toHaveBeenCalled();
    });

    it('only fire auth was updated should return observable and call only fire auth update succesfully', async () => {
      const service = TestBed.get(UserService) as UserService;

      spyOn(service, 'checkIfWasUdpatedFireAutheData').and.returnValue(Promise.resolve(true));
      spyOn(service, 'checkIfWasUdpatedFirestoreData').and.returnValue(Promise.resolve(false));

      firestoreSpyObj.collection.and.returnValue({
        doc: () => ({
          update: () => Promise.resolve()
        })
      } as any);

      fireAuthSpyObj.updateCurrentUser.and.returnValue(Promise.resolve());
      authServiceSpyObj.refreshUserData.and.returnValue(Promise.resolve(of(user)));

      const result = await service.updateUser(user);

      expect(result).toBeTruthy();
      expect(firestoreSpyObj.collection).toHaveBeenCalledTimes(0);
      expect(fireAuthSpyObj.updateCurrentUser).toHaveBeenCalled();
    });

    it('only firestore was updated should return observable and call only firestore update succesfully', async () => {
      const service = TestBed.get(UserService) as UserService;

      spyOn(service, 'checkIfWasUdpatedFireAutheData').and.returnValue(Promise.resolve(false));
      spyOn(service, 'checkIfWasUdpatedFirestoreData').and.returnValue(Promise.resolve(true));

      firestoreSpyObj.collection.and.returnValue({
        doc: () => ({
          update: () => Promise.resolve()
        })
      } as any);

      fireAuthSpyObj.updateCurrentUser.and.returnValue(Promise.resolve());
      authServiceSpyObj.refreshUserData.and.returnValue(Promise.resolve(of(user)));

      const result = await service.updateUser(user);

      expect(result).toBeTruthy();
      expect(firestoreSpyObj.collection).toHaveBeenCalled();
      expect(fireAuthSpyObj.updateCurrentUser).toHaveBeenCalledTimes(0);
    });

    it('nothing was changed should return observable and not call any update', async () => {
      const service = TestBed.get(UserService) as UserService;

      spyOn(service, 'checkIfWasUdpatedFireAutheData').and.returnValue(Promise.resolve(false));
      spyOn(service, 'checkIfWasUdpatedFirestoreData').and.returnValue(Promise.resolve(false));

      firestoreSpyObj.collection.and.returnValue({
        doc: () => ({
          update: () => Promise.resolve()
        })
      } as any);

      fireAuthSpyObj.updateCurrentUser.and.returnValue(Promise.resolve());
      authServiceSpyObj.refreshUserData.and.returnValue(Promise.resolve(of(user)));

      const result = await service.updateUser(user);

      expect(result).toBeTruthy();
      expect(firestoreSpyObj.collection).toHaveBeenCalledTimes(0);
      expect(fireAuthSpyObj.updateCurrentUser).toHaveBeenCalledTimes(0);
    });

    it('all data was changed but fire auth throws should throw an error', async () => {
      const service = TestBed.get(UserService) as UserService;

      spyOn(service, 'checkIfWasUdpatedFireAutheData').and.returnValue(Promise.resolve(true));
      spyOn(service, 'checkIfWasUdpatedFirestoreData').and.returnValue(Promise.resolve(true));

      firestoreSpyObj.collection.and.returnValue({
        doc: () => ({
          update: () => Promise.resolve()
        })
      } as any);

      fireAuthSpyObj.updateCurrentUser.and.returnValue(Promise.reject());
      authServiceSpyObj.refreshUserData.and.returnValue(Promise.resolve(of(user)));

      await expectAsync(service.updateUser(user)).toBeRejected();
    });

    it('all data was changed but firestore throws should throw an error', async () => {
      const service = TestBed.get(UserService) as UserService;

      spyOn(service, 'checkIfWasUdpatedFireAutheData').and.returnValue(Promise.resolve(true));
      spyOn(service, 'checkIfWasUdpatedFirestoreData').and.returnValue(Promise.resolve(true));

      firestoreSpyObj.collection.and.returnValue({
        doc: () => ({
          update: () => Promise.reject()
        })
      } as any);

      fireAuthSpyObj.updateCurrentUser.and.returnValue(Promise.resolve());
      authServiceSpyObj.refreshUserData.and.returnValue(Promise.resolve(of(user)));

      await expectAsync(service.updateUser(user)).toBeRejected();
    });
  });
});
