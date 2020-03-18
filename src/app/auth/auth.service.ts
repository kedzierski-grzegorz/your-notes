import { Platform } from '@ionic/angular';
import { AppUser } from './app-user.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map, take } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: AppUser;

  get getCurrentUser(): Promise<AppUser> {
    if (this.currentUser) {
      return Promise.resolve(this.currentUser);
    }

    return this.refreshUserData();
  }

  constructor(
    private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private platform: Platform,
    private fb: Facebook,
    private googlePlus: GooglePlus
  ) { }

  signInWithEmail(email: string, password: string): Promise<AppUser> {
    return this.fireAuth.signOut().then(r => {
      return this.fireAuth.signInWithEmailAndPassword(email, password).then(credentials => {
        return this.refreshUserData();
      }).catch(e => Promise.reject(e));
    }).catch(e => Promise.reject(e));
  }

  signInWithGoogle(): Promise<AppUser> {
    if (this.platform.is('cordova')) {
      return this.fireAuth.signOut().then(r => {
        this.fireAuth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
        return this.fireAuth.getRedirectResult().then(u => {
          return this.refreshUserData();
        }).catch(e => Promise.reject(e));
      }).catch(e => Promise.reject(e));
      // return this.googlePlus.login({
      //   webClientId: '904337676475-jl9hq2t8t0bravf7ikumpogve2v4ehjq.apps.googleusercontent.com',
      //   offline: true
      // }).then((response) => {
      //   console.log(response);
      //   const googleCredential = firebase.auth.GoogleAuthProvider.credential(response.idToken);
      //   return this.fireAuth.signInWithCredential(googleCredential)
      //     .then(u => {
      //       console.log(u);
      //       return this.refreshUserData();
      //     }).catch(e => Promise.reject(e));
      // }, (err) => {
      //   console.log(err);
      //   return Promise.reject(err);
      // });
    } else {
      return this.fireAuth.signOut().then(r => {
        return this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(u => {
          return this.refreshUserData();
        }).catch(e => Promise.reject(e));
      }).catch(e => Promise.reject(e));
    }
  }

  signInWithFacebook(): Promise<AppUser> {
    if (this.platform.is('cordova')) {
      return this.fb.login(['public_profile']).then((response) => {
        console.log(response);
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
        return this.fireAuth.signInWithCredential(facebookCredential)
          .then(u => {
            console.log(u);
            return this.refreshUserData();
          }).catch(e => Promise.reject(e));
      }, (err) => Promise.reject(err));
    } else {
      return this.fireAuth.signOut().then(r => {
        return this.fireAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(u => {
          return this.refreshUserData();
        }).catch(e => Promise.reject(e));
      }).catch(e => Promise.reject(e));
    }
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
}
