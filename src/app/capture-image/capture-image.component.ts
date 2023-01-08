import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { AnnotationService } from '../services/annotation/annotation.service';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-capture-image',
  templateUrl: './capture-image.component.html',
  styleUrls: ['./capture-image.component.scss'],
})
export class CaptureImageComponent implements AfterViewInit {
  @Input() image?: WebcamImage;
  @Output() imageChange = new EventEmitter<WebcamImage>();

  cameraIcon = fontawesome.faCamera;
  deleteIcon = fontawesome.faCamera;
  screenHeight: number = 0;
  screenWidth: number = 0;

  private trigger: Subject<void> = new Subject<void>();

  constructor(private annotationService: AnnotationService) {
    this.getScreenSize();
  }

  ngAfterViewInit(): void {
    this.annotationService.setUp('captured-image');
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.image = webcamImage;
    this.imageChange.emit(this.image);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  deleteImage(): void {
    this.image = undefined;
    this.imageChange.emit(this.image);
    this.annotationService.clearAnnotations();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    console.log(this.screenWidth, this.screenHeight);
  }

  getScreenWidth() {
    return this.screenWidth;
  }
}
