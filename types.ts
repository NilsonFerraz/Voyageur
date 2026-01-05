
export type ExpenseCategory = 'Transporte' | 'Hospedagem' | 'Alimentação' | 'Passeios' | 'Compras' | 'Outros';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
}

export interface ItineraryItem {
  id: string;
  date: string;
  time: string;
  activity: string;
  location: string;
  notes: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface TravelPlan {
  id: string;
  destination: string;
  plannedBudget: number;
  expenses: Expense[];
  itinerary: ItineraryItem[];
  checklists: Checklist[];
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  BUDGET = 'budget',
  ITINERARY = 'itinerary',
  CHECKLISTS = 'checklists',
  AI_ASSISTANT = 'ai_assistant'
}
