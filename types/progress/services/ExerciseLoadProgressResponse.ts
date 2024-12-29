export interface ExerciseLoadProgressResponse {
  loadProgressCoordinates: ExerciseLoadProgressCoordinates[];
}

export interface ExerciseLoadProgressCoordinates {
  date: string;
  maxLoad: number;
}
