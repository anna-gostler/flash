import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'flash-app';
  hasImage: boolean = false;

  ngOnInit() {}

  onImageChange($event: boolean) {
    this.hasImage = $event;
  }
}
