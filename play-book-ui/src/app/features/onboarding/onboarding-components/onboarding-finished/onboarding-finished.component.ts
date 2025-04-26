import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Store} from '@ngrx/store';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {bootstrapPerson} from '@ng-icons/bootstrap-icons';



@Component({
  selector: 'app-onboarding-finished',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HlmButtonDirective
  ],
  providers: [
    provideIcons({bootstrapPerson})
  ],
  templateUrl: './onboarding-finished.component.html',
  styleUrl: './onboarding-finished.component.css'
})
export class OnboardingFinishedComponent {
     store = inject(Store);



}
