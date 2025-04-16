import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { selectIsLoggedIn } from '../../../store/selectors/auth.selector';
import { map, take } from 'rxjs/operators';
import {JwtService} from '../../services/jwt/jwt.service';

export const validationGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);

  return store.select(selectIsLoggedIn).pipe(
      take(1),
      map(isLoggedIn => {
        return isLoggedIn;

      })
  );
};
