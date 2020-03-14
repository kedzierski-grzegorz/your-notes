import { AppUser } from './app-user.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User, app } from 'firebase';

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

  constructor(private fireAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  signInWithEmail(email: string, password: string): Promise<AppUser> {
    return this.refreshUserData();
  }

  signInWithGoogle(): Promise<AppUser> {
    return this.refreshUserData();
  }

  signInWithFacebook(): Promise<AppUser> {
    return this.refreshUserData();
  }

  refreshUserData(): Promise<AppUser> {
    const appUser: AppUser = {};

    return new Promise((resolve, reject) => this.fireAuth.currentUser.then(user => {
      if (user && user.uid) {
        this.firestore.collection('users', r => r.where('userId', '==', user.uid)).get().toPromise()
          .then(userDetails => {
            if (userDetails && userDetails.size > 0) {
              const data = userDetails.docs[0].data();
              appUser.firebaseUser = user;
              appUser.nick = data.nick;
              appUser.subscriptionDateEnd = data.subscriptionDateEnd;
              appUser.schoolId = data.schoolId;
              appUser.schoolName = data.schoolName;

              this.currentUser = appUser;

              resolve(appUser);
            } else {
              resolve(null);
            }
          }).catch(e => reject(e));
      } else {
        reject(new Error('User is not logged in'));
      }
    }).catch(e => reject(e)));
  }
}
