import {inject, Injectable} from '@angular/core';
import {HttpService} from '../../../shared/services/http.service';
import {Company} from '../../../store/models/company.model';
import {map, Observable} from 'rxjs';
import {Team} from '../../../store/models/team.model';
import {HttpParams, HttpResponse} from '@angular/common/http';
import {TeamInviteRequest} from '../../requests/team-invite.request';
import {User} from '../../../store/models/user.model';
import {MultipleTeamInviteRequest} from '../../requests/multiple-team-invite.request';

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
            description: data.body?.description,
            companyId: data.body?.organization_id,
            spaces : data.body?.spaces,
            members: data.body?.members

          };
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
  decline(inviteId: string):Observable<string> {
    return this.httpService.post<HttpResponse<any>>(`org/team/invite/decline/${inviteId}`, null).pipe(
      map((result: HttpResponse<any>) => {
        return result.body.response;
      }))
  }

  inviteMultiple(teamInvites: MultipleTeamInviteRequest): Observable<string[]> {
    return this.httpService.post<HttpResponse<any>>('org/team/invite/multiple', teamInvites).pipe(
      map((result: HttpResponse<any>) => {
        if (Array.isArray(result.body)) {
          return result.body.map((item: { response: string }) => item.response);
        }

        console.warn('Unexpected response body format for inviteMultiple:', result.body);
        return []; // Return an empty array or throw an error if this is an invalid state
      })
    );
  }
  getTeamMembers(userIds: string[]): Observable<User[]> {
    let params = new HttpParams();
    userIds.forEach(id => {
      params = params.append('ids', id); // multiple 'ids' params allowed
    });

    return this.httpService.get<User[]>('user/team/members', { params }).pipe(
      map((response: User[] | any) => {
        return response.body ? response.body : response;
      })
    );
  }
}
