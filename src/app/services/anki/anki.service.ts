import { Injectable } from '@angular/core';
import { VocabEntry } from 'src/app/models/vocab.model';
import { ExportToCsv } from 'export-to-csv';

@Injectable({
  providedIn: 'root',
})
export class AnkiService {
  constructor() {}

  toCSV(vocabEntries: VocabEntry[], fileName: string) {
    const data = this.toAnkiFormat(vocabEntries);

    const options = {
      fieldSeparator: ';',
      quoteStrings: ' ',
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

  toAnkiFormat(vocabEntries: VocabEntry[]) {
    const data = [];
    for (const vocabEntry of vocabEntries) {
      if (vocabEntry && vocabEntry.expression) {
        data.push({
          front: vocabEntry.expression,
          back: this.clean(vocabEntry.reading)
            .concat(' ')
            .concat(
              this.clean(vocabEntry.meanings?.join(' '))
                .concat('<br>')
                .concat(this.clean(vocabEntry.level))
                .concat(' ')
                .concat(vocabEntry.common ? 'common' : '')
            ),
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
}
