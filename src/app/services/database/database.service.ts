import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { VocabEntry } from 'src/app/models/vocab.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private vocabDatabase = 'vocab';
  constructor(private dbService: NgxIndexedDBService) {}

  add(vocabEntry: VocabEntry) {
    console.log('add', vocabEntry);
    this.dbService.add<VocabEntry>(this.vocabDatabase, vocabEntry).subscribe((key) => {
      console.log('added key: ', key);
    });
  }

  get(key: string) {
    console.log('get', key);
    return this.dbService.getByKey<VocabEntry>(this.vocabDatabase, key);
  }

  getAll() {
    console.log('getAll');
    return this.dbService.getAll<VocabEntry>(this.vocabDatabase);
  }

  deleteByKey(key: string) {
    this.dbService.deleteByKey(this.vocabDatabase, key);
  }
}
