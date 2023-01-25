import { ChangeDetectionStrategy, Component } from '@angular/core';
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
    private ankiService: AnkiService
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
        label: 'Export for Anki',
        callback: () => {
          this.vocabEntries$.subscribe((entries) => {
            this.ankiService.toCSV(entries, 'anki-vocab');
          });
        },
      },
    ];
  }

  onClick(vocabEntry: VocabEntry) {
    console.log('clicked', vocabEntry);
  }

  deleteEntry(vocabEntry: VocabEntry) {
    if (vocabEntry && vocabEntry.id) {
      console.log('Delete', vocabEntry);
      this.databaseService.deleteByKey(vocabEntry.id);
    } else {
      console.log('Could not delete', vocabEntry);
    }
  }
}
