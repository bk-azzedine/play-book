import {Component, inject, OnInit} from '@angular/core';
import {MiniNavComponent} from '../components/mini-nav/mini-nav.component';
import {CompaniesComponent} from '../components/companies/companies.component';
import {NgForOf} from '@angular/common';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {Company} from '../../../store/models/company.model';
import {LoadCompanies} from '../../../store/actions/company.actions';
import {selectAllCompanies} from '../../../store/selectors/company.selector';

@Component({
  selector: 'app-choose-organization-page',
  imports: [
    MiniNavComponent,

    CompaniesComponent,
    NgForOf
  ],
  templateUrl: './choose-organization-page.component.html',
  styleUrl: './choose-organization-page.component.css'
})
export class ChooseOrganizationPageComponent implements OnInit {
  orgs: Company[] = [];
  store = inject(Store);

  private subscription: Subscription | undefined;

  constructor() {
    this.subscription = this.store.select(selectAllCompanies).subscribe(orgs => {
      this.orgs = orgs;
    });
  }

  ngOnInit(): void {
    this.loadRecentDocs();
  }

  loadRecentDocs(): void {
    this.store.dispatch(LoadCompanies());
  }

}
