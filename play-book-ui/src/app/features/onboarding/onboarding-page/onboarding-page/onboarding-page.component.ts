import {Component, inject, OnInit} from '@angular/core';
import {ProgressBarComponent} from '../../shared/progress-bar/progress-bar.component';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {Store} from '@ngrx/store';
import {filter} from 'rxjs/operators';
import {map} from 'rxjs';

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
  router = inject(Router)

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).urlAfterRedirects),
      filter(url => url.startsWith('/onboarding/'))
    ).subscribe(() => {
      this.number++;
    });
  }

}
