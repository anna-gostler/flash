import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
// @ts-ignore
import { Annotorious } from '@recogito/annotorious';
import { debounceTime, fromEvent } from 'rxjs';
import { VocabEntry } from 'src/app/models/vocab.model';
import {
  clearEntry,
  setEntry,
  startLoading,
} from 'src/app/redux-state/actions/currentEntry.action';
import { DictionaryService } from '../dictionary/dictionary.service';
import { OcrService } from '../ocr/ocr.service';
import { VocabService } from '../vocab/vocab.service';

@Injectable({
  providedIn: 'root',
})
export class AnnotationService {
  anno: Annotorious;
  languageCode = 'jpn';

  constructor(
    private ocrService: OcrService,
    private dictionaryService: DictionaryService,
    private vocabService: VocabService,
    private store: Store<{ loading: boolean; currentEntry: VocabEntry }>
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
      this.store.dispatch(clearEntry());
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
        } else {
          console.log('could not update selection - no selection source');
        }
      });
  }

  clearAnnotations(): void {
    this.anno.clearAnnotations();
    this.store.dispatch(clearEntry());
  }

  hasAnnotation(): boolean {
    return this.anno && this.anno.getAnnotations().length > 0;
  }

  private extractVocabEntry(snippet: any) {
    this.ocrService.ocr(snippet, this.languageCode).then((extractedText) => {
      this.dictionaryService.getEntry(extractedText).subscribe({
        next: (v) => {
          if (v && v.length > 0) {
            const vocabEntry = this.vocabService.toVocabEntry(v);
            console.log(vocabEntry);
            this.store.dispatch(setEntry({ currentEntry: vocabEntry }));
          } else {
            console.log('Could not find entry in dictionary', v);
            this.store.dispatch(clearEntry());
          }
        },
        error: (e) => console.error(e),
        complete: () => {},
      });
    });
  }
}
