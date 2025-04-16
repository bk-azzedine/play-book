import {inject, Injectable} from '@angular/core';
import {Company} from '../../../store/models/company.model';
import {map, Observable} from 'rxjs';
import {HttpService} from '../../../shared/services/http.service';
import {User} from '../../../store/models/user.model';

@Injectable({
  providedIn: 'root'
})

export class CompanyService {
  httpService= inject(HttpService);
  registerCompany(company: Company): Observable<Company> {
    return this.httpService.post<any>("org/company", company).pipe(
      map(data => {
        if (data && data.body) {
          const responseCompany: Company = {
            organizationId: data.body.organizationId,
            ownerId: data.body.ownerId,
            name: data.body?.name,
            field: data.body?.field
          };
          console.log(responseCompany);
          return responseCompany;
        }
        else {
          throw new Error('Invalid server response');
        }
      })
    );
  }
}
