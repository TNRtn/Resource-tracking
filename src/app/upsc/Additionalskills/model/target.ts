export interface TargetInput {
  name: string;
  startDate: string;
  targetDate: string;
  isActive: boolean;
}

export interface Target {
  id: number;
  name: string;
  startDate: string;
  targetDate: string;
  isActive: boolean;
  isCompleted: boolean;
  completedDate: string | null;
  score: number;
  createdDate: string;
}

