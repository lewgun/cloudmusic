import {Component}     from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';


import {ProfileComponent} from '../profile/profile.component'

@Component({
    directives: [RouterOutlet]
    
})
@RouteConfig([
  {path:'/',    name: 'Profile',   component: ProfileComponent, useAsDefault: true}
])
export class DashboardComponent {
    
}