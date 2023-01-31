import { createAction, props } from '@ngrx/store';
import { VocabEntry } from 'src/app/models/vocab.model';

export const setEntry = createAction(
  '[VocabCard] SetEntry',
  props<{ currentEntry: VocabEntry }>()
);
export const clearEntry = createAction('[VocabCard] ClearEntry');
export const startLoading = createAction('[VocabCard] StartLoading');
