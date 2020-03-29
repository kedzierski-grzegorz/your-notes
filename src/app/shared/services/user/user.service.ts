import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './../../../auth/auth.service';
import { AppUser } from './../../../auth/app-user.model';
import { Injectable } from '@angular/core';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService, private fireAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  async updateUser(updatedUser: AppUser): Promise<Observable<AppUser>> {
    if (await this.checkIfWasUdpatedFirestoreData(updatedUser)) {
      const dataToUpdate = JSON.parse(JSON.stringify(updatedUser)) as AppUser;
      delete dataToUpdate.firebaseUser;

      await this.firestore.collection('users').doc(updatedUser.firebaseUser.uid).update(dataToUpdate);
    }

    if (await this.checkIfWasUdpatedFireAutheData(updatedUser)) {
      await this.fireAuth.updateCurrentUser(updatedUser.firebaseUser);
    }

    return await this.authService.refreshUserData();
  }

  async checkIfWasUdpatedFireAutheData(updatedUser: AppUser): Promise<boolean> {
    try {
      const currentUser = await this.authService.getCurrentUser.toPromise();

      if (!currentUser) {
        throw new Error('User is not logged in');
      }

      const currentUserOnlyFireAuth = { ...currentUser.firebaseUser } as User;

      const updatedUserOnlyFireAuth = { ...updatedUser.firebaseUser } as User;

      return JSON.stringify(currentUserOnlyFireAuth) !== JSON.stringify(updatedUserOnlyFireAuth);
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async checkIfWasUdpatedFirestoreData(updatedUser: AppUser): Promise<boolean> {
    try {
      const currentUser = await this.authService.getCurrentUser.toPromise();

      if (!currentUser) {
        throw new Error('User is not logged in');
      }

      const currentUserWithoutFireAuth = { ...currentUser } as AppUser;
      delete currentUserWithoutFireAuth.firebaseUser;

      const updatedUserWithoutFireAuth = { ...updatedUser } as AppUser;
      delete updatedUserWithoutFireAuth.firebaseUser;

      return JSON.stringify(currentUserWithoutFireAuth) !== JSON.stringify(updatedUserWithoutFireAuth);
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}