import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {HlmMenuComponent} from '@spartan-ng/ui-menu-helm';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {Team} from '../../../../../../store/models/team.model';
import {selectUserTeams} from '../../../../../../store/selectors/teams.selector';
import {Navigate} from '../../../../../../store/actions/router.actions';
import {NgForOf, SlicePipe} from '@angular/common';
import {heroUsers} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-team-menu',
  imports: [
    HlmMenuComponent,
    NgIcon,
    NgForOf,
    SlicePipe
  ],
  providers: [
    provideIcons(
      {heroUsers}
    )
  ],
  templateUrl: './team-menu.component.html',
  styleUrl: './team-menu.component.css'

})
export class TeamMenuComponent implements OnInit, OnDestroy {

  store = inject(Store);
  private subscriptions = new Subscription();
  userTeams: Team[] = [];
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }
  ngOnInit(): void {
     this.subscriptions.add(
       this.store.select(selectUserTeams).subscribe(teams =>
      this.userTeams = teams || []))
    }

    viewTeam(team: string ): void {
    this.store.dispatch(Navigate({path: ['home', 'team', team]}))
    }


  goToTeams() {
    this.store.dispatch(Navigate({path: ['home', 'teams']}));
  }
}
