import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-container-item',
  templateUrl: './container-item.component.html',
  styleUrls: ['./container-item.component.scss']
})
export class ContainerItemComponent {
  @Output() cancel = new EventEmitter<boolean>();

  onCancel() {
    console.log('ContainerItemComponent: cancel');
    this.cancel.emit(true);
  }
}
