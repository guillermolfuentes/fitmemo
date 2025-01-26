export interface RoutineSessionResponse {
  name: string;
  recommendedOrder?: number;
  sessionExercises: RoutineSessionExercise[];
}

export interface RoutineSessionExercise {
  id?: number;
  exerciseId: number;
  exerciseName: string;
  recommendedOrder: number;
  sets: RoutineSessionExerciseSet[];
  recentlyAdded?: boolean;
}

export interface RoutineSessionExerciseSet {
  id?: number;
  setNumber: number;
  repetitions: number;
  weight: number;
}
