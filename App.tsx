
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  MapPin, 
  CheckSquare, 
  Sparkles,
  Plane,
  Save,
  Download
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Budget from './components/Budget';
import Itinerary from './components/Itinerary';
import Checklists from './components/Checklists';
import AIAssistant from './components/AIAssistant';
import { AppTab, TravelPlan, Expense, ItineraryItem, Checklist } from './types';

const STORAGE_KEY = 'voyageur_pro_data';

const DEFAULT_PLAN: TravelPlan = {
  id: '1',
  destination: 'Minha Viagem',
  plannedBudget: 5000,
  expenses: [],
  itinerary: [],
  checklists: [
    { id: 'c1', title: 'Bagagem', items: [{ id: 'i1', task: 'Roupas', completed: false }] },
    { id: 'c2', title: 'Documentos', items: [{ id: 'i2', task: 'Passaporte', completed: false }] },
  ]
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [plan, setPlan] = useState<TravelPlan>(DEFAULT_PLAN);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPlan(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    }
  }, []);

  const savePlan = (newPlan: TravelPlan) => {
    setPlan(newPlan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan));
  };

  const handleSync = () => {
    setIsSyncing(true);
    // Simulação de sincronização com Google Sheets (Backend Mock)
    setTimeout(() => {
      setIsSyncing(false);
      alert("Dados sincronizados com sucesso (Simulação Google Sheets)");
    }, 1500);
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `viagem_${plan.destination.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD: return <Dashboard plan={plan} onUpdate={savePlan} />;
      case AppTab.BUDGET: return <Budget plan={plan} onUpdate={savePlan} />;
      case AppTab.ITINERARY: return <Itinerary plan={plan} onUpdate={savePlan} />;
      case AppTab.CHECKLISTS: return <Checklists plan={plan} onUpdate={savePlan} />;
      case AppTab.AI_ASSISTANT: return <AIAssistant plan={plan} onUpdate={savePlan} />;
      default: return <Dashboard plan={plan} onUpdate={savePlan} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Plane className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-indigo-900 tracking-tight">Voyageur</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Visão Geral" 
            active={activeTab === AppTab.DASHBOARD} 
            onClick={() => setActiveTab(AppTab.DASHBOARD)} 
          />
          <NavItem 
            icon={<MapPin size={20} />} 
            label="Roteiro" 
            active={activeTab === AppTab.ITINERARY} 
            onClick={() => setActiveTab(AppTab.ITINERARY)} 
          />
          <NavItem 
            icon={<Wallet size={20} />} 
            label="Orçamento" 
            active={activeTab === AppTab.BUDGET} 
            onClick={() => setActiveTab(AppTab.BUDGET)} 
          />
          <NavItem 
            icon={<CheckSquare size={20} />} 
            label="Checklists" 
            active={activeTab === AppTab.CHECKLISTS} 
            onClick={() => setActiveTab(AppTab.CHECKLISTS)} 
          />
          <div className="pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">Inteligência Artificial</div>
          <NavItem 
            icon={<Sparkles size={20} />} 
            label="Assistente IA" 
            active={activeTab === AppTab.AI_ASSISTANT} 
            onClick={() => setActiveTab(AppTab.AI_ASSISTANT)} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Save size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Planilha'}
          </button>
          <button 
            onClick={exportData}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Download size={16} />
            Exportar Dados
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{plan.destination}</h2>
              <p className="text-slate-500 text-sm">Organize cada detalhe da sua próxima aventura.</p>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="text" 
                value={plan.destination}
                onChange={(e) => savePlan({ ...plan, destination: e.target.value })}
                className="px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nome da Viagem"
              />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      active 
        ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
        : 'text-slate-600 hover:bg-slate-100 border border-transparent'
    }`}
  >
    <span className={active ? 'text-indigo-600' : 'text-slate-400'}>{icon}</span>
    {label}
  </button>
);

export default App;
