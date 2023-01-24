import { Component } from '@angular/core';
import { AnnotationService } from './services/annotation/annotation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'flash-app';

  hasAnnotation = false;

  constructor(private annotationService: AnnotationService) {
    this.annotationService.annotationCreated.subscribe((hasAnnotation) => {
      this.hasAnnotation = hasAnnotation;
    });
  }

  ngOnInit() {}

}
