import { User } from "../models/User";

export interface AuthResponse {
  success: boolean; 
  token?: string; 
  user?: User;
  errorMessage?: "AUTHENTICATION_ERROR" | "BAD_REQUEST_ERROR" | "NETWORK_ERROR" | "UNKNOWN_ERROR";
}




