import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  SimpleChanges,
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
  @Input() cameraHeight: number = 100;
  @Input() cameraWidth: number = 100;
  @Output() imageChange = new EventEmitter<WebcamImage>();
  @ViewChild('camera') camera?: WebcamComponent;
  @ViewChild('capturedImage') capturedImage?: ElementRef;
  @ViewChild('cameraContainer', { read: ElementRef })
  cameraContainer!: ElementRef;

  cameraIcon = fontawesome.faCamera;
  deleteIcon = fontawesome.faCamera;
  isPortrait: boolean = false;

  private trigger: Subject<void> = new Subject<void>();

  constructor(
    private annotationService: AnnotationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
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

  get ratio() {
    return 4 / 3;
  }
}
