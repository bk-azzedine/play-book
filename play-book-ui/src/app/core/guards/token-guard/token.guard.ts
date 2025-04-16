import { CanActivateFn } from '@angular/router';
import {JwtService} from '../../services/jwt/jwt.service';
import {inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {selectIsLoggedIn, selectToken} from '../../../store/selectors/auth.selector';
import {take} from 'rxjs/operators';
import {map} from 'rxjs';

export const tokenGuard: CanActivateFn = (route, state) => {
  const  jwtService = inject(JwtService);
  const store = inject(Store);
 return  store.select(selectToken).pipe(
    take(1),
   map(token => jwtService.isUserEnabled(token))
  )

};
