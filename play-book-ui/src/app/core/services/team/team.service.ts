import {inject, Injectable} from '@angular/core';
import {HttpService} from '../../../shared/services/http.service';
import {Company} from '../../../store/models/company.model';
import {map, Observable} from 'rxjs';
import {Team} from '../../../store/models/team.model';
import {HttpResponse} from '@angular/common/http';
import {TeamInviteRequest} from '../../requests/team-invite.request';

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
            teamId: data.body?.team_id,
            name: data.body?.name,
            organizationId: data.body?.organization_id,
          };
          console.log(team);
          return team;
        }
        throw new Error('No data received from the server');
      })
    );
  }
  invite(teamInvite: TeamInviteRequest):Observable<string> {
    return this.httpService.post<HttpResponse<any>>('org/team/invite', teamInvite).pipe(
      map((result: HttpResponse<any>) => {
        return result.body.response;
      }))
  }
}
