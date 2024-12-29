import { Equipment } from "./Equipment";
import { MuscleGroup } from "./MuscleGroup";
export interface Exercise {
  id: number;
  name: string;
  description: string;
  muscleGroup: MuscleGroup;
  equipmentNeeded: Equipment;
  difficulty: "easy" | "intermediate" | "hard";
  recommendedRir: number;
  createdAt: Date;
  updatedAt: Date;
}
