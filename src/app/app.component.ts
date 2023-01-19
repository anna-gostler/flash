import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'flash-app';

  public screenWidth: any;
  public screenHeight: any;
  public contentTopHeight: number = 100;
  public contentTopWidth: number = 100;
  public contentBottomHeight: number = 100;
  public contentBottomWidth: number = 100;
  private splitterHeight = 4;

  @ViewChild('contentTop', { read: ElementRef }) contentTop!: ElementRef;
  @ViewChild('contentBottom', { read: ElementRef }) contentBottom!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  ngAfterViewInit() {
    this.setContentSize();
    this.cdr.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    console.log('onResize');
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.setContentSize();
  }

  handleResizeEnd($event: { sizes: number[] }) {
    console.log('handleResizeEnd');

    this.contentTopHeight =
      ($event.sizes[0] / 100) * this.screenHeight - this.splitterHeight;

    this.contentBottomHeight =
      ($event.sizes[1] / 100) * this.screenHeight - this.splitterHeight;

    this.contentTopWidth = this.screenWidth;

    this.contentBottom.nativeElement.style.height =
      this.contentBottomHeight + 'px';
    this.contentTop.nativeElement.style.height = this.contentTopHeight + 'px';

    this.setContentSize();
  }

  setContentSize() {
    const topRect = this.contentTop.nativeElement
      .closest('.p-splitter-panel')
      .getBoundingClientRect();
    this.contentTopHeight = topRect.height;
    this.contentTopWidth = topRect.width;

    const bottomRect = this.contentBottom.nativeElement
      .closest('.p-splitter-panel')
      .getBoundingClientRect();
    this.contentBottomHeight = bottomRect.height;
    this.contentBottomWidth = bottomRect.width;

    this.contentTop.nativeElement.style.height = this.contentTopHeight + 'px';
    this.contentTop.nativeElement.style.width = this.contentTopWidth + 'px';
    this.contentBottom.nativeElement.style.height =
      this.contentBottomHeight + 'px';
    this.contentBottom.nativeElement.style.width =
      this.contentBottomWidth + 'px';
  }
}
