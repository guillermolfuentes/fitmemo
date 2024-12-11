import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { LoginRequest } from "@/types/auth/services/LoginRequest";
import { LoginResponse } from "@/types/auth/services/LoginResponse";
import { RegisterRequest } from "@/types/auth/services/RegisterRequest";
import { RegisterResponse } from "@/types/auth/services/RegisterResponse";
import { NetworkError } from "@/errors/NetworkError";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { UnknownError } from "@/errors/UnknownError";

class AuthService {
  constructor() {
    axios.interceptors.request.use((request) => {
      return request;
    });

    axios.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  public static async register(
    userData: RegisterRequest
  ): Promise<RegisterResponse> {
    try {
      const url_register = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/auth/register`;
      const response = await axios.post(url_register, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        AuthService.handleAxiosError(error);
      }
      throw new UnknownError("Unknown error");
    }
  }

  public static async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      const url_login = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/auth/login`;
      const response = await axios.post(url_login, loginData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        AuthService.handleAxiosError(error);
      }
      throw new UnknownError("Unknown error");
    }
  }

  public static async logout() {
    await SecureStore.deleteItemAsync("token");
  }

  private static handleAxiosError(error: AxiosError): void {
    const status = error.response?.status;

    switch (status) {
      case 401:
        this.logAndThrowError(
          new UnauthorizedError("Unauthorized. Please check your credentials.")
        );
        break;
      case 403:
        this.logAndThrowError(
          new ForbiddenError(
            "Forbidden. You do not have permission to perform this action."
          )
        );
        break;
      default:
        this.logAndThrowError(new NetworkError("Network error."));
    }
  }

  private static logAndThrowError(error: Error): void {
    console.error(`Error: ${error.message}`, error);
    throw error;
  }
}

export default AuthService;
