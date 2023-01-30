import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { VocabEntry } from '../models/vocab.model';
import { DatabaseService } from '../services/database/database.service';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AnkiService } from '../services/anki/anki.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-saved-vocab-container',
  templateUrl: './saved-vocab-container.component.html',
  styleUrls: ['./saved-vocab-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedVocabContainerComponent {
  vocabEntries$: Observable<VocabEntry[]>;
  vocabEntryForm: FormGroup = new FormGroup({});
  private _selectedVocab: VocabEntry[] = [];

  constructor(
    private databaseService: DatabaseService,
    private ankiService: AnkiService,
    private cdr: ChangeDetectorRef
  ) {
    this.vocabEntries$ = this.databaseService.getAll();
    this.vocabEntries$.subscribe((entries) => {
      for (const entry of entries) {
        if (entry.id) {
          const formControl = this.createSelectionFormControl();
          this.vocabEntryForm.addControl(entry.id, formControl);
        }
      }
    });
  }

  getButtonBarConfig(vocabEntry: VocabEntry) {
    return [
      {
        id: 'remove-saved',
        icon: fontawesome.faRemove,
        small: true,
        callback: () => this.deleteEntry(vocabEntry),
      },
    ];
  }

  clickedCheckbox(vocabEntry: VocabEntry) {
    if (
      !vocabEntry.id ||
      this.vocabEntryForm.value[vocabEntry.id] === undefined
    ) {
      return;
    }

    if (this.vocabEntryForm.value[vocabEntry.id]) {
      this._selectedVocab.push(vocabEntry);
    } else {
      this.removeItem(this._selectedVocab, vocabEntry);
    }
  }

  getPageButtonBarConfig() {
    return [
      {
        id: 'export-to-csv',
        label: this.exportLabel,
        callback: () => {
          if (this.selectedVocab.length > 0) {
            this.ankiService.toCSV(this.selectedVocab, 'anki-vocab');
          } else {
            this.vocabEntries$.subscribe((entries) => {
              this.ankiService.toCSV(entries, 'anki-vocab');
            });
          }
        },
      },
    ];
  }

  deleteEntry(vocabEntry: VocabEntry) {
    if (vocabEntry && vocabEntry.id) {
      console.log('Try to delete', vocabEntry);
      this.databaseService.deleteByKey(vocabEntry.id).subscribe((entry) => {
        console.log('Deleted successful:', entry);
        this.vocabEntries$ = this.databaseService.getAll();
        this.removeItem(this._selectedVocab, vocabEntry);
        this.cdr.detectChanges();
      });
    } else {
      console.log('Could not delete', vocabEntry);
    }
  }

  get selectedVocab() {
    return this._selectedVocab;
  }

  get exportLabel() {
    const n = this._selectedVocab.length;
    if (n === 0) {
      return 'export all';
    } else if (n === 1) {
      return 'export 1 item';
    } else if (n > 1) {
      return 'export ' + n + ' items';
    } else {
      console.log('Could not set export label');
      return '';
    }
  }

  removeItem(array: any[], entry: any) {
    let index = array.indexOf(entry);
    array.splice(index, 1);
  }

  private createSelectionFormControl(): FormControl {
    return new FormControl(false);
  }
}
