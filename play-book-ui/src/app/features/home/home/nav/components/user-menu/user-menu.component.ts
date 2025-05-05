import {Component, inject} from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {bootstrapPerson} from '@ng-icons/bootstrap-icons';
import {lucideLogOut} from '@ng-icons/lucide';
import {Store} from '@ngrx/store';
import {Logout} from '../../../../../../store/actions/auth.actions';

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
  store = inject(Store)

  logOut() {
    this.store.dispatch(Logout())
  }
}
