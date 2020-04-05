import { Platform, ModalController } from '@ionic/angular';
import { AppUser } from './app-user.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map, take } from 'rxjs/operators';
import * as firebase from 'firebase';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from 'firebase';
import { ProfilePage } from '../profile/profile.page';

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
        if (this.currentUser == null) {
          this.refreshUserData();
        }
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
    private firestore: AngularFirestore,
    private modalController: ModalController
  ) { }

  async signInWithEmail(email: string, password: string): Promise<Observable<AppUser>> {
    await this.signOut();
    await this.fireAuth.setPersistence(this.PERSISTANCE);
    await this.fireAuth.signInWithEmailAndPassword(email, password);
    return this.refreshUserData();
  }

  async signUpWithEmail(email: string, password: string): Promise<Observable<AppUser>> {
    await this.signOut();
    await this.fireAuth.setPersistence(this.PERSISTANCE);
    await this.fireAuth.createUserWithEmailAndPassword(email, password);
    return this.refreshUserData();
  }

  async signInWithGoogle(): Promise<Observable<AppUser>> {
    await this.signOut();
    await this.fireAuth.setPersistence(this.PERSISTANCE);
    await this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    return this.refreshUserData();
  }

  async signInWithFacebook(): Promise<Observable<AppUser>> {
    await this.signOut();
    await this.fireAuth.setPersistence(this.PERSISTANCE);
    await this.fireAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    return this.refreshUserData();
  }

  async refreshUserData(): Promise<Observable<AppUser>> {
    const appUser: AppUser = {};

    const fireUser = await this.fireAuth.authState.pipe(first()).toPromise();
    if (fireUser && fireUser.uid) {
      const firestoreUser
        = await this.firestore.collection('users').doc(fireUser.uid).get().pipe(map(data => data.data()), take(1)).toPromise();

      if (firestoreUser) {
        appUser.firebaseUser = fireUser;
        appUser.subscriptionDateEnd = firestoreUser.subscriptionDateEnd;
        appUser.schoolRef = firestoreUser.schoolRef;
        this.currentUser = appUser;
        this.currentUserSub.next(this.currentUser);
        return this.currentUserSub.asObservable();
      } else {
        if (!document.querySelector('.create-profile-modal')) {
          const modal = await this.modalController.create({
            component: ProfilePage,
            backdropDismiss: false,
            cssClass: 'create-profile-modal'
          });

          modal.present();
        }

        this.currentUser = null;
        this.currentUserSub.next(this.currentUser);
        return this.currentUserSub.asObservable();
      }
    } else {
      throw new Error('User is not logged in');
    }
  }

  async signOut(): Promise<void> {
    await this.fireAuth.signOut();
    this.currentUser = null;
    this.currentUserSub.next(this.currentUser);
  }
}
