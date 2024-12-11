import React, { createContext, useEffect, useState } from "react";
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
import AuthService from "../services/authService";

type AuthContextType = {
  register: (userData: AuthRegisterRequest) => Promise<AuthResponse>;
  signIn: (userData: AuthRequest) => Promise<AuthResponse>;
  signOut: () => void;
  getCurrentSession: () => Session;
  currentSession: Session;
};

export const AuthContext = createContext<AuthContextType>({
  register: async () => ({}),
  signIn: async () => ({}),
  signOut: () => null,
  currentSession: {
    isAuthenticated: false,
  },
  getCurrentSession: () => ({
    isAuthenticated: false,
  }),
});

export function SessionProvider(props: React.PropsWithChildren) {
  const { setItem: setSession, deleteItem: deleteSession } =
    useSecureStore("userSession");

  const [currentSession, setCurrentSession] = useState<Session>({
    isAuthenticated: false,
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
      const registerResponse: RegisterResponse = await AuthService.register(
        registerRequest
      );

      setLoading(false);

      if (registerResponse.user) {
        const newSession: Session = {
          token: registerResponse.token,
          user: registerResponse.user,
          isAuthenticated: true,
        };
        await setSession("userSession", JSON.stringify(newSession));
        setCurrentSession(newSession);
        return {
          token: registerResponse.token,
          user: registerResponse.user,
        };
      }
    } finally {
      setLoading(false);
    }
    return {};
  };

  const signIn = async (userData: AuthRequest): Promise<AuthResponse> => {
    try {
      setLoading(true);

      console.log("Inicio de sesión con:", userData);

      let loginRequest: LoginRequest = {
        email: userData.email,
        password: userData.password,
      };

      let loginResponse: LoginResponse = await AuthService.login(loginRequest);

      /*let loginResponse: LoginResponse = {
        success: true,
        token: 'registerResponse.token',
        user: { name: 'registerResponse.user', email: 'registerResponse.user', id: '3' }
      }*/

      setLoading(false);

      if (loginResponse.token) {
        const newSession: Session = {
          token: loginResponse.token,
          user: loginResponse.user,
          isAuthenticated: true,
        };
        await setSession("userSession", JSON.stringify(newSession));
        setCurrentSession(newSession);
        return {
          token: loginResponse.token,
          user: loginResponse.user,
        };
      }
    } finally {
      setLoading(false);
    }
    return {};
  };

  const signOut = () => {
    deleteSession("userSession");
    setCurrentSession({
      isAuthenticated: false,
      token: undefined,
      user: undefined,
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
        getCurrentSession,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
