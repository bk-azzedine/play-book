import {Component, inject, OnInit} from '@angular/core';
import { HlmAvatarComponent, HlmAvatarFallbackDirective, } from '@spartan-ng/ui-avatar-helm';

import {BrnMenuTriggerDirective} from '@spartan-ng/brain/menu';
import {TeamMenuComponent} from './components/team-menu/team-menu.component';
import {SpaceMenuComponent} from './components/space-menu/space-menu.component';
import {UserMenuComponent} from './components/user-menu/user-menu.component';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {Space} from '../../../../store/models/Space.model';
import {selectTeamSpaces, selectUserSpaces} from '../../../../store/selectors/company.selector';
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
    RouterLink,
  ],
  templateUrl: './nav.component.html',
  standalone: true,
  styleUrl: './nav.component.css'
})
export class NavComponent {





}
