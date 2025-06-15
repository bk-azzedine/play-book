import {Component, inject, OnInit} from '@angular/core'; // Add OnInit
import {ActivatedRoute} from '@angular/router'; // Import ActivatedRoute
import {
  LoginRegisterIllustrationComponent
} from "../../../shared/components/login-register-illustration/login-register-illustration.component";
import {SignUpFormComponent} from '../sign-up-form/sign-up-form.component';
import {User} from '../../../store/models/user.model';
import {Store} from '@ngrx/store';

import {Navigate} from '../../../store/actions/router.actions';
import {RegisterUser, RegisterUserWithInvite} from '../../../store/actions/user.actions';

@Component({
  selector: 'app-sign-up-page',
  standalone: true, // Assuming this is a standalone component
  imports: [
    LoginRegisterIllustrationComponent,
    SignUpFormComponent
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.css'
})
export class SignUpPageComponent implements OnInit { // Implement OnInit
  store = inject(Store);
  private route = inject(ActivatedRoute); // Inject ActivatedRoute

  inviteId: string | null = null; // Property to hold the inviteId

  ngOnInit(): void {
    // Extract inviteId from route parameters when the component initializes
    this.route.paramMap.subscribe(params => {
      this.inviteId = params.get('inviteId');
    });
  }

  onRegister(user: User) {
    if(this.inviteId) {
      console.log("fuck you nigga")
      this.store.dispatch(RegisterUserWithInvite({user: user, inviteId:this.inviteId}));
    } else {
      this.store.dispatch(RegisterUser({user: user}));
    }


  }

  handleSignIn() {
    this.store.dispatch(Navigate({path: '/login'}));
  }
}
