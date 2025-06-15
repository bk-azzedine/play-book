import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Document} from '../../../../../store/models/document.model';
import {Store} from '@ngrx/store';
import {combineLatest, Subscription} from 'rxjs';
import {selectUserId} from '../../../../../store/selectors/auth.selector';
import {take} from 'rxjs/operators';
import {selectSelectedCompany} from '../../../../../store/selectors/company.selector';
import {selectAllUserDocuments, selectRecentUserDocuments} from '../../../../../store/selectors/document.selector';
import {
  loadAllDocuments
} from '../../../../../store/actions/document.actions';
import {Navigate} from '../../../../../store/actions/router.actions';
import {DocCardComponent} from '../shared-components/doc-card/doc-card.component';
import {NgForOf} from '@angular/common';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {lucidePlus} from '@ng-icons/lucide';
import {bootstrapPlus} from '@ng-icons/bootstrap-icons';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'app-all-documents',
  imports: [
    NgForOf,
    NgIcon,
    HlmButtonDirective,
    DocCardComponent
  ],
  providers:[
    provideIcons({bootstrapPlus, lucidePlus})  ],
  templateUrl: './all-documents.component.html',
  standalone: true,
  styleUrl: './all-documents.component.css'
})
export class AllDocumentsComponent implements OnInit, OnDestroy {
  docs: Document[] = [];
  store = inject(Store);
  user: string | undefined;
  organization: string | undefined;
  private subscription = new Subscription();

  constructor() {

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
          this.loadAllDocuments();
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
      this.store.select(selectAllUserDocuments(this.user, this.organization))
        .subscribe(docs => {
          this.docs = docs;
        })
    );
  }

  loadAllDocuments(): void {
    this.store.dispatch(loadAllDocuments());
  }

  create(): void {
    this.store.dispatch(Navigate({path: "home/document/new"}));
  }

  view(doc: string): void {
    this.store.dispatch(Navigate({path: ['home', 'document', doc]}));
  }

  viewRecent() {
    this.store.dispatch(Navigate({path: "home"}));
  }
}
