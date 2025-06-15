import {inject, Injectable} from '@angular/core';
import {Company} from '../../../store/models/company.model';
import {map, Observable} from 'rxjs';
import {HttpService} from '../../../shared/services/http.service';
import {User} from '../../../store/models/user.model';
import {data} from 'autoprefixer';

@Injectable({
  providedIn: 'root'
})

export class CompanyService {
  httpService = inject(HttpService);

  registerCompany(company: Company): Observable<Company> {
    return this.httpService.post<any>("org/company", company).pipe(
      map(data => {
        if (data && data.body) {
          const responseCompany: Company = {
            organizationId: data.body.organizationId,
            owner: data.body.owner,
            name: data.body?.name,
            field: data.body?.field,
            teams: data.body.teams,
            color: data.body.color,
            initial: data.body.initial
          };
          return responseCompany;
        } else {
          throw new Error('Invalid server response');
        }
      })
    );
  }

  getRelatedCompanies(userId: string): Observable<Company[]> {
    return this.httpService.get<Company[]>(`org/company/all/${userId}`, null).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Invalid server response');
      })
    );
  }
  getSelectedCompany(userId: string, organizationId: string): Observable<Company> {
    return this.httpService.get<Company>(`org/company/${userId}/${organizationId}`, null).pipe(
      map(response => {
        if (response) {
          return response;
        }
        throw new Error('Invalid server response');
      })
    );
  }

}
