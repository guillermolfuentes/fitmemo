import React, { createContext, useEffect, useState } from "react";
import { useUIContext } from "./UIContext";
import { router } from "expo-router";
import { Session } from "@/types/auth/contexts/Session";
import AuthService from "../services/authService";
import { AuthRegisterRequest } from "@/types/auth/contexts/AuthRegisterRequest";
import { AuthRequest } from "@/types/auth/contexts/AuthLoginRequest";
import { AuthResponse } from "@/types/auth/contexts/AuthResponse";

type AuthContextType = {
  register: (userData: AuthRegisterRequest) => Promise<AuthResponse>;
  signIn: (userData: AuthRequest) => Promise<AuthResponse>;
  signOut: () => void;
  getCurrentSession: () => Promise<Session | null>;
  currentSession: Session | null;
  loadingStoredSession: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  register: async () => ({}),
  signIn: async () => ({}),
  signOut: () => null,
  getCurrentSession: async () => ({
    isAuthenticated: false,
  }),
  currentSession: null,
  loadingStoredSession: false,
});

export function SessionProvider(props: React.PropsWithChildren) {
  const { setLoading } = useUIContext();
  const [currentSession, setCurrentSession] = useState<Session | null>({
    isAuthenticated: false,
  });
    const [loadingStoredSession, setLoadingStoredSession] = useState(false);


  useEffect(() => {
    const loadSession = async () => {
      setLoadingStoredSession(true);
      console.log("**** Cargando la session almacenada... ****");
      const session = await AuthService.getStoredSession();
      if (session) {
        setCurrentSession(session);
      }
      setLoadingStoredSession(false);
    };
    loadSession();

    AuthService.subscribeToSessionChanges(setCurrentSession);
  }, []);

  const register = async (
    userData: AuthRegisterRequest
  ): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const registerResponse = await AuthService.register(userData);

      if (registerResponse.user) {
        setCurrentSession({
          token: registerResponse.token,
          refreshToken: registerResponse.refreshToken,
          user: registerResponse.user,
          isAuthenticated: true,
        });
        return registerResponse;
      }
    } finally {
      setLoading(false);
    }
    return {};
  };

  const signIn = async (userData: AuthRequest): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const loginResponse = await AuthService.login(userData);

      if (loginResponse.token) {
        setCurrentSession({
          token: loginResponse.token,
          refreshToken: loginResponse.refreshToken,
          user: loginResponse.user,
          isAuthenticated: true,
        });
        return loginResponse;
      }
    } finally {
      setLoading(false);
    }
    return {};
  };

  const signOut = () => {
    AuthService.logout();
    setCurrentSession({
      isAuthenticated: false,
      token: undefined,
      refreshToken: undefined,
      user: undefined,
    });
    router.replace("/login");
  };

  const getCurrentSession = async () => {
    const session = await AuthService.getStoredSession();
    if (session) {
      return session;
    }
    return currentSession;
  };

  return (
    <AuthContext.Provider
      value={{
        register,
        signIn,
        signOut,
        getCurrentSession,
        currentSession,
        loadingStoredSession,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
