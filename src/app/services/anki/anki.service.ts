import { Injectable } from '@angular/core';
import { VocabEntry } from 'src/app/models/vocab.model';
import { ExportToCsv } from 'export-to-csv';

@Injectable({
  providedIn: 'root',
})
export class AnkiService {
  private DIVIDER = '<br/>';
  constructor() {}

  toCSV(vocabEntries: VocabEntry[], fileName: string) {
    const separator = ',';
    const data = this.toAnkiFormat(vocabEntries, separator);

    const options = {
      fieldSeparator: separator,
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      filename: fileName,
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(data);
  }

  toAnkiFormat(vocabEntries: VocabEntry[], separator: string) {
    const data = [];
    for (const vocabEntry of vocabEntries) {
      if (vocabEntry && vocabEntry.expression) {
        data.push({
          front: vocabEntry.expression,
          back: this.generateBack(vocabEntry, separator),
        });
      }
    }
    return data;
  }

  private generateBack(vocabEntry: VocabEntry, separator: string) {
    const info = [];

    for (let [key, value] of Object.entries(vocabEntry)) {
      if (key === 'id' || key === 'expression') {
        continue;
      }

      if (Array.isArray(value)) {
        value = value.join(this.DIVIDER);
      }
      if (key === 'common') {
        value = value ? 'common' : '';
      }

      if (typeof value === 'string') {
        value = this.clean(value);
        value = this.removefromString(value, separator);
      }

      if (value !== '') {
        info.push(value);
      }
    }

    console.log(info);

    return info.join(this.DIVIDER);
  }

  private clean(str: string | undefined) {
    if (!str) {
      return '';
    } else {
      return str;
    }
  }

  removefromString(str: string, toRemove: string) {
    return str.replace(toRemove, '');
  }
}
