import {Component, inject, OnInit} from '@angular/core';
import {ProgressBarComponent} from '../../shared/progress-bar/progress-bar.component';
import {RouterOutlet} from '@angular/router';
import {CommService} from '../../../../core/services/comm/comm.service';
import {Navigate} from '../../../../store/actions/router.actions';
import {Store} from '@ngrx/store';
import {OnboardingWelcomeComponent} from '../../onboarding-components/onboarding-welcome/onboarding-welcome.component';
import {RegisterCompany} from '../../../../store/actions/company.actions';
import {CreateTeam} from '../../../../store/actions/team.actions';
import {selectCompanyId} from '../../../../store/selectors/company.selector';
import {take} from 'rxjs/operators';
import {map} from 'rxjs';
import {Team} from '../../../../store/models/team.model';

@Component({
  selector: 'app-onboarding-page',
  imports: [
    ProgressBarComponent,
    RouterOutlet,
  ],
  standalone: true,
  templateUrl: './onboarding-page.component.html',
  styleUrl: './onboarding-page.component.css'
})
export class OnboardingPageComponent implements OnInit {
  number = 1
  store = inject(Store)
  commService = inject(CommService);

  ngOnInit(): void {
    this.commService.onComRequest(message => {
      switch (message.messageType) {
        case 'Navigation':
          this.number = this.number + 1;
          this.store.dispatch(Navigate({path: message.message}));
          break;
        case 'Company':
          this.number = this.number + 1;
          this.store.dispatch(RegisterCompany({company: message.message}))
          break;
        case 'Team':
          this.number = this.number + 1;
          this.store.select(selectCompanyId).pipe(
            take(1),
            map(companyId => {
              const team = {
                ...message.message,
                organizationId: companyId
              };
              console.log(team)
              this.store.dispatch(CreateTeam({team: team}));
            })
          ).subscribe();


      }

    });
  }


}
