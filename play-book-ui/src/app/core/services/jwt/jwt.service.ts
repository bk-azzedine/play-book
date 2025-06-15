import {Injectable} from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import {payload} from '../../../store/models/payload.model';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  isUserEnabled(token: string): boolean {
    try {
      const decoded: payload = jwtDecode(token);
      return decoded.activated;
    } catch (error) {
      return false;
    }
  }

  isUserSetUp(token: string): boolean {
    try {
      const decoded: payload = jwtDecode(token);
      const orgClaims = decoded.organizations;
      const teamClaims = decoded.teams;
      return (orgClaims && orgClaims.length > 0)  || (teamClaims  && teamClaims.length > 0);
    }
    catch (error) {
      return false;
    }
  }
}
