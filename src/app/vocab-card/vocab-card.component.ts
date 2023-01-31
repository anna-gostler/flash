import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { ContainerItemComponent } from '../container-item/container-item.component';
import { ButtonConfig } from '../models/config.model';
import { VocabEntry } from '../models/vocab.model';
import { DatabaseService } from '../services/database/database.service';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { clearEntry } from '../redux-state/actions/currentEntry.action';
import { CurrentVocabState } from '../redux-state/reducer/currentEntry.reducer';

@Component({
  selector: 'app-vocab-card',
  templateUrl: './vocab-card.component.html',
  styleUrls: ['./vocab-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VocabCardComponent extends ContainerItemComponent {
  loading: boolean = false;
  vocabEntry: VocabEntry = {};
  hasEntry: boolean = false;

  constructor(
    private databaseService: DatabaseService,
    private cdr: ChangeDetectorRef,
    private store: Store<{ currentEntry: CurrentVocabState }>
  ) {
    super();
    this.store.select('currentEntry').subscribe((entry) => {
      console.log('update entry', entry);
      this.vocabEntry = entry.currentEntry;
      this.hasEntry = entry.hasEntry;
      this.loading = entry.isLoading;
      this.cdr.markForCheck();
    });
  }

  onSave() {
    console.log('onSave');
    this.databaseService.add(this.vocabEntry);
    this.store.dispatch(clearEntry());
  }

  onCancelClick() {
    console.log('onCancelClick');
    this.store.dispatch(clearEntry());
    this.onCancel();
  }

  get buttonBottomBarConfig(): ButtonConfig[] {
    return [
      {
        label: 'Save',
        id: 'save',
        callback: () => this.onSave(),
        main: true,
        disabled: this.loading || !this.hasEntry,
      },
    ];
  }

  get buttonTopBarConfig(): ButtonConfig[] {
    return [
      {
        icon: fontawesome.faRemove,
        small: true,
        id: 'cancel',
        callback: () => this.onCancelClick(),
      },
    ];
  }
}
