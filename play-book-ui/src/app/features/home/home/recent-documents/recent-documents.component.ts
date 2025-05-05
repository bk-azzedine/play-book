import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {DocCardComponent} from './components/doc-card/doc-card.component';
import { NgForOf} from '@angular/common';
import {Document} from '../../../../store/models/document.model';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {bootstrapPlus} from '@ng-icons/bootstrap-icons';
import {lucidePlus} from '@ng-icons/lucide';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {loadRecentDocuments} from '../../../../store/actions/document.actions';
import { NgScrollbarModule } from 'ngx-scrollbar';
import {Navigate} from '../../../../store/actions/router.actions';
import {selectUserId} from '../../../../store/selectors/auth.selector';
import {selectSelectedCompany} from '../../../../store/selectors/company.selector';
import {take} from 'rxjs/operators';
import {selectRecentUserDocuments} from '../../../../store/selectors/document.selector';
@Component({
  selector: 'app-recent-documents',
  imports: [
    DocCardComponent,
    NgForOf,
    HlmButtonDirective,
    NgIcon,
    NgScrollbarModule
  ],
  providers: [
    provideIcons({bootstrapPlus, lucidePlus})
  ],
  templateUrl: './recent-documents.component.html',
  styleUrl: './recent-documents.component.css'
})
export class RecentDocumentsComponent implements OnInit {
  docs: Document[] = [];
  store = inject(Store);
  user: string | undefined
  organization: string | undefined
  private subscription: Subscription | undefined;

  constructor() {
    this.store.select(selectUserId).pipe(take(1)).subscribe(userId => {
     this.user = userId;
    });

    this.store.select(selectSelectedCompany).pipe(take(1)).subscribe(company => {
      this.organization = company?.organizationId
    });
    this.subscription = this.store.select(selectRecentUserDocuments(this.user!, this.organization!)).subscribe(doc => {
      this.docs = doc;

    });
  }

  ngOnInit(): void {
    this.loadRecentDocs();
  }

  loadRecentDocs(): void {
    this.store.dispatch(loadRecentDocuments());
  }


  create() {
    this.store.dispatch(Navigate({path: "home/create"}))
  }
}
