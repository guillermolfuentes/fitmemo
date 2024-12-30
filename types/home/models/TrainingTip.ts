export interface TrainingTip {
  id: number;
  category: "nutrition" | "workout" | "recovery" | "motivation" | "safety";
  title: string;
  content: string;
  scienceExplanation: string;
}
