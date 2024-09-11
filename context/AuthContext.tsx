import React, { createContext, useEffect, useState } from "react";
import { login } from "../services/authService";
import { useUIContext } from "./UIContext";
import { AuthResponse, SignInResult } from "@/types/auth";
import { Session } from "@/types/session";
import { router } from "expo-router";
import { useSecureStore } from "@/hooks/useSecureStore";

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => void;
  currentSession: Session;
};

export const AuthContext = createContext<AuthContextType>({
  signIn: async () => ({ success: false, error: "UNKNOWN_ERROR" }),
  signOut: () => null,  
  currentSession: {
    isAuthenticated: false,
    token: null,
    user: null,
  },
});

export function SessionProvider(props: React.PropsWithChildren) {
  const {
    setItem: setSession,
    deleteItem: deleteSession,
  } = useSecureStore("userSession");

  const [currentSession, setCurrentSession] = useState<Session>({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  useEffect(() => {
    console.log("AuthContext currentSession changed:", currentSession);
  }, [currentSession]);

  const { setLoading } = useUIContext();

  const signIn = async (
    email: string,
    password: string
  ): Promise<SignInResult> => {
    try {
      setLoading(true);
      let authResponse: AuthResponse = await login(email, password);
      setLoading(false);

      if (authResponse.success) {
        const newSession: Session = {
          token: authResponse.data?.token || null,
          user: authResponse.data?.user || null,
          isAuthenticated: true,
        };
        await setSession("userSession", JSON.stringify(newSession));
        setCurrentSession(newSession);
        return { success: true };
      } else {
        return { success: false, error: authResponse.errorMessage };
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
        signIn,
        signOut,
        currentSession,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
