import {inject, Inject, Injectable} from '@angular/core';
import {HttpService} from '../../../shared/services/http.service';
import {Credentials} from '../../../store/models/credentials.model';
import {catchError, map, Observable, throwError} from 'rxjs';
import {httpResource, HttpResponse} from '@angular/common/http';
import {JwtService} from '../jwt/jwt.service';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private httpService = inject(HttpService);
    private jwtService = inject(JwtService);

  login(credentials: Credentials): Observable<{ token: string }> {
    return this.httpService.post<any>('auth/authenticate', credentials, {
      observe: 'response',
      withCredentials: true
    }).pipe(
      map<HttpResponse<any>, { token: string }>((res) => {
        const token: string | null = res.headers.get('Authorization');
        return { token: token ?? '' };
      })
    );
  }

  validateAccount(code: string): Observable<{ token: string }> {
    const payload = { code: code };

    return this.httpService.post<HttpResponse<any>>('auth/validate/code', payload).pipe(
      map((res: HttpResponse<any>) => {
        const token: string | null = res.headers.get('Authorization');

        if (token === null) {
          throw new Error('Authorization token is missing from the response headers.');
        }

        return { token };
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  resendCode():Observable<string> {
    return this.httpService.post<HttpResponse<any>>('auth/resend/code', null).pipe(
      map((result: HttpResponse<any>) => {
        return result.body.code;
      }))
  }
  refreshAccess(): Observable<string> {
    return this.httpService.post<any>("auth/refresh-token", null, {
      withCredentials: true,
      observe: 'response',
    }).pipe(
      map((res: HttpResponse<any>) => {
        const token: string | null = res.headers.get('Authorization');
        if (!token) {
          throw new Error('No authorization token received');
        }
        return token;
      }),
      catchError((error) => {
        console.error('Failed to refresh access token:', error);
        return throwError(() => new Error('Failed to refresh token'));
      })
    );
  }


}
