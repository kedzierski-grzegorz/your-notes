import { Platform } from '@ionic/angular';
import { AppUser } from './app-user.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map, take } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly PERSISTANCE = firebase.auth.Auth.Persistence.LOCAL;
  private currentUser: AppUser;

  get getCurrentUser(): Promise<AppUser> {
    if (this.currentUser) {
      return Promise.resolve(this.currentUser);
    }

    return this.refreshUserData();
  }

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) { }

  signInWithEmail(email: string, password: string): Promise<AppUser> {
    return this.fireAuth.signOut().then(r => {
      return this.fireAuth.setPersistence(this.PERSISTANCE).then(() => {
        return this.fireAuth.signInWithEmailAndPassword(email, password).then(credentials => {
          return this.refreshUserData();
        }).catch(e => Promise.reject(e));
      }).catch(e => Promise.reject(e));
    }).catch(e => Promise.reject(e));
  }

  signInWithGoogle(): Promise<AppUser> {
    return this.fireAuth.signOut().then(r => {
      return this.fireAuth.setPersistence(this.PERSISTANCE).then(() => {
        return this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(u => {
          return this.refreshUserData();
        }).catch(e => Promise.reject(e));
      }).catch(e => Promise.reject(e));
    }).catch(e => Promise.reject(e));
  }

  signInWithFacebook(): Promise<AppUser> {
    return this.fireAuth.signOut().then(r => {
      return this.fireAuth.setPersistence(this.PERSISTANCE).then(() => {
        return this.fireAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(u => {
          return this.refreshUserData();
        }).catch(e => Promise.reject(e));
      }).catch(e => Promise.reject(e));
    }).catch(e => Promise.reject(e));
  }

  refreshUserData(): Promise<AppUser> {
    const appUser: AppUser = {};

    return new Promise((resolve, reject) => this.fireAuth.authState.pipe(first()).toPromise().then(user => {
      if (user && user.uid) {
        console.log(user);
        this.firestore.collection('users').doc(user.uid).get().pipe(map(data => data.data()), take(1)).toPromise()
          .then(userDetails => {
            console.log(userDetails);
            if (userDetails) {
              appUser.firebaseUser = user;
              appUser.subscriptionDateEnd = userDetails.subscriptionDateEnd;
              appUser.schoolRef = userDetails.schoolRef;
              this.currentUser = appUser;
              console.log(appUser);
              resolve(appUser);
            } else {
              console.log('null');
              resolve(null);
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
      return Promise.resolve();
    }).catch(e => Promise.reject(e));
  }
}
