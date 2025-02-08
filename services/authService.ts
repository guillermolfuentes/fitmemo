import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { LoginRequest } from "@/types/auth/services/LoginRequest";
import { LoginResponse } from "@/types/auth/services/LoginResponse";
import { RegisterRequest } from "@/types/auth/services/RegisterRequest";
import { RegisterResponse } from "@/types/auth/services/RegisterResponse";
import { Session } from "@/types/auth/contexts/Session";
import { RefreshTokenRequest } from "@/types/auth/services/RefreshTokenRequest";
import { RefreshTokenResponse } from "@/types/auth/services/RefreshTokenResponse";

class AuthService {
  private static sessionSubscribers: ((session: Session | null) => void)[] = [];

  constructor() {
    axios.interceptors.request.use((request) => request);
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
      const data = response.data;

      if (data.token && data.user) {
        const session = {
          token: data.token,
          refreshToken: data.refreshToken,
          user: data.user,
          isAuthenticated: true,
        };
        await this.saveSession(session);
        this.notifySessionSubscribers(session);
      }

      return data;
    } catch (error) {
      throw new Error("Registration failed");
    }
  }

  public static async login(loginData: LoginRequest): Promise<LoginResponse> {
    try {
      const url_login = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/auth/login`;
      const response = await axios.post(url_login, loginData);
      const data = response.data;

      if (data.token && data.user) {
        const session = {
          token: data.token,
          refreshToken: data.refreshToken,
          user: data.user,
          isAuthenticated: true,
        };
        await this.saveSession(session);
        this.notifySessionSubscribers(session);
      }

      return data;
    } catch (error) {
      throw new Error("Login failed");
    }
  }

  public static async logout() {
    await SecureStore.deleteItemAsync("userSession");
    this.notifySessionSubscribers(null);
  }

  public static async getStoredSession(): Promise<Session | null> {
    try {
      console.log("Intentando recurar sesión almacenada...");
      const session = await SecureStore.getItemAsync("userSession");
      if (session) {
        console.log("Recuperada sesión almacenada", session);
        let parsedSession = JSON.parse(session);
        this.notifySessionSubscribers(parsedSession);
        return parsedSession;
      }
      console.log("No se encontró sesión almacenada");

      await this.saveSession({
        isAuthenticated: false,
      });
      this.notifySessionSubscribers(null);
      return null;
    } catch (error) {
      console.log("Error al recuperar la sesión almacenada", error);
      await this.saveSession({
        isAuthenticated: false,
      });
      this.notifySessionSubscribers(null);
      return null;
    }
  }

  private static async saveSession(session: Session) {
    await SecureStore.setItemAsync("userSession", JSON.stringify(session));
  }

  public static subscribeToSessionChanges(
    callback: (session: Session | null) => void
  ) {
    this.sessionSubscribers.push(callback);
  }

  private static notifySessionSubscribers(session: Session | null) {
    this.sessionSubscribers.forEach((callback) => callback(session));
  }

  public static async refreshToken(
    refreshTokenData: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    try {
      const url_refresh = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/auth/refresh-token`;
      const response = await axios.post(url_refresh, refreshTokenData);
      const data = response.data;

      if (data.token) {
        const session = await this.getStoredSession();
        if (session) {
          const newSession = {
            ...session,
            token: data.token,
            refreshToken: data.refreshToken,
          };
          await this.saveSession(newSession);
          this.notifySessionSubscribers(newSession);
        }
      }

      return data;
    } catch (error) {
      throw new Error("Token refresh failed");
    }
  }
}

export default AuthService;
