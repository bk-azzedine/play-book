import {Routes} from '@angular/router';
import {LoginPageComponent} from './features/login/login-page/login-page.component';
import {SignUpPageComponent} from './features/register/sign-in-page/sign-up-page.component';
import {
  AccountVerificationPageComponent
} from './features/account-activation/account-verification-page/account-verification-page.component';
import {tokenGuard} from './core/guards/token-guard/token.guard';
import {OnboardingPageComponent} from './features/onboarding/onboarding-page/onboarding-page/onboarding-page.component';
import {
  OnboardingWelcomeComponent
} from './features/onboarding/onboarding-components/onboarding-welcome/onboarding-welcome.component';
import {
  OnboardingCompanyComponent
} from './features/onboarding/onboarding-components/onboarding-company/onboarding-company.component';
import {onboardingGuard} from './core/guards/onboarding/onboarding.guard';
import {
  OnboardingTeamsComponent
} from './features/onboarding/onboarding-components/onboarding-teams/onboarding-teams.component';
import {
  OnboardingTeamsInviteComponent
} from './features/onboarding/onboarding-components/onboarding-team-invites/onboarding-teams-invite.component';
import {
  OnboardingFinishedComponent
} from './features/onboarding/onboarding-components/onboarding-finished/onboarding-finished.component';
import {HomePageComponent} from './features/home/home-page/home-page.component';
import {RecentDocumentsComponent} from './features/home/home/documents/recent-documents/recent-documents.component';
import {DocumentComponent} from './features/home/home/document/document.component';
import {
  ChooseOrganizationPageComponent
} from './features/choose-organization/choose-organization-page/choose-organization-page.component';
import {SpaceComponent} from './features/home/home/space/space.component';
import {SpacesComponent} from './features/home/home/spaces/spaces.component';
import {TeamsComponent} from './features/home/home/teams/teams.component';
import {TeamComponent} from './features/home/home/team/team.component';
import {
  ForgotPasswordPageComponent
} from './features/forgot-password/forgot-password-page/forgot-password-page.component';
import {EnterEmailComponent} from './features/forgot-password/enter-email/enter-email.component';
import {EnterResetCodeComponent} from './features/forgot-password/enter-reset-code/enter-reset-code.component';
import {ChangePasswordComponent} from './features/forgot-password/change-password/change-password.component';
import {AllDocumentsComponent} from './features/home/home/documents/all-documents/all-documents.component';
import {DraftDocumentsComponent} from './features/home/home/documents/draft-documents/draft-documents.component';
import {
  FavoriteDocumentsComponent
} from './features/home/home/documents/favorite-documents/favorite-documents.component';
import {InviteComponent} from './features/invite/invite.component';


export const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'invite', component: InviteComponent},
  {
    path: 'forgot-password', component: ForgotPasswordPageComponent, children: [
      {
        path: 'email',
        component: EnterEmailComponent
      },
      {
        path: 'enter-code',
        component: EnterResetCodeComponent

      },
      {
        path: 'reset-password/:id',
        component: ChangePasswordComponent

      }
    ]
  },
  {path: 'signup/:inviteId', component: SignUpPageComponent},
  {path: 'signup', component: SignUpPageComponent},
  {path: 'activate-account', component: AccountVerificationPageComponent},
  {
    path: 'onboarding', component: OnboardingPageComponent, children: [
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
      },
      {
        path: 'welcome',
        component: OnboardingWelcomeComponent,
      },
      {
        path: 'company',
        component: OnboardingCompanyComponent,
      },
      {
        path: 'teams',
        component: OnboardingTeamsComponent,
      },
      {
        path: 'teams/invite',
        component: OnboardingTeamsInviteComponent
      },
      {
        path: 'finished',
        component: OnboardingFinishedComponent
      }
    ]
    ,
    canActivate: [tokenGuard, onboardingGuard]
  },
  {
    path: 'organizations',
    component: ChooseOrganizationPageComponent
  },

  {
    path: 'home',
    children: [
      {
        path: '',
        component: RecentDocumentsComponent,
      },
      {
        path: 'all',
        component: AllDocumentsComponent,
      },
      {
        path: 'favorites',
        component: FavoriteDocumentsComponent,
      },
      {
        path: 'drafts',
        component: DraftDocumentsComponent,
      },
      {
        path: 'document/new',
        component: DocumentComponent,

      },
      {
        path: 'document/:id',
        component: DocumentComponent,

      },
      {
        path: 'spaces',
        component: SpacesComponent,

      },
      {
        path: 'space/:id',
        component: SpaceComponent
      },
      {
        path: 'teams',
        component: TeamsComponent,

      },
      {
        path: 'team/:id',
        component: TeamComponent
      }
    ],
    component: HomePageComponent
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];
``
