import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectToken } from '../../store/selectors/auth.selector';
import { switchMap, take } from 'rxjs/operators';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const store = inject(Store);

  return store.select(selectToken).pipe(
    take(1),
    switchMap(token => {
      const newReq = token
        ? req.clone({
          headers: req.headers.set('Authorization', `${token}`),
        })
        : req;

      return next(newReq);
    })
  );
}
