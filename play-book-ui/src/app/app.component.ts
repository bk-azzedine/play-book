import {Component, Inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {OnboardingPageComponent} from './features/onboarding/onboarding-page/onboarding-page/onboarding-page.component';
import {Store} from '@ngrx/store';
import {LoadCompanies} from './store/actions/company.actions';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'play-book-ui';


}
