import {Routes} from '@angular/router';
import {LoginPageComponent} from './features/login/login-page/login-page.component';
import {SignUpPageComponent} from './features/register/sign-in-page/sign-up-page.component';
import {
  AccountVerificationPageComponent
} from './features/account-activation/account-verification-page/account-verification-page.component';
import {validationGuard} from './core/guards/validation-guard/validation.guard';
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
import {RecentDocumentsComponent} from './features/home/home/recent-documents/recent-documents.component';
import {ViewDocumentComponent} from './features/home/home/view-document/view-document.component';
import {CreateDocumentComponent} from './features/home/home/create-document/create-document.component';
import {
  ChooseOrganizationPageComponent
} from './features/choose-organization/choose-organization-page/choose-organization-page.component';


export const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
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
        path:'finished',
        component: OnboardingFinishedComponent
      }
    ]
    ,
    canActivate: [tokenGuard, onboardingGuard]
  },
  {
    path: 'organizations',
    component : ChooseOrganizationPageComponent
  },

  {
    path:'home',
    children:[
      {path:'',
         component: RecentDocumentsComponent,
      },
      {
        path: "view",
        component: ViewDocumentComponent,
      },
      {
        path: "create",
        component: CreateDocumentComponent,
      }
    ],
    component: HomePageComponent
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', redirectTo: 'login', pathMatch: 'full'}
];
