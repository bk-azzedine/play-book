import {User} from '../models/user.model';


export interface AuthState {
  token: string;
  isLoggedIn: boolean;
  user: User | null;
}
