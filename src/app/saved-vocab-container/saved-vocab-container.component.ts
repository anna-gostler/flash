import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { VocabEntry } from '../models/vocab.model';
import { DatabaseService } from '../services/database/database.service';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AnkiService } from '../services/anki/anki.service';

@Component({
  selector: 'app-saved-vocab-container',
  templateUrl: './saved-vocab-container.component.html',
  styleUrls: ['./saved-vocab-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedVocabContainerComponent {
  vocabEntries$: Observable<VocabEntry[]>;

  constructor(
    private databaseService: DatabaseService,
    private ankiService: AnkiService,
    private cdr: ChangeDetectorRef
  ) {
    this.vocabEntries$ = this.databaseService.getAll();
  }

  getButtonBarConfig(vocabEntry: VocabEntry) {
    return [
      {
        id: 'remove-saved',
        icon: fontawesome.faRemove,
        callback: () => this.deleteEntry(vocabEntry),
      },
    ];
  }

  getPageButtonBarConfig() {
    return [
      {
        id: 'export-to-csv',
        label: 'Export CSV',
        callback: () => {
          this.vocabEntries$.subscribe((entries) => {
            this.ankiService.toCSV(entries, 'anki-vocab');
          });
        },
      },
    ];
  }

  onClick(vocabEntry: VocabEntry) {
    console.log('Clicked', vocabEntry);
  }

  deleteEntry(vocabEntry: VocabEntry) {
    if (vocabEntry && vocabEntry.id) {
      console.log('Try to delete', vocabEntry);
      this.databaseService.deleteByKey(vocabEntry.id).subscribe((entry) => {
        console.log('Deleted successful:', entry);
        this.vocabEntries$ = this.databaseService.getAll();
        this.cdr.detectChanges();
      });
    } else {
      console.log('Could not delete', vocabEntry);
    }
  }
}
