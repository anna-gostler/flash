import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { WebcamComponent, WebcamImage } from 'ngx-webcam';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { AnnotationService } from '../services/annotation/annotation.service';
import { AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-capture-image',
  templateUrl: './capture-image.component.html',
  styleUrls: ['./capture-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptureImageComponent implements AfterViewInit {
  @Input() image?: WebcamImage;

  @Output() imageChange = new EventEmitter<boolean>();
  @ViewChild('cameraContainer', { read: ViewContainerRef })
  cameraContainer?: ViewContainerRef;
  @ViewChild('cameraTemplate', { read: TemplateRef })
  cameraTemplate!: TemplateRef<any>;

  cameraWidth: number = 0;
  cameraHeight: number = 0;
  cameraIcon = fontawesome.faCamera;
  deleteIcon = fontawesome.faRedo;

  private _facingMode: string = 'environment';
  private _videoOptions: MediaTrackConstraints = {};
  private _trigger: Subject<void> = new Subject<void>();

  constructor(
    private annotationService: AnnotationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  createCameraComponent() {
    this.cameraWidth = window.innerWidth;
    this.cameraHeight = window.innerHeight;

    if (this.cameraContainer) {
      console.log('create CameraComponent');

      console.log(this.cameraWidth, this.cameraHeight);
      this._videoOptions = this.generateVideoConstraints(
        this.cameraWidth,
        this.cameraHeight
      );

     this.cameraContainer.createEmbeddedView<WebcamComponent>(this.cameraTemplate);

    } else {
      console.log('Could not create camera - cameraContainer not found');
    }
  }

  removeCameraComponent() {
    if (this.cameraContainer) {
      console.log('remove CameraComponent');
      this.cameraContainer.clear();
    }
  }

  ngAfterViewInit(): void {
    this.annotationService.setUp('captured-image');
    this.createCameraComponent();

    this.cdr.detectChanges();
  }

  triggerSnapshot(): void {
    this._trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.image = webcamImage;
    this.imageChange.emit(true);
  }

  deleteImage(): void {
    this.image = undefined;
    this.imageChange.emit(false);
    this.annotationService.clearAnnotations();
  }

  public get videoOptions(): MediaTrackConstraints {
    return this._videoOptions;
  }

  public set videoOptions(options: MediaTrackConstraints) {
    this._videoOptions = options;
  }

  public get triggerObservable(): Observable<void> {
    return this._trigger.asObservable();
  }

  private generateVideoConstraints(width: number, height: number) {
    const result: MediaTrackConstraints = {
      width: {
        min: width,
        ideal: width,
      },
      height: {
        min: height,
        ideal: height,
      },
      facingMode: { ideal: this._facingMode },
    };

    return result;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    this.removeCameraComponent();
    this.createCameraComponent();
  }
}
