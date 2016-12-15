import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { HomeComponent } from './home.component';
import { HomeToolbarComponent } from './home-toolbar.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomeToolbarComponent
  ],
  exports: [
    HomeComponent,
    HomeToolbarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule.forRoot()
  ],
  providers: []
})
export class HomeModule { }
