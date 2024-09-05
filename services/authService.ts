import { AuthResponse } from "@/types/auth";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { string } from "yup";

const API_URL = "https://user1719412282323.requestly.tech";
axios.interceptors.request.use((request) => {
  console.log("Starting Request", JSON.stringify(request, null, 2));
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
  name: string,
  email: string,
  password: string,
  age: number,
  gender: string
) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      age,
      gender,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al registrar");
  }
};

const delayTest = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(
      `https://requestly.tech/api/mockv2/login?username=user1719412282323`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        maxRedirects: 5,
      }
    );

    return {
      data: {
        token: response.data.data.token,
        user: response.data.data.user,
      },
      success: true,
    };
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        return { success: false, errorMessage: "AUTHENTICATION_ERROR" };
      }
    } else {
      return { success: false, errorMessage: "NETWORK_ERROR" };
    }
    return { success: false, errorMessage: "UNKNOWN_ERROR" };
  }
};

export const logout = async () => {
  await SecureStore.deleteItemAsync("token");
};
