import { Component } from '@angular/core';
import {NavComponent} from '../home/nav/nav.component';
import {SideComponent} from '../home/side/side.component';
import {HlmAvatarComponent, HlmAvatarImports} from '@spartan-ng/ui-avatar-helm';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
    NavComponent,
    SideComponent,
    HlmAvatarImports,
    RouterOutlet
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
