import {inject, Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http:HttpClient = inject(HttpClient);
  readonly baseUrl = 'http://localhost:8080/api';

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`);
  }
  post<T>(url: string, body: any, options?: any): Observable<HttpResponse<T>> {
    const mergedOptions: {
      observe: 'response';
      [key: string]: any;
    } = {
      observe: 'response',
      ...options
    };

    return this.http.post<T>(`${this.baseUrl}/${url}`, body, mergedOptions);
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`);
  }
  patch<T>(url: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${url}`, body);
  }
}
