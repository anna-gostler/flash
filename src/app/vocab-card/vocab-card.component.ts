import { Component, Input } from '@angular/core';
import { ContainerItemComponent } from '../container-item/container-item.component';
import { ButtonConfig } from '../models/config.model';
import { VocabEntry } from '../models/vocab.model';
import { AnnotationService } from '../services/annotation/annotation.service';
import { DatabaseService } from '../services/database/database.service';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-vocab-card',
  templateUrl: './vocab-card.component.html',
  styleUrls: ['./vocab-card.component.scss'],
})
export class VocabCardComponent extends ContainerItemComponent {
  @Input() vocabEntry: VocabEntry = {};
  @Input() loading: boolean = false;

  constructor(
    private annotationService: AnnotationService,
    private databaseService: DatabaseService
  ) {
    super();
    this.annotationService.vocabEntrySubject.subscribe((entry) => {
      this.vocabEntry = entry;
    });

    this.annotationService.vocabEntryInProgressSubject.subscribe((loading) => {
      this.loading = loading;
    });
  }

  onSave() {
    console.log('onSave', this.vocabEntry);
    this.databaseService.add(this.vocabEntry);
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
        disabled: this.loading,
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
