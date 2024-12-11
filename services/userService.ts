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
import { User } from "@/types/auth/models/User";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

class UserService {
  constructor() {
    axios.interceptors.request.use((request) => {
      return request;
    });

    axios.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  public static async getUserProfile(token: string): Promise<User> {
    try {
      const url_get_user_profile = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/user/profile`;
      const response = await axios.get(url_get_user_profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        UserService.handleAxiosError(error);
      }
      throw new UnknownError("Unknown error");
    }
  }

  public static async updateUserProfile(
    token: string,
    updatedUser: Partial<User>
  ): Promise<void> {
    try {
      const url_update_user_profile = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/user/profile`;
      const response = await axios.put(url_update_user_profile, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        UserService.handleAxiosError(error);
      }
      throw new UnknownError("Unknown error");
    }
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

export default UserService;
