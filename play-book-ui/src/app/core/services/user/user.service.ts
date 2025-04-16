import {inject, Injectable} from '@angular/core';
import {HttpService} from '../../../shared/services/http.service';
import {catchError, map, Observable, tap, throwError} from 'rxjs';
import {User} from '../../../store/models/user.model';
import {Store} from '@ngrx/store';
import {LoginSuccess} from '../../../store/actions/auth.actions';
import {HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private httpService = inject(HttpService);
  store = inject(Store);

  register(user: User): Observable<User> {
    return this.httpService.post<any>("user/register", user).pipe(
      map((res) => {
        const token: string | null = res.headers.get('Authorization');
        if (token) {
          this.store.dispatch(LoginSuccess({ token }));
        }
        const user: User = {
          user_id: res.body.user_id,
          firstName: res.body.firstName,
          lastName: res.body.lastName,
          email: res.body.email
        };
        return user;
      }),
      catchError((error) => {
        return throwError(()=> error);
      })
    );
  }

  checkEmail(email: string): Observable<boolean> {
    return this.httpService.get<boolean>(`user/check/${email}`).pipe(
      map((res) => {
        return res;
      })
    )
  }
}
