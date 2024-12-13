import axios, { AxiosError } from "axios";
import { NetworkError } from "@/errors/NetworkError";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { UnknownError } from "@/errors/UnknownError";
import { UserRoutineResponse } from "@/types/training/services/UserRoutineResponse";

class TrainingDiaryService {
  constructor() {
    axios.interceptors.request.use((request) => {
      return request;
    });

    axios.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  public static async getUserRoutine(
    token: string
  ): Promise<UserRoutineResponse> {
    try {
      const url_get_user_routine = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/routines`;
      const response = await axios.get(url_get_user_routine, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        TrainingDiaryService.handleAxiosError(error);
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

export default TrainingDiaryService;
