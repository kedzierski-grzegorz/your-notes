import { Platform } from '@ionic/angular';
import { AppUser } from './app-user.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map, take } from 'rxjs/operators';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly PERSISTANCE = firebase.auth.Auth.Persistence.LOCAL;
  private currentUser: AppUser;

  private currentUserSub = new BehaviorSubject<AppUser>(this.currentUser);

  get getCurrentUser(): Observable<AppUser> {
    return this.currentUserSub.asObservable();
  }

  get authState$(): Observable<User> {
    return this.fireAuth.authState.pipe(map((user: User) => {
      if (user) {
        return user;
      } else {
        this.currentUser = null;
        this.currentUserSub.next(this.currentUser);
        return null;
      }
    }));
  }

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  signInWithEmail(email: string, password: string): Promise<Observable<AppUser>> {
    return this.signOut().then(r => {
      return this.fireAuth.setPersistence(this.PERSISTANCE).then(() => {
        return this.fireAuth.signInWithEmailAndPassword(email, password).then(credentials => {
          return this.refreshUserData();
        }).catch(e => Promise.reject(e));
      }).catch(e => Promise.reject(e));
    }).catch(e => Promise.reject(e));
  }

  signUpWithEmail(email: string, password: string): Promise<Observable<AppUser>> {
    return this.signOut().then(r => {
      return this.fireAuth.setPersistence(this.PERSISTANCE).then(() => {
        return this.fireAuth.createUserWithEmailAndPassword(email, password).then(credentials => {
          return this.refreshUserData();
        }).catch(e => Promise.reject(e));
      }).catch(e => Promise.reject(e));
    }).catch(e => Promise.reject(e));
  }

  signInWithGoogle(): Promise<Observable<AppUser>> {
    return this.signOut().then(r => {
      return this.fireAuth.setPersistence(this.PERSISTANCE).then(() => {
        return this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(u => {
          return this.refreshUserData();
        }).catch(e => Promise.reject(e));
      }).catch(e => Promise.reject(e));
    }).catch(e => Promise.reject(e));
  }

  signInWithFacebook(): Promise<Observable<AppUser>> {
    return this.signOut().then(r => {
      return this.fireAuth.setPersistence(this.PERSISTANCE).then(() => {
        return this.fireAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(u => {
          return this.refreshUserData();
        }).catch(e => Promise.reject(e));
      }).catch(e => Promise.reject(e));
    }).catch(e => Promise.reject(e));
  }

  refreshUserData(): Promise<Observable<AppUser>> {
    const appUser: AppUser = {};

    return new Promise((resolve, reject) => this.fireAuth.authState.pipe(first()).toPromise().then(user => {
      if (user && user.uid) {
        this.firestore.collection('users').doc(user.uid).get().pipe(map(data => data.data()), take(1)).toPromise()
          .then(userDetails => {
            if (userDetails) {
              appUser.firebaseUser = user;
              appUser.subscriptionDateEnd = userDetails.subscriptionDateEnd;
              appUser.schoolRef = userDetails.schoolRef;
              this.currentUser = appUser;
              this.currentUserSub.next(this.currentUser);
              resolve(this.currentUserSub.asObservable());
            } else {
              this.currentUser = null;
              this.currentUserSub.next(this.currentUser);
              reject(new Error('The user does not exist in the database.'));
            }
          }).catch(e => reject(e));
      } else {
        reject(new Error('User is not logged in'));
      }
    }).catch(e => reject(e)));
  }

  signOut(): Promise<void> {
    return this.fireAuth.signOut().then(r => {
      this.currentUser = null;
      this.currentUserSub.next(this.currentUser);
      return Promise.resolve();
    }).catch(e => Promise.reject(e));
  }
}
