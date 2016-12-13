import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'mq-panel',
  styleUrls: ['panel.component.css'],
  template: '<ng-content></ng-content>'
})
export class PanelComponent {

  @Input() open = false;

  constructor() {}

}
