export type UserRegistrationData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;
  waistCircumference: number;
  hipCircumference: number;
  thighCircumference: number;
  activityLevel: "light" | "moderate" | "intense";
  trainingLevel: "beginner" | "intermediate" | "advanced";
  trainingDays: number;
  targetMuscleGroup: string;
  availableEquipment: string;
};
