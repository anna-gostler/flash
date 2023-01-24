import { Component, Input } from '@angular/core';
import { ContainerItemComponent } from '../container-item/container-item.component';
import { VocabEntry } from '../models/vocab.model';
import { AnnotationService } from '../services/annotation/annotation.service';
import { DatabaseService } from '../services/database/database.service';

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
    this.databaseService.add(this.vocabEntry);
  }

  onCancelClick() {
    this.vocabEntry = {};
    this.onCancel();
  }
}
