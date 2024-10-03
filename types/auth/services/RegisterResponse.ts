import { User } from "../models/User";

export interface RegisterResponse {
  success: boolean; 
  token?: string; 
  user?: User;
  error?: {
    code: number; 
    message: string; 
    fields?: string[]; 
  };
}




