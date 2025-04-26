import {HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectToken } from '../../store/selectors/auth.selector';
import { switchMap, take } from 'rxjs/operators';
import {AuthService} from '../services/auth/auth.service';
import {LoginSuccess} from '../../store/actions/auth.actions';


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const store = inject(Store);
  const authService = inject(AuthService);

  if(req.url.includes('auth/authenticate')){
    return next(req);
  }

  return store.select(selectToken).pipe(
    take(1),
    switchMap(token => {
      // Clone the request with the current token
      const authReq = token ? addTokenToRequest(req, token) : req;

      // Execute the request with the token
      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          // If 401 Unauthorized, try to refresh the token
          if (error.status === 401) {
            return handleUnauthorizedError(req, next);
          }

          return throwError(() => error);
        })
      );
    })
  );
  function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return req.clone({
      headers: req.headers.set('Authorization', `${token}`)
    });
  }

  function handleUnauthorizedError(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {

    return authService.refreshAccess().pipe(
      switchMap(newToken => {
        store.dispatch(LoginSuccess({token: newToken}));
        const newReq = addTokenToRequest(req, newToken);
        return next(newReq);
      }),
      catchError(refreshError => {
        return throwError(() => refreshError);
      })
    );
  }
}
