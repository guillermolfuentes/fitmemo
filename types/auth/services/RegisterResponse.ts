import { User } from "../models/User";

export interface RegisterResponse {
  message: string;
  token: string;
  user?: User;
}




