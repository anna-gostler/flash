import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { VocabEntry } from 'src/app/models/vocab.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private dbService: NgxIndexedDBService) {}

  add(vocabEntry: VocabEntry) {
    console.log('add', vocabEntry);
    this.dbService
      .add('vocab', vocabEntry)
      .subscribe((key) => {
        console.log('key: ', key);
      });
  }
}
