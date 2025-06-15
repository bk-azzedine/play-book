import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'; // Import Router
import { Subject } from 'rxjs'; // For managing subscriptions
import { takeUntil, filter } from 'rxjs/operators';
import {Navigate} from '../../../../store/actions/router.actions';
import {NgClass} from '@angular/common';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {radixDashboard} from '@ng-icons/radix-icons';
import {heroHeart, heroPencilSquare} from '@ng-icons/heroicons/outline'; // For managing subscriptions and filtering events

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  imports: [
    NgClass,
    NgIcon
  ],
  providers: [
    provideIcons({
      radixDashboard,
      heroPencilSquare,
      heroHeart
    })
  ],
  standalone: true,
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit, OnDestroy {
  selectedItem: string | null = null; // Initialize as null so nothing is selected by default

  store = inject(Store);
  route = inject(ActivatedRoute);
  router = inject(Router);

  private destroy$ = new Subject<void>(); // Used to unsubscribe observables

  ngOnInit(): void {
    // Subscribe to router events to update selectedItem based on the URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd), // Only care about end of navigation
      takeUntil(this.destroy$) // Unsubscribe when the component is destroyed
    ).subscribe((event: NavigationEnd) => {
      this.updateSelectedItem(event.urlAfterRedirects);
    });

    // Also call it once on init to set the initial state if the user navigates directly
    this.updateSelectedItem(this.router.url);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Helper method to determine the selected item based on the URL
  private updateSelectedItem(url: string): void {
    if (url.includes('home/favorites')) {
      this.selectedItem = 'favorites';
    } else if (url.includes('home/drafts')) {
      this.selectedItem = 'drafts';
    } else if (url === '/home' || url === '/') { // Check for base 'home' route or root
      this.selectedItem = 'main';
    } else {
      this.selectedItem = null; // No matching route, so deselect everything
    }
  }

  viewFavorites(): void {
    this.store.dispatch(Navigate({ path: 'home/favorites' }));
  }

  viewDrafts(): void {
    this.store.dispatch(Navigate({ path: 'home/drafts' }));
  }

  viewRecent(): void {
    this.store.dispatch(Navigate({ path: 'home' }));
  }
}
