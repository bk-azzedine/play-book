import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';

import {
  RegisterFailure,
  RegisterSuccess,
  CompanyActionTypes,
  LoadCompaniesSuccess,
  LoadCompaniesFailure, LoadSelectedCompany, LoadSelectedCompanySuccess, LoadSelectedCompanyFailure
} from '../actions/company.actions';
import {catchError, exhaustMap, map, of, switchMap, tap, withLatestFrom} from 'rxjs';
import {CompanyService} from '../../core/services/company/company.service';
import {select, Store} from '@ngrx/store';
import {selectUserId} from '../selectors/auth.selector';
import {filter, take} from 'rxjs/operators';
import {selectSelectedCompany} from '../selectors/company.selector';



@Injectable()
export class CompanyEffect {
  private  actions$ = inject(Actions);
  private companyService = inject(CompanyService);
  private store = inject(Store);


  registerCompany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CompanyActionTypes.Register),
      exhaustMap((action) =>
        this.companyService.registerCompany(action.company).pipe(
          map(response => {
           console.log(RegisterSuccess({company: response}));
            return RegisterSuccess({
              company: {
                organizationId: response.organizationId,
                owner: response.owner,
                name: response.name,
                field: response.field,
                teams: response.teams,
                color: response.color,
                initial: response.initial,
              }
            });
          }),
          catchError(error => {
            return of(RegisterFailure( error?.error.message ));
          })
        )
      )
    );
  });

  loadCompaniesWithStructure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CompanyActionTypes.LoadCompanies),
      // Wait until userId is available in the store
      switchMap(action => // Use switchMap to combine action trigger with waiting for userId
        this.store.pipe(
          select(selectUserId),
          filter(userId => userId != null), // Filter out null/undefined userId values
          take(1) // Take the first non-null userId emitted
        )
      ),
      // Now that we have a valid userId, proceed with the API call
      exhaustMap((userId) => { // userId is now guaranteed to be non-null
        console.log('Proceeding with loadCompaniesWithStructure$, userId:', userId);
        return this.companyService.getRelatedCompanies(userId!).pipe( // Use non-null assertion if needed, though filter should guarantee it
          map(companies => LoadCompaniesSuccess({ companies })),
          catchError(error => {
            console.error('Error loading companies:', error);
            return of(LoadCompaniesFailure({ error }));
          })
        );
      })
    );
  });
  loadSelectedCompany$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CompanyActionTypes.LoadSelectedCompany),
      // Wait until userId and selectedCompany are available in the store
      switchMap(action =>
        this.store.pipe(
          select(selectUserId),
          withLatestFrom(this.store.select(selectSelectedCompany)), // Combine with selectedCompany
          filter(([userId, selectedCompany]) => userId != null && selectedCompany != null && selectedCompany.organizationId != null), // Ensure both are non-null and selectedCompany has an ID
          take(1) // Take the first non-null userId and selectedCompany with an ID
        )
      ),
      // Now that we have a valid userId and selectedCompany with an ID, proceed with the API call
      exhaustMap(([userId, selectedCompany]) => { // Destructure to get both userId and selectedCompany
        const companyId = selectedCompany!.organizationId; // Extract the ID from the selectedCompany
        console.log('Proceeding with getSelectedCompany$, userId:', userId, 'companyId:', companyId);
        return this.companyService.getSelectedCompany(userId!, companyId!).pipe( // Pass both IDs to the service
          map(company => LoadSelectedCompanySuccess({ selectedCompany: company })),
          catchError(error => {
            console.error('Error loading selected company:', error);
            return of(LoadSelectedCompanyFailure({ error }));
          })
        );
      })
    );
  });

}
