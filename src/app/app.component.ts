import { Component, Input } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import * as Tesseract from 'tesseract.js';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'flash-app';
}
