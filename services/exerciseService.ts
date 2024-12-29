import axios, { AxiosError } from "axios";
import { NetworkError } from "@/errors/NetworkError";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { UnknownError } from "@/errors/UnknownError";
import { BodyMeasurementEntryRequest } from "@/types/progress/services/BodyMeasurementEntryRequest";
import { SearchExerciseRequest } from "@/types/training/services/SearchExerciseRequest";
import { Exercise } from "@/types/training/models/Exercise";

class ExerciseService {
  constructor() {
    axios.interceptors.request.use((request) => {
      return request;
    });

    axios.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  public static async searchExercises(
    filter: SearchExerciseRequest,
    token: string
  ): Promise<Exercise[]> {
    try {
      const url_search_exercises = new URL(
        `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/exercises/search`
      );
      const params = new URLSearchParams();

      if (filter.name) {
        params.append("name", filter.name);
      }
      if (filter.muscleGroup) {
        params.append("muscleGroup", filter.muscleGroup);
      }
      if (filter.equipment) {
        params.append("equipment", filter.equipment);
      }

      url_search_exercises.search = params.toString();
      const response = await axios.get(url_search_exercises.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.exercises;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        ExerciseService.handleAxiosError(error);
      }
      throw new UnknownError("Unknown error");
    }
  }

  public static async getExerciseDetails(
    exerciseId: number,
    token: string
  ): Promise<Exercise> {
    try {
      const url_post_body_measurement = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/exercises/${exerciseId}`;
      const response = await axios.get(url_post_body_measurement, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        ExerciseService.handleAxiosError(error);
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

export default ExerciseService;
