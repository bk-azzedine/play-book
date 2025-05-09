import {HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import {catchError, Observable, throwError, switchMap, take, tap} from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectToken } from '../../store/selectors/auth.selector';
import { AuthService } from '../services/auth/auth.service';
import {LoginSuccess, RefreshSuccess} from '../../store/actions/auth.actions';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const store = inject(Store);
  const authService = inject(AuthService);

  // Bypass everything (including token) for login and refresh
  if (req.url.includes('auth/authenticate') || req.url.includes('auth/refresh')) {
    return next(req);
  }

  // Attach token but skip refresh handling for logout
  if (req.url.includes('auth/logout')) {
    return store.select(selectToken).pipe(
      take(1),
      switchMap(token => {
        const authReq = token ? addTokenToRequest(req, token) : req;
        return next(authReq);
      })
    );
  }

  // Regular token attachment + refresh logic
  return store.select(selectToken).pipe(
    take(1),
    switchMap(token => {
      const authReq = token ? addTokenToRequest(req, token) : req;

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.log('Token expired, attempting refresh using cookie');

            return authService.refreshAccess().pipe(
              tap(response => console.log('Token refreshed successfully')),
              switchMap(res => {
                store.dispatch(RefreshSuccess({ token: res.token, user: res.user }));
                const newAuthReq = addTokenToRequest(req, res.token);
                return next(newAuthReq);
              }),
              catchError(refreshError => {
                console.error('Token refresh failed', refreshError);
                return throwError(() => new Error('Session expired. Please login again.'));
              })
            );
          }

          return throwError(() => error);
        })
      );
    })
  );
}
function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    headers: req.headers.set('Authorization', `${token}`)
  });
}
