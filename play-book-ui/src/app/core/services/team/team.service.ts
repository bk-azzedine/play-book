import {inject, Injectable} from '@angular/core';
import {HttpService} from '../../../shared/services/http.service';
import {Company} from '../../../store/models/company.model';
import {map, Observable} from 'rxjs';
import {Team} from '../../../store/models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  httpService= inject(HttpService);
  registerTeam(team: Team): Observable<Team> {
    return this.httpService.post<any>("org/team", team).pipe(
      map(data => {
        if (data) {
          const team: Team = {
            teamId: data.body?.teamId,
            name: data.body?.name,
            organizationId: data.body?.organizationId,
          };
        }
        return team;
      } )
    )

  }
}
