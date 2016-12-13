import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelComponent } from './panel';

@NgModule({
  declarations: [
    PanelComponent
  ],
  exports: [
    PanelComponent
  ],
  imports: [
    CommonModule
  ],
  providers: []
})
export class SharedModule { }
