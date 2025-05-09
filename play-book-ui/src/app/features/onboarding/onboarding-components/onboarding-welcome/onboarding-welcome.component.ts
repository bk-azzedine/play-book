import {Component, inject, OnInit, output} from '@angular/core';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {Store} from '@ngrx/store';
import {Navigate} from '../../../../store/actions/router.actions';

@Component({
  selector: 'app-onboarding-welcome',
  standalone: true,
  imports: [
    HlmButtonDirective,
  ],
  templateUrl: './onboarding-welcome.component.html',
  styleUrl: './onboarding-welcome.component.css'
})
export class OnboardingWelcomeComponent  {
   store = inject(Store);


  onSubmit(){
    this.store.dispatch(Navigate({path:'onboarding/company'}));
  }
}
