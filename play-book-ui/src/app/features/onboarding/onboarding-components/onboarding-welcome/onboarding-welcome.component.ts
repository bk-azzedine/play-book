import {Component, inject, OnInit, output} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {BrnProgressComponent, BrnProgressIndicatorComponent} from '@spartan-ng/brain/progress';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmProgressDirective, HlmProgressIndicatorDirective} from '@spartan-ng/ui-progress-helm';
import {ProgressBarComponent} from '../../shared/progress-bar/progress-bar.component';
import {CommService} from '../../../../core/services/comm/comm.service';
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
   commService = inject(CommService);
   store = inject(Store);


  onSubmit(){
    this.store.dispatch(Navigate({path:'onboarding/company'}));
  }
}
