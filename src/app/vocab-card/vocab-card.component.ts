import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { ContainerItemComponent } from '../container-item/container-item.component';
import { ButtonConfig } from '../models/config.model';
import { VocabEntry } from '../models/vocab.model';
import { AnnotationService } from '../services/annotation/annotation.service';
import { DatabaseService } from '../services/database/database.service';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-vocab-card',
  templateUrl: './vocab-card.component.html',
  styleUrls: ['./vocab-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VocabCardComponent extends ContainerItemComponent {
  @Input() vocabEntry: VocabEntry = {};
  loading$: Observable<boolean>;

  constructor(
    private annotationService: AnnotationService,
    private databaseService: DatabaseService,
    private cdr: ChangeDetectorRef,
    private store: Store<{ loading: boolean }>
  ) {
    super();
    this.annotationService.vocabEntrySubject.subscribe((entry) => {
      this.vocabEntry = entry;
      this.cdr.detectChanges();
    });

    this.loading$ = this.store.select('loading');
  }

  onSave() {
    console.log('onSave', this.vocabEntry);
    this.databaseService.add(this.vocabEntry);
    this.vocabEntry = {};
  }

  onCancelClick() {
    console.log('onCancelClick');
    this.vocabEntry = {};
    this.onCancel();
  }

  get buttonBottomBarConfig(): ButtonConfig[] {
      return [
        {
          label: 'Save',
          id: 'save',
          callback: () => this.onSave(),
          main: true,
          disabled: this.loading$ || !this.vocabEntry.expression,
        }
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
