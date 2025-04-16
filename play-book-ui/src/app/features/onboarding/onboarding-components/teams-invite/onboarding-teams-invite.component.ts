import {Component, input} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {BrnSelectImports} from '@spartan-ng/brain/select';
import {HlmSelectImports} from '@spartan-ng/ui-select-helm';
import {NgForOf} from '@angular/common';
import {Team} from '../../../../store/models/team.model';

@Component({
  selector: 'app-onboarding-teams-invite',
  imports: [
    ReactiveFormsModule,
    HlmFormFieldComponent,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    HlmButtonDirective,
    HlmLabelDirective,
    HlmInputDirective,
    BrnSelectImports,
    HlmSelectImports,
    NgForOf
  ],
  templateUrl: './onboarding-teams-invite.component.html',
  styleUrl: './onboarding-teams-invite.component.css'
})
export class OnboardingTeamsInviteComponent {
    store = inject(Store);


}
