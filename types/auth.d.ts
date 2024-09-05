import { User } from "./user";

export interface AuthResponse {
  data?: { token: string; user: User };
  success: boolean;
  errorMessage?: "AUTHENTICATION_ERROR" | "NETWORK_ERROR" | "UNKNOWN_ERROR";
}

export type SignInResult = {
  success: boolean;
  error?: "AUTHENTICATION_ERROR" | "NETWORK_ERROR" | "UNKNOWN_ERROR";
};


