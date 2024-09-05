import React, { createContext } from "react";
import { useStorageState } from "../hooks/useStorageState";
import { login } from "../services/authService";
import { useUIContext } from "./UIContext";

export type SignInResult = {
  success: boolean;
  error?: "AUTHENTICATION_ERROR" | "NETWORK_ERROR" | "UNKNOWN_ERROR";
};

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  signIn: async () => ({ success: false, error: "UNKNOWN_ERROR" }),
  signOut: () => null,
});

export function SessionProvider(props: React.PropsWithChildren) {
  const [session, setSession] = useStorageState("session");
  const { isLoading, setLoading } = useUIContext();

  const signIn = async (
    email: string,
    password: string
  ): Promise<SignInResult> => {
    try {
      console.log("la viarbale is loading antes del seteo", isLoading);
      setLoading(true);
      console.log("la viarbale is loading despues del seteo", isLoading);

      const user = await login(email, password);
      console.log("la viarbale is loading durante", isLoading);

      setLoading(false);
      console.log("la viarbale is loading despues", isLoading);

      setSession(user);
      return { success: true };
    } catch (error) {
      if ((error as Error).message === "AUTHENTICATION_ERROR") {
        console.error(
          "Error de autenticación: combinación de email y contraseña incorrecta."
        );
        return { success: false, error: "AUTHENTICATION_ERROR" };
      } else if ((error as Error).message === "NETWORK_ERROR") {
        console.error("Error de red: no se pudo conectar al servidor.");
        return { success: false, error: "NETWORK_ERROR" };
      } else {
        console.error("Error desconocido:", error);
        return { success: false, error: "UNKNOWN_ERROR" };
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
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
