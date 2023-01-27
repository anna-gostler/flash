import { Injectable } from '@angular/core';
import { VocabEntry } from 'src/app/models/vocab.model';
import { ExportToCsv } from 'export-to-csv';

@Injectable({
  providedIn: 'root',
})
export class AnkiService {
  private LINEBREACK = '<br/>';
  constructor() {}

  toCSV(vocabEntries: VocabEntry[], fileName: string) {
    const separator = ',';
    const data = this.toAnkiFormat(vocabEntries, separator);

    const options = {
      fieldSeparator: separator,
      quoteStrings: '',
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

  toAnkiFormat(vocabEntries: VocabEntry[], seperator: string) {
    const data = [];
    for (const vocabEntry of vocabEntries) {
      if (vocabEntry && vocabEntry.expression) {
        data.push({
          front: vocabEntry.expression,
          back: this.removefromString(this.clean(vocabEntry.reading)
            .concat(this.LINEBREACK)
            .concat(this.clean(vocabEntry.meanings?.join('; ')))
            .concat(this.LINEBREACK)
            .concat(this.clean(vocabEntry.level))
            .concat(this.LINEBREACK)
            .concat(vocabEntry.common ? 'common' : ''), seperator),
        });
      }
    }
    return data;
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
