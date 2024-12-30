export interface RoutineSessionUpdateRequest {
  body: {
    name: string;
    recommendedOrder: number;
    sessionExercises: RoutineSessionExercise[];
  };
}

export interface RoutineSessionExercise {
  id: number;
  exerciseId: number;
  recommendedOrder: number;
  sets: RoutineSessionExerciseSet[];
}

export interface RoutineSessionExerciseSet {
  id: number;
  setNumber: number;
  repetitions: number;
  weight: number;
}
