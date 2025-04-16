import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {OnboardingPageComponent} from './features/onboarding/onboarding-page/onboarding-page/onboarding-page.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'play-book-ui';

}
