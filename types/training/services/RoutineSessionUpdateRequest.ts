export interface RoutineSessionUpdateRequest {
  name?: string;
  sessionExercises: RoutineSessionExercise[];
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
}
