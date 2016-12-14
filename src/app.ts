import { AppShellModule } from '@angular/app-shell';
import { NgModule } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';

import { RootComponent } from './root';

import { MapModule } from './map';
import { DashboardModule } from './dashboard';
import { SharedModule } from './shared';
import { HomeModule, HomeComponent } from './home';

const appRoutes = [
  { path: '', component: HomeComponent }
];

@NgModule({
    bootstrap: [RootComponent],
    declarations: [
      RootComponent
    ],
    imports: [
      AppShellModule,
      CommonModule,
      RouterModule.forRoot(appRoutes),
      MaterialModule.forRoot(),
      DashboardModule,
      SharedModule,
      HomeModule,
      MapModule,
    ],
    providers: [
      { provide: APP_BASE_HREF, useValue: '/' }
    ]
})
export class AppModule { }
