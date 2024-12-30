export interface RoutineSessionCreationRequest {
  body: {
    exercises: RoutineSessionExercise[];
  };
}

export interface RoutineSessionExercise {
  exerciseId: number;
  recommendedOrder: number;
  sets: RoutineSessionExerciseSet[];
}

export interface RoutineSessionExerciseSet {
  setNumber: number;
  repetitions: number;
  weight: number;
}
