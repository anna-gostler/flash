import { createReducer, on } from '@ngrx/store';
import { startLoading, stopLoading } from '../actions/loading.actions';

export const initialState = false;

export const loadingReducer = createReducer(
  initialState,
  on(startLoading, (state) => true),
  on(stopLoading, (state) => false),
);