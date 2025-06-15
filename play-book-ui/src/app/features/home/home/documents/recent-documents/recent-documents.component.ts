import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {DocCardComponent} from '../shared-components/doc-card/doc-card.component';
import { NgForOf} from '@angular/common';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {bootstrapPlus} from '@ng-icons/bootstrap-icons';
import {lucidePlus} from '@ng-icons/lucide';
import {Store} from '@ngrx/store';
import {Subscription, combineLatest} from 'rxjs';
import {selectUserId} from '../../../../../store/selectors/auth.selector';
import {take} from 'rxjs/operators';
import {selectRecentUserDocuments} from '../../../../../store/selectors/document.selector';
import {Navigate} from '../../../../../store/actions/router.actions';
import {loadRecentDocuments} from '../../../../../store/actions/document.actions';
import {selectSelectedCompany} from '../../../../../store/selectors/company.selector';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {Document} from '../../../../../store/models/document.model';
@Component({
  selector: 'app-recent-documents',
  imports: [
    NgForOf,
    HlmButtonDirective,
    NgIcon,
    NgScrollbarModule,
    DocCardComponent
  ],
  providers: [
    provideIcons({bootstrapPlus, lucidePlus})
  ],
  templateUrl: './recent-documents.component.html',
  standalone: true,
  styleUrl: './recent-documents.component.css'
})
export class RecentDocumentsComponent implements OnInit, OnDestroy {
  docs: Document[] = [];
  store = inject(Store);
  user: string | undefined;
  organization: string | undefined;
  private subscription = new Subscription();

  constructor() {
    // Constructor should only handle basic initialization
  }

  ngOnInit(): void {
    this.loadUserDataAndDocs();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadUserDataAndDocs(): void {
    // First get user and organization data
    this.subscription.add(
      combineLatest([
        this.store.select(selectUserId).pipe(take(1)),
        this.store.select(selectSelectedCompany).pipe(take(1))
      ]).subscribe(([userId, company]) => {
        this.user = userId;
        this.organization = company?.organizationId;

        if (this.user && this.organization) {
          this.loadRecentDocs();
          this.subscribeToRecentDocs();
        }
      })
    );
  }

  private subscribeToRecentDocs(): void {
    if (!this.user || !this.organization) {
      return;
    }

    this.subscription.add(
      this.store.select(selectRecentUserDocuments(this.user, this.organization))
        .subscribe(docs => {
          this.docs = docs;
        })
    );
  }

  loadRecentDocs(): void {
    this.store.dispatch(loadRecentDocuments());
  }

  create(): void {
    this.store.dispatch(Navigate({path: "home/document/new"}));
  }

  view(doc: string): void {
    this.store.dispatch(Navigate({path: ['home', 'document', doc]}));
  }

  viewAll() {
    this.store.dispatch(Navigate({path: "home/all"}));
  }
}
