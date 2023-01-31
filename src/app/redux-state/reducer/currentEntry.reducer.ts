import { createReducer, on } from '@ngrx/store';
import { VocabEntry } from 'src/app/models/vocab.model';
import {
  clearEntry,
  setEntry,
  startLoading,
} from '../actions/currentEntry.action';

export interface CurrentVocabState {
  currentEntry: VocabEntry;
  hasEntry: boolean;
  isLoading: boolean;
}

export const initialState = {
  currentEntry: {},
  hasEntry: false,
  isLoading: false,
};

export const currentEntryReducer = createReducer(
  initialState,
  on(setEntry, (state, { currentEntry }) => {
    return {
      currentEntry: currentEntry,
      hasEntry: true,
      isLoading: false
    };
  }),
  on(clearEntry, (state) => {
    return initialState;
  }),
  on(startLoading, (state) => {
    return {
      currentEntry: {},
      hasEntry: false,
      isLoading: true
    };
  }),
);
