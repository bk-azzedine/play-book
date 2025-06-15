import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {DocCardComponent} from '../shared-components/doc-card/doc-card.component';
import {NgForOf} from '@angular/common';
import {NgIcon} from '@ng-icons/core';
import {Document} from '../../../../../store/models/document.model';
import {Store} from '@ngrx/store';
import {combineLatest, Subscription} from 'rxjs';
import {selectUserId} from '../../../../../store/selectors/auth.selector';
import {take} from 'rxjs/operators';
import {selectSelectedCompany} from '../../../../../store/selectors/company.selector';
import {
  selectAllUserFavoriteDocuments,
  selectRecentUserDocuments
} from '../../../../../store/selectors/document.selector';
import {loadFavoriteDocuments, loadRecentDocuments} from '../../../../../store/actions/document.actions';
import {Navigate} from '../../../../../store/actions/router.actions';

@Component({
  selector: 'app-favorite-documents',
  imports: [
    DocCardComponent,
    NgForOf,
    NgIcon
  ],
  templateUrl: './favorite-documents.component.html',
  styleUrl: './favorite-documents.component.css'
})
export class FavoriteDocumentsComponent implements OnInit, OnDestroy {
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
          this.loadFavoriteDocs();
          this.subscribeToFavoriteDocs();
        }
      })
    );
  }

  private subscribeToFavoriteDocs(): void {
    if (!this.user || !this.organization) {
      return;
    }

    this.subscription.add(
      this.store.select(selectAllUserFavoriteDocuments(this.user, this.organization))
        .subscribe(docs => {
          this.docs = docs;
        })
    );
  }

  loadFavoriteDocs(): void {
    this.store.dispatch(loadFavoriteDocuments());
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
