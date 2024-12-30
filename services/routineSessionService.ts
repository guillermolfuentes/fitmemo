import axios, { AxiosError } from "axios";
import { NetworkError } from "@/errors/NetworkError";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { UnknownError } from "@/errors/UnknownError";
import { RoutineSessionCreationRequest } from "@/types/training/services/RoutineSessionCreationRequest";
import { RoutineSession } from "@/types/training/models/RoutineSession";
import { RoutineSessionResponse } from "@/types/training/services/RoutineSessionResponse";
import { RoutineSessionUpdateRequest } from "@/types/training/services/RoutineSessionUpdateRequest";

class RoutineSessionService {
  constructor() {
    axios.interceptors.request.use((request) => {
      return request;
    });

    axios.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  public static async createRoutineSession(
    routineSession: RoutineSessionCreationRequest,
    token: string
  ): Promise<RoutineSession> {
    try {
      const url_post_routine_session = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/routine-sessions`;
      const response = await axios.post(
        url_post_routine_session,
        routineSession,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        RoutineSessionService.handleAxiosError(error);
      }
      throw new UnknownError("Unknown error");
    }
  }

  public static async getRoutineSession(
    sessionId: number,
    token: string
  ): Promise<RoutineSessionResponse> {
    try {
      const url_get_routine_session = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/routine-sessions/
      ${sessionId}`;
      const response = await axios.get(url_get_routine_session, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.routineSession;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        RoutineSessionService.handleAxiosError(error);
      }
      throw new UnknownError("Unknown error");
    }
  }

  public static async updateRoutineSession(
    routineSession: RoutineSessionUpdateRequest,
    sessionId: number,
    token: string
  ): Promise<RoutineSessionResponse> {
    try {
      const url_put_routine_session = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/routine-sessions/${sessionId}`;
      const response = await axios.put(
        url_put_routine_session,
        routineSession,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        RoutineSessionService.handleAxiosError(error);
      }
      throw new UnknownError("Unknown error");
    }
  }

  public static async deleteRoutineSession(
    sessionId: number,
    token: string
  ): Promise<RoutineSessionResponse> {
    try {
      const url_delete_user_routine = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/routine-sessions/${sessionId}`;
      const response = await axios.delete(url_delete_user_routine, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        RoutineSessionService.handleAxiosError(error);
      }
      throw new UnknownError("Unknown error");
    }
  }

  private static handleAxiosError(error: AxiosError): void {
    const status = error.response?.status;

    switch (status) {
      case 401:
        this.logAndThrowError(
          new UnauthorizedError("Unauthorized. Please check your credentials.")
        );
        break;
      case 403:
        this.logAndThrowError(
          new ForbiddenError(
            "Forbidden. You do not have permission to perform this action."
          )
        );
        break;
      default:
        this.logAndThrowError(new NetworkError("Network error."));
    }
  }

  private static logAndThrowError(error: Error): void {
    console.error(`Error: ${error.message}`, error);
    throw error;
  }
}

export default RoutineSessionService;
