import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchoolsService {

  constructor(private firestore: AngularFirestore) { }


}
