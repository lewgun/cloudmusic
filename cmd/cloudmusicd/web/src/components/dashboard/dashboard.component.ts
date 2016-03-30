import {Component}     from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';


import {ProfileComponent} from '../profile/profile.component'

@Component({
    directives: [ROUTER_DIRECTIVES],
    templateUrl: "dashboard/dashboard.component.html"

})
@RouteConfig([
    { path: '/', name: 'Profile', component: ProfileComponent, useAsDefault: true },
    { path: '/profile', name: 'Profile', component: ProfileComponent }
])
export class DashboardComponent {

}