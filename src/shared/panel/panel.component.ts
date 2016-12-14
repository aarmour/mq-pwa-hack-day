import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'mq-panel',
  styleUrls: ['panel.component.css'],
  templateUrl: 'panel.component.html'
})
export class PanelComponent {

  @Input() open = false;

  constructor() {}

}
