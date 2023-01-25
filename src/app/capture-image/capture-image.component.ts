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
import { Subject, Observable } from 'rxjs';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { AnnotationService } from '../services/annotation/annotation.service';
import { AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ButtonConfig } from '../models/config.model';

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
  @ViewChild('camera') camera?: WebcamComponent;

  cameraWidth: number = 0;
  cameraHeight: number = 0;

  private _facingMode: string = 'environment';
  private _videoOptions: MediaTrackConstraints = {};
  private _trigger: Subject<void> = new Subject<void>();

  constructor(
    private annotationService: AnnotationService,
    private cdr: ChangeDetectorRef
  ) {}

  createCameraComponent() {
    this.cameraWidth = window.innerWidth;
    this.cameraHeight = window.innerHeight;

    if (this.cameraContainer) {
      console.log('create CameraComponent');

      console.log(this.cameraWidth, this.cameraHeight);

      if (
        this.isMobile() &&
        window.matchMedia('(orientation: portrait)').matches
      ) {
        this._videoOptions = this.generateVideoConstraints(
          this.cameraHeight,
          this.cameraWidth
        );
      } else {
        this._videoOptions = this.generateVideoConstraints(
          this.cameraWidth,
          this.cameraHeight
        );
      }

      this.cameraContainer.createEmbeddedView<WebcamComponent>(
        this.cameraTemplate
      );
      if (this.camera) {
        console.log('Set variables directly');

        this.camera.videoOptions = this._videoOptions;
        this.cdr.detectChanges();
      }
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
    console.log('triggerSnapshot');
    this._trigger.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.image = webcamImage;
    this.imageChange.emit(true);
  }

  deleteImage(): void {
    console.log('deleteImage');
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

  private isMobile() {
    return /Android|iPhone/i.test(navigator.userAgent);
  }

  get buttonBarConfig(): ButtonConfig[] {
    return [
      {
        id: 'trigger',
        icon: fontawesome.faCamera,
        hide: !!this.image,
        callback: () => this.triggerSnapshot(),
      },
      {
        id: 'delete',
        icon: fontawesome.faRedo,
        hide: !this.image,
        callback: () => this.deleteImage(),
      },
    ];
  }
}
