import { User } from 'firebase';

export interface AppUser {
    firebaseUser?: User;
    schoolId?: string;
    schoolName?: string;
    subscriptionDateEnd?: Date;
    nick?: string;
}