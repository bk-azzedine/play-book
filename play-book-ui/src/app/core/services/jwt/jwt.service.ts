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
      const claims = decoded.organizations;
      return claims && claims.length > 0;
    }
    catch (error) {
      return false;
    }
  }
}
