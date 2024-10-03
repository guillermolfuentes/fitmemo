export interface RegisterRequest {
  // Step 1
  name: string;
  age: number; 
  gender: 'male' | 'female'; 
  
  // Step 2
  trainingDays: number;
  trainingLevel: 'beginner' | 'intermediate' | 'advanced'; 
  availableEquipment: 'dumbbells' | 'barbell' | 'resistance_band' | 'no_equipment' | 'gym'; 
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'; 
  targetMuscleGroup: 'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'abs'; 
  
  // Step 3
  height: number;
  weight: number;
  waistCircumference?: number;
  hipCircumference?: number;
  thighCircumference?: number;
  
  // Step 4
  email: string;
  password: string;
  confirmPassword: string; 
}
