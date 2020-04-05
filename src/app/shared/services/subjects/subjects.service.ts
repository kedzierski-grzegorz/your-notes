import { take, map } from 'rxjs/operators';
import { Subject } from './../../../models/subject.model';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  constructor(private firestore: AngularFirestore) { }

  getAllSubjects(): Observable<Subject[]> {
    return this.firestore.collection('subjects').get().pipe(take(1), map(subList => {
      return subList.docs.map(sub => {
        const data = sub.data() as Subject;
        data.id = sub.id;
        return data;
      });
    }));
  }
}
