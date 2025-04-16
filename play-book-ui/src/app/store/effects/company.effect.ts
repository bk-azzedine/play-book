import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';

import {RegisterFailure, RegisterSuccess, CompanyActionTypes} from '../actions/company.actions';
import {catchError, exhaustMap, map, of, tap} from 'rxjs';
import {CompanyService} from '../../core/services/company/company.service';


@Injectable()
export class CompanyEffect {
  private  actions$ = inject(Actions);
  private companyService = inject(CompanyService);

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
                ownerId: response.ownerId,
                name: response.name,
                field: response.field
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

}
