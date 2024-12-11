export interface User {
  id: number;
  name: string;
  age: number;
  gender: "male" | "female";
  trainingDays: number;
  trainingLevel: "beginner" | "intermediate" | "advanced";
  availableEquipment:
    | "dumbbells"
    | "barbell"
    | "resistance_band"
    | "no_equipment"
    | "gym";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  targetMuscleGroup: "chest" | "back" | "legs" | "arms" | "shoulders" | "abs";
  email: string;
  password: string;
}
