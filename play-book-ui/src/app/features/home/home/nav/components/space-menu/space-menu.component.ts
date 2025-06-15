import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {Space} from '../../../../../../store/models/Space.model';
import {selectTeamSpaces, selectUserSpaces} from '../../../../../../store/selectors/company.selector';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {
  heroPlus,
  heroXMark,
  heroUserPlus,
  heroGlobeAlt,
  heroLockClosed,
  heroScale,
  heroComputerDesktop,
  heroBanknotes,
  heroHeart,
  heroCodeBracket,
  heroBookOpen,
  heroBeaker,
  heroBriefcase,
  heroAcademicCap,
  heroRocketLaunch,
  heroShieldCheck,
  heroUserGroup,
  heroDocumentText,
  heroLightBulb
} from '@ng-icons/heroicons/outline';
import {Navigate} from '../../../../../../store/actions/router.actions';
import {NgForOf, NgIf, SlicePipe} from '@angular/common';
import {HlmMenuComponent} from '@spartan-ng/ui-menu-helm';


@Component({
  selector: 'app-space-menu',
  providers: [
    provideIcons({
      heroPlus,
      heroXMark,
      heroUserPlus,
      heroGlobeAlt,
      heroLockClosed,
      heroScale,
      heroComputerDesktop,
      heroBanknotes,
      heroHeart,
      heroCodeBracket,
      heroBookOpen,
      heroBeaker,
      heroBriefcase,
      heroAcademicCap,
      heroRocketLaunch,
      heroShieldCheck,
      heroUserGroup,
      heroDocumentText,
      heroLightBulb
    })
  ],
  imports: [
    NgIcon,
    NgForOf,
    NgIf,
    HlmMenuComponent,
    HlmMenuComponent,
    SlicePipe
  ],
  templateUrl: './space-menu.component.html',
  styleUrl: './space-menu.component.css'
})
export class SpaceMenuComponent implements OnInit, OnDestroy {
  store = inject(Store);
  private subscriptions = new Subscription();

  userSpaces: Space[] = [];
  teamSpaces: Space[] = [];

  icons: string[] = [

    'heroBookOpen',

    'heroLightBulb',

    'heroBeaker',

    'heroBriefcase',

    'heroAcademicCap',

    'heroRocketLaunch',

    'heroShieldCheck',

    'heroUserGroup',

    'heroDocumentText',

    'heroComputerDesktop',

    'heroScale',

    'heroBanknotes',

    'heroHeart',

    'heroCodeBracket'

  ];


  ngOnInit(): void {
    this.subscriptions.add(
      this.store.select(selectUserSpaces).subscribe(spaces =>
        this.userSpaces = spaces || []
      )
    );

    this.subscriptions.add(
      this.store.select(selectTeamSpaces).subscribe(spaces =>
        this.teamSpaces = spaces || []
      )
    );



  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }





  goToSpaces() {
    this.store.dispatch(Navigate({path: ['/home/spaces']}));
  }

  viewSpace(space: string) {
    this.store.dispatch(Navigate({path: ['home', 'space', space]}))
  }
}
