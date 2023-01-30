import { Component } from '@angular/core';
import { AnnotationService } from './services/annotation/annotation.service';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'flash-app';

  showContainer = false;
  showSaved = false;
  showCamera = true;

  constructor(private annotationService: AnnotationService) {
    this.annotationService.annotationCreated.subscribe((hasAnnotation) => {
      this.showContainer = hasAnnotation;
    });
  }

  ngOnInit() {}

  onCancel() {
    this.showContainer = false;
  }

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
