import { User } from "../models/User";

export interface LoginResponse {
  success: boolean; 
  token?: string; 
  user?: User; 
  error?: {
    code?: number; 
    message: string; 
    fields?: string[]; 
  };
}
