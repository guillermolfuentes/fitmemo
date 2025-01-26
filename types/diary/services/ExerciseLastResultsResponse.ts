export interface ExerciseLastResultsResponse {
  exerciseId: number;
  sets: ExerciseResultsExerciseSet[];
}

export interface ExerciseResultsExerciseSet {
  setNumber: number;
  repetitionsCompleted: number;
  weightUsed: number;
}
