import {Component}     from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';


import {UserInfoComponent} from '../user-info/user-info.component'

@Component({
    directives: [ROUTER_DIRECTIVES],
    templateUrl: "dashboard/dashboard.component.html"

})
@RouteConfig([
    { path: '/', name: 'UserInfo', component: UserInfoComponent, useAsDefault: true },
    { path: '/userinfo', name: 'UserInfo', component: UserInfoComponent }
])
export class DashboardComponent {

}