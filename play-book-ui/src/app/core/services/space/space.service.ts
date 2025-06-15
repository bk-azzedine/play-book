import {inject, Injectable} from '@angular/core';
import {HttpService} from '../../../shared/services/http.service';
import {Team} from '../../../store/models/team.model';
import {map, Observable} from 'rxjs';
import {SpaceRequest} from '../../requests/space.request';
import {Space} from '../../../store/models/Space.model';
import {SpaceUpdateRequest} from '../../requests/space-update.request';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {

  httpService= inject(HttpService);
  createSpace(space: SpaceRequest): Observable<Space> {
    return this.httpService.post<any>("org/space", space).pipe(
      map(data => {
        if (data) {
          const space: Space = {
            spaceId: data.body?.space_id,
            name: data.body?.name,
            description: data.body?.description,
            icon: data.body?.icon,
            visibility: data.body?.visibility,
            teamId: data.body?.team_id,
            members: data.body?.members
          }
          return space;
        }
        throw new Error('No data received from the server');
      })
    );
  }
  updateSpace(space: SpaceUpdateRequest): Observable<Space> {
    return this.httpService.post<any>("org/space/update", space).pipe(
      map(data => {
        if (data) {
          const space: Space = {
            spaceId: data.body?.space_id,
            name: data.body?.name,
            description: data.body?.description,
            icon: data.body?.icon,
            visibility: data.body?.visibility,
            teamId: data.body?.team_id,
            members: data.body?.members
          }
          return space;
        }
        throw new Error('No data received from the server');
      })
    );
  }
  deleteSpace(space: string): Observable<string> {
    return this.httpService.delete<any>(`org/space/delete/${space}`).pipe(
      map(res => {
        if (res) {
          return res;
        }
        throw new Error('No data received from the server');
      })
    );
  }
}
