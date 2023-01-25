import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
  QueryList,
  Renderer2,
} from '@angular/core';
import { ContainerItemComponent } from '../container-item/container-item.component';
import { VocabCardComponent } from '../vocab-card/vocab-card.component';

@Component({
  selector: 'app-overlay-container',
  templateUrl: './overlay-container.component.html',
  styleUrls: ['./overlay-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayContainerComponent {
  @HostBinding('style.top') public topPosition: string;
  // TODO: enable this for any child component that supports container item functionality
  @ContentChildren(VocabCardComponent)
  templates!: QueryList<ContainerItemComponent>;
  @Output() cancel = new EventEmitter<boolean>();

  ngAfterContentInit() {
    this.templates.forEach((template) => {
      template.cancel.subscribe(() => this.onCancel());
    });
  }

  resizingActive: boolean = false;
  mouseMoveHandler: (() => void) | undefined;
  touchMoveHandler: (() => void) | undefined;
  mouseUpHandler: (() => void) | undefined;
  touchUpHandler: (() => void) | undefined;

  private minDistTop: number = 20;
  private minDistBottom: number = 100;

  constructor(private renderer: Renderer2) {
    this.topPosition = window.innerHeight / 2 + 'px';
  }

  activateResize() {
    console.log('Call: activateResize');
    this.resizingActive = true;
    this.listenForMove();
    this.listenForMoveEnd();
  }

  deActivateResize(_$event: MouseEvent) {
    console.log('Call: deActivateResize');
    this.resizingActive = false;
    this.unsubscribeMoveHandlers();
    this.unsubscribeEndHandlers();
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

  onCancel() {
    console.log('onCancel');
    this.cancel.emit(true);
  }

  private calcTopPosition(clientY: number): string {
    const topPos = Math.max(clientY, this.minDistTop);
    return Math.min(topPos, window.innerHeight - this.minDistBottom) + 'px';
  }

  private unsubscribeMoveHandlers() {
    this.unsubscribeHandler(this.mouseMoveHandler);
    this.unsubscribeHandler(this.touchMoveHandler);
  }

  private unsubscribeEndHandlers() {
    this.unsubscribeHandler(this.mouseUpHandler);
    this.unsubscribeHandler(this.touchUpHandler);
  }

  private unsubscribeHandler(handler: (() => void) | undefined) {
    if (handler) {
      handler();
    }
  }

  private listenForMove() {
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

  private listenForMoveEnd() {
    this.mouseUpHandler = this.renderer.listen(document, 'mouseup', (event) =>
      this.deActivateResize(event)
    );

    this.touchUpHandler = this.renderer.listen(document, 'touchup', (event) =>
      this.deActivateResize(event)
    );
  }
}
