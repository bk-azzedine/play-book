import { inject, Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

import { HttpService } from '../../../shared/services/http.service';
import { Credentials } from '../../../store/models/credentials.model';
import { JwtService } from '../jwt/jwt.service';
import {User} from '../../../store/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpService = inject(HttpService);
  private jwtService = inject(JwtService);
  private cookieService = inject(CookieService);

  login(credentials: Credentials): Observable<{ token: string, user: User  }> {
    return this.httpService.post<any>('auth/authenticate', credentials, {
      observe: 'response',
      withCredentials: true
    }).pipe(
      map((res: HttpResponse<any>) => {
        const token: string | null = res.headers.get('Authorization');
        const user: User  = res.body;
        if (!token) {
          throw new Error('Authorization token is missing from the response headers.');
        }
        return { token, user };
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  validateAccount(code: string): Observable<{ token: string }> {
    const payload = { code };

    return this.httpService.post<any>('auth/validate/code', payload, {
      observe: 'response'
    }).pipe(
      map((res: HttpResponse<any>) => {
        const token: string | null = res.headers.get('Authorization');
        if (!token) {
          throw new Error('Authorization token is missing from the response headers.');
        }
        return { token };
      }),
      catchError(error => {
        console.error('Account validation failed:', error);
        return throwError(() => error);
      })
    );
  }

  resendCode(): Observable<string> {
    return this.httpService.post<any>('auth/resend/code', null).pipe(
      map((result: any) => {
        if (!result || !result.code) {
          throw new Error('Code is missing from the response');
        }
        return result.code;
      }),
      catchError(error => {
        console.error('Resend code failed:', error);
        return throwError(() => error);
      })
    );
  }

  refreshAccess(): Observable<{ token: string, user: User  }> {
    return this.httpService.post<any>('auth/refresh-token', null, {
      withCredentials: true,
      observe: 'response'
    }).pipe(
      map((res: HttpResponse<any>) => {
        const token: string | null = res.headers.get('Authorization');
        const user: User  = res.body;
        if (!token) {
          throw new Error('Authorization token is missing from the response headers.');
        }
        return { token, user };
      }),
      catchError(error => {
        console.error('Failed to refresh access token:', error);
        return throwError(() => new Error('Failed to refresh token'));
      })
    );
  }

  logOut(): Observable<void> {
    return this.httpService.post<any>('auth/logout', null, {
      observe: 'response',
      withCredentials: true
    }).pipe(
      map(() => {
        this.cookieService.deleteAll();
        return;
      }),
      catchError(error => {
        console.error('Logout failed:', error);
        return throwError(() => error);
      })
    );
  }
}
