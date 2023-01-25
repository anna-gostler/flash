import { Component, Input } from '@angular/core';
import { ButtonConfig } from '../models/config.model';

@Component({
  selector: 'app-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss']
})
export class ButtonBarComponent {
  @Input()
  config?: ButtonConfig[];

}
