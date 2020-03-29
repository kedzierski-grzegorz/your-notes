import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './../../../auth/auth.service';
import { AppUser } from './../../../auth/app-user.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService, private fireAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  updateUserData(updatedUser: AppUser): Promise<void> {
    return new Promise((resolve, reject) => {

    });
  }

  checkIfWasUdpatedFirestoreData(updatedUser: AppUser): boolean {
    return true;
  }
}