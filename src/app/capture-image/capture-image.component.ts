import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { WebcamComponent, WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { AnnotationService } from '../services/annotation/annotation.service';
import { AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-capture-image',
  templateUrl: './capture-image.component.html',
  styleUrls: ['./capture-image.component.scss'],
})
export class CaptureImageComponent implements AfterViewInit {
  @Input() image?: WebcamImage;
  @Output() imageChange = new EventEmitter<WebcamImage>();
  @ViewChild('camera') camera?: WebcamComponent;
  @ViewChild('capturedImage') capturedImage?: ElementRef;

  cameraIcon = fontawesome.faCamera;
  deleteIcon = fontawesome.faCamera;
  screenHeight: number = 0;
  screenWidth: number = 0;
  isPortrait: boolean = false;
  imageRatio: number = 0;

  private trigger: Subject<void> = new Subject<void>();

  constructor(
    private annotationService: AnnotationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.fitToScreen();
    this.annotationService.setUp('captured-image');
    this.cdr.detectChanges();
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
  fitToScreen() {
    console.log('fit to screen');

    this.screenHeight = document.body.clientHeight;
    this.screenWidth = document.body.clientWidth;
    if (window.innerHeight > window.innerWidth) {
      this.isPortrait = true;
    } else {
      this.isPortrait = false;
    }
    console.log(this.screenWidth, this.screenHeight);
    // this.setCameraSize();
    // this.setCapturedImageSize();
    this.cdr.detectChanges();
  }

  setCameraSize() {
    if (this.camera) {
      if (this.isPortrait) {
        this.camera.width = this.screenWidth;
        this.camera.height = this.camera.width / this.imageRatio;
      } else {
        this.camera.height = this.screenHeight;
        this.camera.width = this.imageRatio * this.camera.height;
      }

      console.log('camera wxh', this.camera.width, this.camera.height);
    } else {
      console.log('camera element not found');
    }
  }

  setCapturedImageSize() {
    if (this.capturedImage && this.camera) {
      this.capturedImage.nativeElement.width = this.camera.width;
      this.capturedImage.nativeElement.height =
        this.camera.width / this.imageRatio;
    } else {
      console.log('capturedImage element not found');
    }
  }

  // TODO size instead of width and height
  get cameraWidth() {
    this.setRatio();

    let width = this.screenWidth;

    if (!this.isPortrait) {
      if (this.camera) {
        width = this.imageRatio * this.camera.height;
      } else if (this.capturedImage?.nativeElement) {
        width = this.imageRatio * this.capturedImage?.nativeElement.height;
      }
    }

    if (this.camera) {
      this.camera.width = width;
    }
    //console.log('get width', width);

    return width;
  }

  get cameraHeight() {
    this.setRatio();

    //console.log('getting height', this.screenHeight);
    let height = this.screenHeight;
    if (this.isPortrait) {
      if (this.camera) {
        this.camera.height = this.camera.width / this.imageRatio;
      } else if (this.capturedImage?.nativeElement) {
        height = this.capturedImage.nativeElement.width / this.imageRatio;
      }
    }
    if (this.camera) {
      this.camera.height = height;
    }
    //console.log('get height', height);

    return height;
  }

  private setRatio() {
    /*
    if (this.camera &&
      !this.imageRatio &&
      this.camera.width !== 0 &&
      this.camera.height !== 0) {
      this.imageRatio = this.camera.width / this.camera.height;
      console.log('set ratio', this.imageRatio);
    }*/
    this.imageRatio = 4/3;
  }
}
