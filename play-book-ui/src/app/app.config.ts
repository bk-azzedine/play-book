import {ApplicationConfig, provideZoneChangeDetection, isDevMode} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {authReducer} from './store/reducers/auth.reducer';
import {AuthEffects} from './store/effects/auth.effects';
import {UserEffects} from './store/effects/user.effects';
import {provideRouterStore, routerReducer} from '@ngrx/router-store';
import {RouterEffects} from './store/effects/router.effects';
import {authInterceptor} from './core/interceptors/auth.interceptor';
import {CompanyEffect} from './store/effects/company.effect';
import {companyReducer} from './store/reducers/company.reducer';
import {TeamEffect} from './store/effects/team.effect';
import {DocumentEffects} from './store/effects/document.effects';
import {CookieService} from 'ngx-cookie-service';
import { principalStorageMetaReducer} from './store/reducers/meta-reducers/auth.meta-reducer';
import {companyStorageMetaReducer} from './store/reducers/meta-reducers/company.meta-reducer';
import {documentReducer} from './store/reducers/document.reducer';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    CookieService,
    provideRouter(routes),
    provideStore(
      {
        auth: authReducer,
        company: companyReducer,
        documents: documentReducer,
      },
      {
        metaReducers: [
          principalStorageMetaReducer,
          companyStorageMetaReducer
        ]
      }
    ),
    provideEffects([
      AuthEffects,
      CompanyEffect,
      UserEffects,
      RouterEffects,
      TeamEffect,
      DocumentEffects
    ]),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // If set to true, the connection is established within the Angular zone
    }),]
};
