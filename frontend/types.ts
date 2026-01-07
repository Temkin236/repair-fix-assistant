
export type Role = 'user' | 'assistant' | 'system' | 'tool';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  metadata?: {
    toolName?: string;
    verifiedSource?: string;
    safetyLevel?: 'safe' | 'warning' | 'critical';
    images?: string[];
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  tokensUsed: number;
  repairsCompleted: number;
}

export interface RepairSession {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'completed';
  createdAt: Date;
}

export interface IFixitStep {
  text: string;
  image?: string;
}

export interface IFixitGuide {
  id: number;
  title: string;
  steps: IFixitStep[];
  url: string;
}
