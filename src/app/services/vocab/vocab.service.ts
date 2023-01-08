import { Injectable } from '@angular/core';
import { JishoDictionaryEntry } from 'src/app/models/dictionary.model';
import { VocabEntry } from 'src/app/models/vocab.model';

@Injectable({
  providedIn: 'root',
})
export class VocabService {
  constructor() {}

  toVocabEntry(dictionaryEntry: JishoDictionaryEntry): VocabEntry {
    if (!dictionaryEntry || !dictionaryEntry.data[0]) {
      return {};
    } else {
      console.log(dictionaryEntry);
      let level = '';
      const firstDataItem = dictionaryEntry.data[0];

      if (firstDataItem.jlpt.length > 0) {
        level = firstDataItem.jlpt.sort().reverse()[0];
      }

      return {
        expression: firstDataItem.slug,
        meanings: firstDataItem.senses[0].english_definitions,
        reading: firstDataItem.japanese[0].reading,
        example: '',
        level: level,
        common: firstDataItem.is_common,
      };
    }
  }
}
