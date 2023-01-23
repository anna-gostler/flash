import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-overlay-container',
  templateUrl: './overlay-container.component.html',
  styleUrls: ['./overlay-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayContainerComponent {
  @HostBinding('style.top') public topPosition: string;

  resizingActive: boolean = false;
  mouseMoveHandler: (() => void) | undefined;
  touchMoveHandler: (() => void) | undefined;
  private minTop: number = 20;
  private defaultTop: number = 450;

  constructor(private renderer: Renderer2) {
    this.topPosition = window.innerHeight - this.defaultTop + 'px';
  }

  activateResize() {
    console.log('Call: activateResize');
    this.resizingActive = true;
    this.mouseMoveHandler = this.renderer.listen(
      document,
      'mousemove',
      (event) => this.onMouseMove(event)
    );

    this.touchMoveHandler = this.renderer.listen(
      document,
      'touchmove',
      (event) => this.onTouchMove(event)
    );
  }

  @HostListener('window:mouseup', ['$event'])
  @HostListener('window:touchup', ['$event'])
  deActivateResize($event: MouseEvent) {
    console.log('Call: deActivateResize');
    this.resizingActive = false;
    this.unsubscribeHandlers();
  }

  onMouseMove(event: MouseEvent) {
    if (this.resizingActive) {
      this.topPosition = this.calcTopPosition(event.clientY);
    }
  }

  onTouchMove(event: TouchEvent) {
    if (this.resizingActive) {
      let touchObj = event.changedTouches[0];

      if (this.resizingActive) {
        this.topPosition = this.calcTopPosition(touchObj.clientY);
      }
    }
  }

  private calcTopPosition(clientY: number): string {
    const topPos = Math.max(clientY, this.minTop);
    return Math.min(topPos, window.innerHeight - this.minTop) + 'px';
  }

  private unsubscribeHandlers() {
    if (this.mouseMoveHandler) {
      this.mouseMoveHandler();
    }
    if (this.touchMoveHandler) {
      this.touchMoveHandler();
    }
  }
}
