import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild,
} from '@angular/core';
import { WebcamComponent, WebcamImage } from 'ngx-webcam';
import {
  Subject,
  Observable,
  timer,
  BehaviorSubject,
  debounceTime,
} from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as fontawesome from '@fortawesome/free-solid-svg-icons';
import { AnnotationService } from '../services/annotation/annotation.service';
import { AfterViewInit, ChangeDetectorRef } from '@angular/core';

interface Size {
  width: number;
  height: number;
}

@Component({
  selector: 'app-capture-image',
  templateUrl: './capture-image.component.html',
  styleUrls: ['./capture-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptureImageComponent implements AfterViewInit {
  observer!: ResizeObserver;
  cameraSize$ = new BehaviorSubject<Size>({ width: 0, height: 0 });
  cameraValid = false;

  @Input() image?: WebcamImage;
  @Input() cameraWidth = 0;
  @Input() cameraHeight = 0;

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
  private trigger: Subject<void> = new Subject<void>();

  constructor(
    private annotationService: AnnotationService,
    private cdr: ChangeDetectorRef,
    private host: ElementRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.observer = new ResizeObserver((entries) => {
      this.zone.run(() => {
        this.cameraValid = false;
        this.cameraWidth = entries[0].contentRect.width;
        (this.cameraHeight = entries[0].contentRect.height),
          this.cameraSize$.next({
            width: this.cameraWidth,
            height: this.cameraHeight,
          });
      });
    });

    this.observer.observe(this.host.nativeElement);
    this.cameraSize$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        console.log('cameraSize received', value.width, value.height);

        if (this.camera?.videoInitialized) {
          console.log('rerender camera');
          this.rerender();
        } else {
          console.log('did not rerender camera');
        }

        this.cameraValid = true;

        timer(1000).subscribe(() => {
          this.videoOptions = this.generateVideoConstraints();
          this.cdr.detectChanges();
        });
      });
  }

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
    console.log(
      'get videoOptions. width',
      this._videoOptions.width,
      'height',
      this._videoOptions.height
    );

    return this._videoOptions;
  }

  private generateVideoConstraints() {
    const result: MediaTrackConstraints = {
      width: { min: this.cameraWidth, ideal: this.cameraWidth },
      height: { min: this.cameraHeight, ideal: this.cameraHeight },
    };

    if (this.facingMode && this.facingMode !== '') {
      result.facingMode = { ideal: this.facingMode };
    }
    return result;
  }

  ngOnDestroy() {
    this.observer.unobserve(this.host.nativeElement);
  }
}
