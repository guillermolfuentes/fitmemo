import { LoginResponse } from "@/types/auth/services/LoginResponse";
import { RegisterRequest } from "@/types/auth/services/RegisterRequest";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { LoginRequest } from "@/types/auth/services/LoginRequest";
import { RegisterResponse } from "@/types/auth/services/RegisterResponse";

const API_URL = "https://user1719412282323.requestly.tech";
axios.interceptors.request.use((request) => {
  return request;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = async (
  userData: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const url_register_success = `https://requestly.tech/api/mockv2/success/register?username=user1719412282323`;
    //const url_register_failed = `https://requestly.tech/api/mockv2/fails/register?username=user1719412282323`;

    const response = await axios.post(url_register_success, userData);

    const registerResponse: RegisterResponse = {
      success: true,
      token: response.data.token,
      user: response.data.user,
    };

    return registerResponse;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.log("Error durante el registro es:", axiosError);

      if (axiosError.response) {
        if (axiosError.response.status === 400) {
          return {
            success: false,
            error: {
              code: axiosError.response.status || 400,
              message: "NETWORK_ERROR",
            },
          };
        } else {
          return {
            success: false,
            error: { code: 500, message: "NETWORK_ERROR" },
          };
        }
      }
    }
  }
  return {
    success: false,
    error: { code: 500, message: "UNKNOWN_ERROR" },
  };
};

export const login = async (
  loginData: LoginRequest
): Promise<LoginResponse> => {
  //const url = `https://requestly.tech/api/mockv2/login?username=user1719412282323`;

  const url_login_exitoso = `https://requestly.tech/api/mockv2/fails/login?username=user1719412282323`;
  //const url_login_unauthorized = `https://requestly.tech/api/mockv2/success/login?username=user1719412282323`;

  try {
    const response = await axios.post(url_login_exitoso, loginData);
    console.log("La respuesta del login es:", response.data);
    const authResponse: LoginResponse = {
      token: response.data.token,
      user: response.data.user,
      success: true,
    };

    return authResponse;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.log("Error durante el login es:", axiosError);

    if (axiosError.response) {
      if (axiosError.response.status === 401) {
        return {
          success: false,
          error: {
            code: axiosError.response.status || 401,
            message: "AUTHENTICATION_ERROR",
          },
        };
      } else {
        return {
          success: false,
          error: { code: 500, message: "NETWORK_ERROR" },
        };
      }
    }
  }
  return {
    success: false,
    error: { code: 500, message: "UNKNOWN_ERROR" },
  };
};

export const logout = async () => {
  await SecureStore.deleteItemAsync("token");
};
