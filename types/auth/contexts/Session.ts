import { User } from "../models/User";

export interface Session {
  user?: User;
  token?: string;
  refreshToken?: string;
  isAuthenticated: boolean;
}