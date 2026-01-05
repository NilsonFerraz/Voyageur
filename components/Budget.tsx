
import React, { useState } from 'react';
import { Plus, Trash2, Tag, Calendar } from 'lucide-react';
import { TravelPlan, Expense, ExpenseCategory, Language, Currency } from '../types';
import { translations } from '../translations';
import { formatCurrency } from '../services/currency';

interface BudgetProps {
  plan: TravelPlan;
  onUpdate: (plan: TravelPlan) => void;
  language: Language;
  currency: Currency;
  convert: (val: number) => number;
}

const CATEGORIES: ExpenseCategory[] = ['Transporte', 'Hospedagem', 'Alimentação', 'Passeios', 'Compras', 'Outros'];

const Budget: React.FC<BudgetProps> = ({ plan, onUpdate, language, currency, convert }) => {
  const t = translations[language];
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    description: '',
    amount: 0,
    category: 'Alimentação',
    date: new Date().toISOString().split('T')[0]
  });

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;

    const expense: Expense = {
      id: crypto.randomUUID(),
      description: newExpense.description || '',
      amount: Number(newExpense.amount), // Armazenamos sempre em BRL (Base)
      category: newExpense.category as ExpenseCategory || 'Outros',
      date: newExpense.date || new Date().toISOString().split('T')[0]
    };

    onUpdate({
      ...plan,
      expenses: [...plan.expenses, expense]
    });

    setNewExpense({ ...newExpense, description: '', amount: 0 });
  };

  const deleteExpense = (id: string) => {
    onUpdate({
      ...plan,
      expenses: plan.expenses.filter(e => e.id !== id)
    });
  };

  const updatePlannedBudget = (val: number) => {
    onUpdate({ ...plan, plannedBudget: val });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{t.plannedBudget}</h3>
          <p className="text-slate-500 text-sm">{t.subtitle}</p>
        </div>
        <div className="relative group">
           <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
             <span className="text-indigo-600 font-bold text-sm">R$</span>
           </div>
          <input 
            type="number"
            value={plan.plannedBudget}
            onChange={(e) => updatePlannedBudget(Number(e.target.value))}
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-lg font-bold text-indigo-700 w-48 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <div className="absolute top-full left-0 mt-1 text-[10px] text-slate-400 italic">
            Valor base (BRL). Equivalente a {formatCurrency(convert(plan.plannedBudget), currency.code, currency.symbol)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit sticky top-24">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">{t.addExpense}</h3>
          <form onSubmit={addExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.description}</label>
              <input 
                required
                type="text" 
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Jantar em Roma"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.amount} (R$)</label>
              <input 
                required
                type="number" 
                value={newExpense.amount || ''}
                onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.date}</label>
                <input 
                  type="date" 
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.category}</label>
              <select 
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Plus size={20} /> {t.add}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">{t.description}</th>
                  <th className="px-6 py-4 font-semibold">{t.category}</th>
                  <th className="px-6 py-4 font-semibold text-right">{t.amount} ({currency.symbol})</th>
                  <th className="px-6 py-4 font-semibold text-center w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plan.expenses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                      {t.noExpenses}
                    </td>
                  </tr>
                ) : (
                  plan.expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{expense.description}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar size={12} /> {new Date(expense.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          <Tag size={12} /> {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        {formatCurrency(convert(expense.amount), currency.code, currency.symbol)}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => deleteExpense(expense.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
