//https://dzone.com/articles/completing-the-angular-2-quick-start-in-vs-code-1
import {Component, OnInit} from 'angular2/core';

import {FluxBoot} from "../../services/flux/flux-boot"

import {
    RouteConfig,
    ROUTER_DIRECTIVES,
    ROUTER_PROVIDERS
} from 'angular2/router';

import {LoginComponent} from '../login/login.component';
import {DashboardComponent} from '../dashboard/dashboard.component';

@RouteConfig([
    { path: "/login", name: "Login", component: LoginComponent , useAsDefault: true },

    // dashboard child route
    { path: "/dashboard/...", name: "Dashboard", component: DashboardComponent /*, useAsDefault: true*/}
])
@Component({
    selector: 'app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    directives: [LoginComponent, DashboardComponent, ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS, FluxBoot]
})
export class AppComponent implements OnInit {
    constructor( private _: FluxBoot) {

    }

    ngOnInit() {
    }
}