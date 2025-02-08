import { User } from "../models/User";

export interface RegisterResponse {
  message: string;
  token: string;
  refreshToken: string;
  user?: User;
}




