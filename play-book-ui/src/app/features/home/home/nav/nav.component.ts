import { Component } from '@angular/core';
import { HlmAvatarComponent, HlmAvatarFallbackDirective, } from '@spartan-ng/ui-avatar-helm';

import {BrnMenuTriggerDirective} from '@spartan-ng/brain/menu';
import {TeamMenuComponent} from './components/team-menu/team-menu.component';
import {SpaceMenuComponent} from './components/space-menu/space-menu.component';
import {UserMenuComponent} from './components/user-menu/user-menu.component';
@Component({
  selector: 'app-nav',
  imports: [
    HlmAvatarComponent,
    TeamMenuComponent,
    UserMenuComponent,
    SpaceMenuComponent,
    HlmAvatarComponent,
    BrnMenuTriggerDirective,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

}
