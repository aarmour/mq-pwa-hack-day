import { AppShellModule } from '@angular/app-shell';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RootComponent } from './root';

import { MapModule } from './map';
import { DashboardModule } from './dashboard';

import {MaterialModule} from '@angular/material';

@NgModule({
    bootstrap: [RootComponent],
    declarations: [
        RootComponent
    ],
    imports: [
        AppShellModule,
        CommonModule,
        MaterialModule.forRoot(),
        DashboardModule,
        MapModule,
    ]
})
export class AppModule { }
