import { Injectable, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
// @ts-ignore
import { Annotorious } from '@recogito/annotorious';
import { debounceTime, fromEvent, Subject } from 'rxjs';
import { VocabEntry } from 'src/app/models/vocab.model';
import { startLoading, stopLoading } from 'src/app/redux-state/actions/loading.actions';
import { DictionaryService } from '../dictionary/dictionary.service';
import { OcrService } from '../ocr/ocr.service';
import { VocabService } from '../vocab/vocab.service';

@Injectable({
  providedIn: 'root',
})
export class AnnotationService {
  anno: Annotorious;
  languageCode = 'jpn';
  vocabEntrySubject = new Subject<VocabEntry>();
  annotationCreated = new Subject<boolean>();

  constructor(
    private ocrService: OcrService,
    private dictionaryService: DictionaryService,
    private vocabService: VocabService,
    private store: Store<{ loading: boolean }>
  ) {}

  setUp(idOfImageToBeAnnotated: string): void {
    console.log(
      'Set up AnnotationService for image with id',
      idOfImageToBeAnnotated
    );
    const config = {
      image: document.getElementById(idOfImageToBeAnnotated),
      disableEditor: true,
    };

    if (!config.image) {
      console.warn('No image with id', idOfImageToBeAnnotated, 'found');
      return;
    }

    this.anno = new Annotorious(config);

    this.anno.on('createSelection', (selection: any) => {
      console.log('createSelection', selection);
      this.annotationCreated.next(true);
      this.vocabEntrySubject.next({});
      this.store.dispatch(startLoading());

      try {
        const result = this.anno.getImageSnippetById(selection.id);
        if (result) {
          const { snippet } = result;
          this.extractVocabEntry(snippet);
        }
      } catch (e) {
        console.log(
          'Error occured while trying to extract vocab entry from snippet',
          e
        );
      }
    });

    fromEvent(this.anno, 'changeSelectionTarget')
      .pipe(debounceTime(500))
      .subscribe((selection: any) => {
        console.log('selection updated');
        this.store.dispatch(startLoading());
        if (selection.source) {
          this.extractVocabEntry(selection.source);
        }
      });
  }

  clearAnnotations(): void {
    this.anno.clearAnnotations();
    this.annotationCreated.next(false);
  }

  hasAnnotation(): boolean {
    return this.anno && this.anno.getAnnotations().length > 0;
  }

  private extractVocabEntry(snippet: any) {
    this.ocrService.ocr(snippet, this.languageCode).then((extractedText) => {
      this.dictionaryService.getEntry(extractedText).subscribe({
        next: (v) => {
          const vocabEntry = this.vocabService.toVocabEntry(v);
          console.log(vocabEntry);
          this.vocabEntrySubject.next(vocabEntry);
        },
        error: (e) => console.error(e),
        complete: () => {
          this.store.dispatch(stopLoading());
        },
      });
    });
  }
}
