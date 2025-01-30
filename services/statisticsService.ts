import axios, { AxiosError } from "axios";
import { NetworkError } from "@/errors/NetworkError";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { UnknownError } from "@/errors/UnknownError";
import { MuscularGroupVolumeProgressResponse } from "@/types/progress/services/MuscularGroupVolumeProgressResponse";
import { BodyProgressResponse } from "@/types/progress/services/BodyProgressResponse";
import { ExerciseLoadProgressResponse } from "@/types/progress/services/ExerciseLoadProgressResponse";
import { UserAchievementsResponse } from "@/types/home/services/UserAchievementsResponse";

class StatisticsService {
  constructor() {
    axios.interceptors.request.use((request) => {
      return request;
    });

    axios.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error)
    );
  }

  public static async getUserAchievements(
    token: string
  ): Promise<UserAchievementsResponse> {
    try {
      const url_get_user_achievements = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/statistics/achievements`;
      const response = await axios.get(url_get_user_achievements, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("respuesta:    --------------->"+response.data); 
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        StatisticsService.handleAxiosError(error);
      }
      throw new UnknownError("Unknown error");
    }
  }

  public static async getBodyProgress(
    token: string
  ): Promise<BodyProgressResponse> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);

      const formattedEndDate = endDate.toISOString().split("T")[0];
      const formattedStartDate = startDate.toISOString().split("T")[0];

      const url_get_body_progress = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/statistics/body?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      const response = await axios.get(url_get_body_progress, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        StatisticsService.handleAxiosError(error);
      }
      throw new UnknownError("Unknown error");
    }
  }

  public static async getExerciseLoadProgress(
    exerciseId: number,
    token: string
  ): Promise<ExerciseLoadProgressResponse> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);

      const formattedEndDate = endDate.toISOString().split("T")[0];
      const formattedStartDate = startDate.toISOString().split("T")[0];

      const url_get_load_progress = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/statistics/load?exerciseId=${exerciseId}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      const response = await axios.get(url_get_load_progress, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        StatisticsService.handleAxiosError(error);
      }
      throw new UnknownError("Unknown error");
    }
  }

  public static async getMuscleGroupVolumeProgress(
    muscleGroup: string,
    token: string
  ): Promise<MuscularGroupVolumeProgressResponse> {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);

      const formattedEndDate = endDate.toISOString().split("T")[0];
      const formattedStartDate = startDate.toISOString().split("T")[0];

      const url_get_volume_progress = `${process.env.EXPO_PUBLIC_API_URL}/${process.env.EXPO_PUBLIC_API_VERSION}/statistics/volume?muscleGroup=${muscleGroup}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
      const response = await axios.get(url_get_volume_progress, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        StatisticsService.handleAxiosError(error);
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

export default StatisticsService;
