import axios from "axios";
import AuthService from "@/services/authService";
import { RefreshTokenResponse } from "@/types/auth/services/RefreshTokenResponse";
import { Session } from "@/types/auth/contexts/Session";

let currentSession: Session | null = null;

export const configureAxios = () => {
  AuthService.subscribeToSessionChanges((newSession) => {
    currentSession = newSession;
    if (newSession) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + newSession.token;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log("**************** Solicitud no autorizada, intentando refrescar el token ***********. CurrentSession: ", currentSession);
        if (currentSession && currentSession.refreshToken) {
          try {
            let response: RefreshTokenResponse = await AuthService.refreshToken(
              {
                refreshToken: currentSession.refreshToken,
              }
            );
            // Obtener el nuevo token y actualizar los headers
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + response.token;
            originalRequest.headers["Authorization"] =
              "Bearer " + response.token;

            // Repetir la solicitud original con el nuevo token
            console.log("Reintentando la solicitud original con el nuevo token a: ", originalRequest.url);
            return axios(originalRequest);
          } catch (refreshError) {
            // Si el refresh token falla, propagar el error
            console.log("Error al refrescar el token: ", refreshError);
            AuthService.logout();
            return Promise.reject(refreshError);
          }
        } else {
          // Si no hay un refresh token, cerrar la sesión
          console.log("No hay un refresh token, cerrando la sesión...");
          AuthService.logout();
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axios;
