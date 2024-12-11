import { User } from "../models/User";

export interface LoginResponse {
  message: string;
  token?: string;
  user?: User;
}
