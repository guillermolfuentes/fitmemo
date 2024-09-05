import { User } from './user';

export interface Session {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}