import { User } from "../models/User";

export interface LoginResponse {
  message: string;
  token?: string;
  refreshToken?: string;
  user?: User;
}
