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
import { Subject, Observable, BehaviorSubject, debounceTime } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
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

  @Output() imageChange = new EventEmitter<boolean>();
  @ViewChild('camera') camera?: WebcamComponent;
  @ViewChild('capturedImage') capturedImage?: ElementRef;
  @ViewChild('cameraContainer', { read: ElementRef })
  cameraContainer!: ElementRef;

  cameraIcon = fontawesome.faCamera;
  deleteIcon = fontawesome.faRedo;
  facingMode: string = 'environment';

  videoOptions: MediaTrackConstraints = {};
  private trigger: Subject<void> = new Subject<void>();

  constructor(
    private annotationService: AnnotationService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.observer = new ResizeObserver((entries) => {
      this.zone.run(() => {
        this.cameraValid = false;

        const w = entries[0].contentRect.width;
        const h = entries[0].contentRect.height;

        if (w === 0 && h === 0) {
          return;
        }

        this.cameraSize$.next({
          width: w,
          height: h,
        });
      });
    });

    this.observer.observe(document.body);

    this.cameraSize$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        console.log('cameraSize received', value.width, value.height);

        this.videoOptions = this.generateVideoConstraints(
          value.width,
          value.height
        );
        this.cameraValid = true;
        this.cdr.detectChanges();
      });
  }

  ngAfterViewInit(): void {
    this.annotationService.setUp('captured-image');
    this.cdr.detectChanges();
  }

  triggerSnapshot(): void {
    this.trigger.next();
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

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
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
    };

    if (this.facingMode && this.facingMode !== '') {
      result.facingMode = { ideal: this.facingMode };
    }
    return result;
  }

  ngOnDestroy() {
    this.observer.unobserve(document.body);
  }
}
