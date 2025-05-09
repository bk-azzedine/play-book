import {Component} from '@angular/core';
import {SpaceMenuComponent} from "../../../home/home/nav/components/space-menu/space-menu.component";
import {TeamMenuComponent} from "../../../home/home/nav/components/team-menu/team-menu.component";
import {UserMenuComponent} from "../../../home/home/nav/components/user-menu/user-menu.component";
import {HlmAvatarComponent, HlmAvatarFallbackDirective} from '@spartan-ng/ui-avatar-helm';

import {BrnMenuTriggerDirective} from '@spartan-ng/brain/menu';

@Component({
  selector: 'app-mini-nav',
  imports: [
    HlmAvatarComponent,
    UserMenuComponent,
    HlmAvatarComponent,
    BrnMenuTriggerDirective,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
  ],
  templateUrl: './mini-nav.component.html',
  styleUrl: './mini-nav.component.css'
})
export class MiniNavComponent {

}
