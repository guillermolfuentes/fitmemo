import { User } from "../models/User";

export interface Session {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}