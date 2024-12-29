import { Equipment } from "../models/Equipment";
import { MuscleGroup } from "../models/MuscleGroup";

export interface SearchExerciseRequest {
  name?: string;
  muscleGroup?: MuscleGroup;
  equipment?: Equipment;
}