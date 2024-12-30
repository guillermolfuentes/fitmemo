export interface TrainingDiaryEntryRequest {
  body: {
    exercises: TrainingDiaryEntryExercise[];
  };
}

export interface TrainingDiaryEntryExercise {
  exerciseId: number;
  sets: TrainingDiaryEntryExerciseSet[];
}

export interface TrainingDiaryEntryExerciseSet {
  setNumber: number;
  repetitionsCompleted: number;
  weightUsed: number;
}
