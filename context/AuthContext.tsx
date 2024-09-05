import React, { createContext, useState } from "react";
import { login } from "../services/authService";
import { useUIContext } from "./UIContext";
import { AuthResponse, SignInResult } from "@/types/auth";
import { Session } from "@/types/session";
import { useStorageState } from "@/hooks/useStorageState";

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => void;
  session?: string | null;};

export const AuthContext = createContext<AuthContextType>({
  signIn: async () => ({ success: false, error: "UNKNOWN_ERROR" }),
  signOut: () => null,
  session: null
});

export function SessionProvider(props: React.PropsWithChildren) {
  //const [session, setSession] = useStorageState('userSession');
  const [session, setSession] = useStorageState('userSession');

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
        setSession(JSON.stringify(newSession));
        return { success: true };
      } else {
        return { success: false, error: authResponse.errorMessage };
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setSession(null);
    console.log("Sesión cerrada");
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
