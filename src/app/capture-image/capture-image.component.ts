import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { WebcamComponent, WebcamImage } from 'ngx-webcam';
import { Subject, Observable, timer } from 'rxjs';
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
  @Input()
  public set cameraHeight(val: number) {
    if (val === 0) {
      return;
    }
    this._cameraHeight = val;
    const result: MediaTrackConstraints = this.getVideoConstraints();

    let change = this.videoConstraintsChanged(result);

    if (change) {
      timer(100).subscribe(() => {
        this.rerender();
      });
    }
    timer(500).subscribe(() => {
      console.log('set options');
      this.videoOptions = result;
      this.cdr.detectChanges();
    });
  }
  private videoConstraintsChanged(result: MediaTrackConstraints) {
    let change = false;
    if (this._videoOptions && this._videoOptions !== result) {
      change = true;
    }
    return change;
  }

  public get cameraHeight(): number {
    return this._cameraHeight;
  }
  @Input()
  public set cameraWidth(val: number) {
    if (val === 0) {
      return;
    }
    this._cameraWidth = val;

    const result: MediaTrackConstraints = this.getVideoConstraints();
    timer(500).subscribe(() => {
      console.log('set options');
      this.videoOptions = result;
      this.cdr.detectChanges();
    });
  }

  public get cameraWidth(): number {
    return this._cameraWidth;
  }
  @Output() imageChange = new EventEmitter<WebcamImage>();
  @ViewChild('camera') camera?: WebcamComponent;
  @ViewChild('capturedImage') capturedImage?: ElementRef;
  @ViewChild('cameraContainer', { read: ElementRef })
  cameraContainer!: ElementRef;

  cameraIcon = fontawesome.faCamera;
  deleteIcon = fontawesome.faCamera;
  isPortrait: boolean = false;
  facingMode: string = 'environment';
  public triggerRerender: number = 0;

  private _videoOptions: MediaTrackConstraints = {};
  private _cameraWidth: number = 0;
  private _cameraHeight: number = 0;
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

  public rerender(): void {
    this.triggerRerender++;
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

  public set videoOptions(options: MediaTrackConstraints) {
    this._videoOptions = options;
  }

  public get videoOptions(): MediaTrackConstraints {
    console.log('get videoOptions. width', this._videoOptions.width);
    if (!this._videoOptions.width || !this._videoOptions.height) {
      return {};
    }
    return this._videoOptions;
  }

  private getVideoConstraints() {
    const result: MediaTrackConstraints = {
      width: { min: this._cameraWidth, ideal: this._cameraWidth },
      height: { min: this._cameraHeight, ideal: this._cameraHeight },
    };

    if (this.facingMode && this.facingMode !== '') {
      result.facingMode = { ideal: this.facingMode };
    }
    return result;
  }
}
