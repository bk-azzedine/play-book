import { Component } from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {bootstrapPerson} from '@ng-icons/bootstrap-icons';
import {lucideLogOut} from '@ng-icons/lucide';

@Component({
  selector: 'app-user-menu',
  imports: [
    NgIcon
  ],
  providers: [
    provideIcons({bootstrapPerson, lucideLogOut})
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent {

}
