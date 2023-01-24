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
  private minTop: number = 20;

  constructor(private renderer: Renderer2) {
    this.topPosition = window.innerHeight / 2 + 'px';
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

  onCancel() {
    console.log('onCancel');
    this.cancel.emit(true);
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
