import { Component } from '@angular/core';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { CurrentVocabState } from './redux-state/reducer/currentEntry.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'flash-app';

  showSaved = false;
  showCamera = true;
  hasEntry = false;
  loading = false;

  constructor(private store: Store<{ currentEntry: CurrentVocabState }>) {
    this.store.select('currentEntry').subscribe((currentEntry) => {
      this.hasEntry = currentEntry.hasEntry;
      this.loading = currentEntry.isLoading;
    });
  }

  ngOnInit() {}

  get buttonBarConfig() {
    return [
      {
        icon: fontawesome.faCamera,
        id: 'main-menu-camera',
        callback: () => {
          this.showSaved = false;
          this.showCamera = true;
        },
      },
      {
        icon: fontawesome.faBars,
        id: 'main-menu-saved',
        callback: () => {
          this.showSaved = true;
          this.showCamera = false;
        },
      },
    ];
  }
}
