import { AppShellModule } from '@angular/app-shell'
import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AppModule } from './app';
import { RootComponent } from './root';

import { Storage, LocalStorage } from './storage';


@NgModule({
  bootstrap: [RootComponent],
  imports: [
    BrowserModule,
    AppShellModule.runtime(),
    AppModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: Storage, useClass: LocalStorage },
  ]
})
export class AppBrowserModule {}
