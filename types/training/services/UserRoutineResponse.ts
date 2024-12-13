export interface UserRoutineResponse {
  name: string;
  weeklyFrequency: number;
  createdAt: Date;
  updatedAt: Date;
  sessions: UserRoutineSession[];
}

export interface UserRoutineSession {
  sessionId: number;
  name: string;
  recommendedOrder: number;
}
