import React, { createContext, useEffect, useState } from "react";
import { login, register as registerService } from "../services/authService";
import { useUIContext } from "./UIContext";
import { router } from "expo-router";
import { useSecureStore } from "@/hooks/useSecureStore";
import { Session } from "@/types/auth/contexts/Session";
import { LoginResponse } from "@/types/auth/services/LoginResponse";
import { AuthRequest } from "@/types/auth/contexts/AuthLoginRequest";
import { AuthResponse } from "@/types/auth/contexts/AuthResponse";
import { LoginRequest } from "@/types/auth/services/LoginRequest";
import { RegisterResponse } from "@/types/auth/services/RegisterResponse";
import { AuthRegisterRequest } from "@/types/auth/contexts/AuthRegisterRequest";
import { RegisterRequest } from "@/types/auth/services/RegisterRequest";

type AuthContextType = {
  register: (userData: AuthRegisterRequest) => Promise<AuthResponse>;
  signIn: (userData: AuthRequest) => Promise<AuthResponse>;
  signOut: () => void;
  currentSession: Session;
};

export const AuthContext = createContext<AuthContextType>({
  register: async () => ({
    success: false,
    error: { message: "UNKNOWN_ERROR" },
  }),
  signIn: async () => ({ success: false, error: { message: "UNKNOWN_ERROR" } }),
  signOut: () => null,
  currentSession: {
    isAuthenticated: false,
    token: null,
    user: null,
  },
});

export function SessionProvider(props: React.PropsWithChildren) {
  const { setItem: setSession, deleteItem: deleteSession } =
    useSecureStore("userSession");

  const [currentSession, setCurrentSession] = useState<Session>({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  useEffect(() => {
    console.log("AuthContext: la sesión actual ha cambiado:", currentSession);
  }, [currentSession]);

  const { setLoading } = useUIContext();

  const register = async (
    userData: AuthRegisterRequest
  ): Promise<AuthResponse> => {
    try {
      setLoading(true);

      let registerRequest: RegisterRequest = { ...userData };

      const registerResponse: RegisterResponse = await registerService(
        registerRequest
      );

      setLoading(false);

      if (registerResponse.success) {
        const newSession: Session = {
          token: registerResponse.token || null,
          user: registerResponse.user || null,
          isAuthenticated: true,
        };
        await setSession("userSession", JSON.stringify(newSession));
        setCurrentSession(newSession);
        return {
          success: true,
          token: registerResponse.token,
          user: registerResponse.user,
        };
      } else {
        return { success: false, errorMessage: "UNKNOWN_ERROR" };
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (userData: AuthRequest): Promise<AuthResponse> => {
    try {
      setLoading(true);

      console.log("Inicio de sesión con:", userData);

      let loginRequest: LoginRequest = {
        email: userData.email,
        password: userData.password,
      };

      let loginResponse: LoginResponse = await login(loginRequest);

      /*let loginResponse: LoginResponse = {
        success: true,
        token: 'registerResponse.token',
        user: { name: 'registerResponse.user', email: 'registerResponse.user', id: '3' }
      }*/

      setLoading(false);

      if (loginResponse.success) {
        const newSession: Session = {
          token: loginResponse.token || null,
          user: loginResponse.user || null,
          isAuthenticated: true,
        };
        await setSession("userSession", JSON.stringify(newSession));
        setCurrentSession(newSession);
        return {
          success: true,
          token: loginResponse.token,
          user: loginResponse.user,
        };
      } else {
        let authResponse: AuthResponse;
        if (loginResponse.error?.code === 401) {
          authResponse = {
            success: false,
            errorMessage: "AUTHENTICATION_ERROR",
          };
        } else {
          authResponse = { success: false, errorMessage: "UNKNOWN_ERROR" };
        }
        return authResponse;
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    deleteSession("userSession");
    setCurrentSession({
      isAuthenticated: false,
      token: null,
      user: null,
    });
    router.replace("/login");

    console.log("Sesión cerrada");
  };

  const getCurrentSession = () => {
    return currentSession;
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        signIn,
        signOut,
        currentSession,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
