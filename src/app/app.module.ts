import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VocabCardComponent } from './vocab-card/vocab-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { WebcamModule } from 'ngx-webcam';
import { CaptureImageComponent } from './capture-image/capture-image.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { OverlayContainerComponent } from './overlay-container/overlay-container.component';
import { NgxRerenderModule } from 'ngx-rerender';
import { ContainerItemComponent } from './container-item/container-item.component';
import { ButtonBarComponent } from './button-bar/button-bar.component';
import { SavedVocabContainerComponent } from './saved-vocab-container/saved-vocab-container.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { loadingReducer } from './redux-state/reducer/loading.reducer';

const dbConfig: DBConfig = {
  name: 'vocab',
  version: 1,
  objectStoresMeta: [
    {
      store: 'vocab',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        {
          name: 'expression',
          keypath: 'expression',
          options: { unique: false },
        },
        { name: 'meanings', keypath: 'meanings', options: { unique: false } },
        { name: 'reading', keypath: 'reading', options: { unique: false } },
        { name: 'example', keypath: 'example', options: { unique: false } },
        { name: 'level', keypath: 'level', options: { unique: false } },
        { name: 'common', keypath: 'common', options: { unique: false } },
      ],
    },
  ],
};

@NgModule({
  declarations: [
    AppComponent,
    VocabCardComponent,
    CaptureImageComponent,
    OverlayContainerComponent,
    ContainerItemComponent,
    ButtonBarComponent,
    SavedVocabContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    WebcamModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    MatProgressSpinnerModule,
    NgxRerenderModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ loading: loadingReducer })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
