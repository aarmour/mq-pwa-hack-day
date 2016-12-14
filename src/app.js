"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var app_shell_1 = require("@angular/app-shell");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var material_1 = require("@angular/material");
var root_1 = require("./root");
var map_1 = require("./map");
var dashboard_1 = require("./dashboard");
var shared_1 = require("./shared");
var home_1 = require("./home");
var appRoutes = [
    { path: '', component: home_1.HomeComponent }
];
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        bootstrap: [root_1.RootComponent],
        declarations: [
            root_1.RootComponent
        ],
        imports: [
            app_shell_1.AppShellModule,
            common_1.CommonModule,
            router_1.RouterModule.forRoot(appRoutes),
            material_1.MaterialModule.forRoot(),
            dashboard_1.DashboardModule,
            shared_1.SharedModule,
            home_1.HomeModule,
            map_1.MapModule,
        ],
        providers: [
            { provide: common_1.APP_BASE_HREF, useValue: '/' }
        ]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
