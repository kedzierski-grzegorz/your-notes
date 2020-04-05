import { User } from 'firebase';
import { DocumentReference } from '@angular/fire/firestore/interfaces';

export interface AppUser {
    firebaseUser?: User;
    schoolRef?: DocumentReference;
    subscriptionDateEnd?: Date;
}