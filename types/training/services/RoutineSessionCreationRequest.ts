export interface RoutineSessionCreationRequest {
  name: string;
  sessionExercises: RoutineSessionExercise[];
}

export interface RoutineSessionExercise {
  exerciseId: number;
  recommendedOrder: number;
  sets: RoutineSessionExerciseSet[];
}

export interface RoutineSessionExerciseSet {
  setNumber: number;
  repetitions: number;
}
