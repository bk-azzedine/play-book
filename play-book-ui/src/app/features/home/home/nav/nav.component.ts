import { Component } from '@angular/core';
import { HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective } from '@spartan-ng/ui-avatar-helm';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemCheckboxDirective,
  HlmMenuItemCheckComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemRadioComponent,
  HlmMenuItemRadioDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';
import {BrnMenuTriggerDirective} from '@spartan-ng/brain/menu';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmIconDirective} from '@spartan-ng/ui-icon-helm';
import {TeamMenuComponent} from './components/team-menu/team-menu.component';
import {SpaceMenuComponent} from './components/space-menu/space-menu.component';
import {UserMenuComponent} from './components/user-menu/user-menu.component';
@Component({
  selector: 'app-nav',
  imports: [
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
    HlmAvatarImageDirective,
    BrnMenuTriggerDirective,
    HlmMenuComponent,
    HlmSubMenuComponent,
    HlmMenuItemDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuShortcutComponent,
    HlmMenuSeparatorComponent,
    HlmMenuItemIconDirective,
    HlmMenuItemCheckComponent,
    HlmMenuItemRadioComponent,
    HlmMenuGroupComponent,
    HlmMenuItemRadioDirective,
    HlmMenuItemCheckboxDirective,
    HlmButtonDirective,
    HlmIconDirective,
    TeamMenuComponent,
    SpaceMenuComponent,
    UserMenuComponent,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

}
