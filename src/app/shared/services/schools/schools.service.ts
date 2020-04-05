import { take, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { School } from './../../../models/school.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchoolsService {

  constructor(private firestore: AngularFirestore) { }

  getAllSchools(): Observable<School[]> {
    return this.firestore.collection('schools').get().pipe(take(1), map(schools => {
      return schools.docs.map(s => {
        const data = s.data() as School;
        data.id = s.id;
        return data;
      });
    }));
  }
}
