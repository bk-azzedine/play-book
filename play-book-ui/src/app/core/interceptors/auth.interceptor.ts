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

  // Skip auth for login requests
  if (req.url.includes('auth/authenticate') || req.url.includes('auth/refresh')) {
    return next(req);
  }

  return store.select(selectToken).pipe(
    take(1),
    switchMap(token => {
      // Add token if available
      const authReq = token ? addTokenToRequest(req, token) : req;

      // Process the request with token
      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.log('Token expired, attempting refresh using cookie');

            // No need to get refresh token from store since it's in a cookie
            return authService.refreshAccess().pipe(
              tap(response => console.log('Token refreshed successfully')),
              switchMap(res => {

                store.dispatch(RefreshSuccess({token: res.token, user: res.user}));

                // Retry the original request with new token
                const newAuthReq = addTokenToRequest(req, res.token);
                console.log('Retrying original request with new token');
                return next(newAuthReq);
              }),
              catchError(refreshError => {
                console.error('Token refresh failed', refreshError);
                // Here you might want to redirect to login
                // For example: router.navigate(['/login']);
                return throwError(() => new Error('Session expired. Please login again.'));
              })
            );
          }

          // For other errors, just pass them through
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
