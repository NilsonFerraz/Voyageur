
export type ExpenseCategory = 'Transporte' | 'Hospedagem' | 'Alimentação' | 'Passeios' | 'Compras' | 'Outros';

export type Language = 'pt' | 'en' | 'es';

export type CurrencyCode = 'BRL' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'ARS';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro' },
  { code: 'USD', symbol: '$', name: 'Dólar Americano' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina' },
  { code: 'JPY', symbol: '¥', name: 'Iene Japonês' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino' },
];

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
