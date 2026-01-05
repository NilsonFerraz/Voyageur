import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TravelPlan, Language, Currency } from '../types';
import { TrendingDown, Wallet, Calendar, ListChecks, AlertCircle } from 'lucide-react';
import { translations } from '../translations';
import { formatCurrency } from '../services/currency';

interface DashboardProps {
  plan: TravelPlan;
  onUpdate: (plan: TravelPlan) => void;
  language: Language;
  currency: Currency;
  convert: (val: number) => number;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ plan, language, currency, convert }) => {
  const t = translations[language];
  const totalSpentBRL = plan.expenses.reduce((sum, e) => sum + e.amount, 0);
  const plannedBRL = plan.plannedBudget;
  
  const totalSpent = convert(totalSpentBRL);
  const planned = convert(plannedBRL);
  const remainingBudget = planned - totalSpent;
  const isOverBudget = remainingBudget < 0;

  const categoryData = Object.entries(
    plan.expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + convert(curr.amount);
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const checklistStats = plan.checklists.map(c => {
    const total = c.items.length;
    const completed = c.items.filter(i => i.completed).length;
    return { name: c.title, completed, total };
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Wallet className="text-indigo-600" />} 
          title={t.totalSpent} 
          value={formatCurrency(totalSpent, currency.code, currency.symbol)} 
          subtitle={`${t.planned}: ${formatCurrency(planned, currency.code, currency.symbol)}`}
        />
        <StatCard 
          icon={<TrendingDown className={isOverBudget ? "text-red-500" : "text-emerald-500"} />} 
          title={t.balance} 
          value={formatCurrency(remainingBudget, currency.code, currency.symbol)} 
          subtitle={isOverBudget ? t.overBudget : t.withinBudget}
          alert={isOverBudget}
        />
        <StatCard 
          icon={<Calendar className="text-amber-500" />} 
          title={t.itinerary} 
          value={`${plan.itinerary.length} ${t.itineraryItems.split(' ')[0]}`} 
          subtitle={t.itineraryItems}
        />
        <StatCard 
          icon={<ListChecks className="text-emerald-500" />} 
          title={t.checklists} 
          value={`${Math.round((checklistStats.reduce((a, b) => a + b.completed, 0) / Math.max(1, checklistStats.reduce((a, b) => a + b.total, 0))) * 100)}%`} 
          subtitle={t.completedItems}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">{t.budgetDistribution}</h3>
          <div className="h-[300px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  {/* Fixed type error: casting value to any and converting to Number for compatibility with formatCurrency, as Tooltip value is inferred as unknown */}
                  <Tooltip formatter={(value: any) => formatCurrency(Number(value), currency.code, currency.symbol)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
                {t.noExpenses}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-sm text-slate-600 font-medium">{cat.name}: <span className="text-slate-900">{formatCurrency(cat.value, currency.code, currency.symbol)}</span></span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">{t.listProgress}</h3>
          <div className="space-y-6">
            {checklistStats.map((list) => (
              <div key={list.name} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700">{list.name}</span>
                  <span className="text-slate-500">{list.completed}/{list.total}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${(list.completed / Math.max(1, list.total)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {checklistStats.length === 0 && (
              <p className="text-slate-400 text-center py-10 italic">{t.emptyList}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string, subtitle: string, alert?: boolean }> = ({ icon, title, value, subtitle, alert }) => (
  <div className={`p-5 bg-white rounded-xl border ${alert ? 'border-red-200 bg-red-50' : 'border-slate-200'} shadow-sm transition-transform hover:scale-[1.02]`}>
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      {alert && <AlertCircle className="text-red-500 w-5 h-5" />}
    </div>
    <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
    <div className="text-2xl font-bold text-slate-900 mt-1">{value}</div>
    <p className={`text-xs mt-2 font-medium ${alert ? 'text-red-600' : 'text-slate-400'}`}>{subtitle}</p>
  </div>
);

export default Dashboard;