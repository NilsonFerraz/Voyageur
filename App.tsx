
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  MapPin, 
  CheckSquare, 
  Sparkles,
  Plane,
  Save,
  Download,
  Languages
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Budget from './components/Budget';
import Itinerary from './components/Itinerary';
import Checklists from './components/Checklists';
import AIAssistant from './components/AIAssistant';
import { AppTab, TravelPlan, Language } from './types';
import { translations } from './translations';

const STORAGE_KEY = 'voyageur_pro_data';
const LANG_KEY = 'voyageur_pro_lang';

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
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem(LANG_KEY) as Language) || 'pt';
  });

  const t = translations[language];

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

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language);
  }, [language]);

  const savePlan = (newPlan: TravelPlan) => {
    setPlan(newPlan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan));
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert(language === 'pt' ? "Dados sincronizados com sucesso" : language === 'en' ? "Data synced successfully" : "Datos sincronizados con éxito");
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
    const props = { plan, onUpdate: savePlan, language };
    switch (activeTab) {
      case AppTab.DASHBOARD: return <Dashboard {...props} />;
      case AppTab.BUDGET: return <Budget {...props} />;
      case AppTab.ITINERARY: return <Itinerary {...props} />;
      case AppTab.CHECKLISTS: return <Checklists {...props} />;
      case AppTab.AI_ASSISTANT: return <AIAssistant {...props} />;
      default: return <Dashboard {...props} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
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
            label={t.overview} 
            active={activeTab === AppTab.DASHBOARD} 
            onClick={() => setActiveTab(AppTab.DASHBOARD)} 
          />
          <NavItem 
            icon={<MapPin size={20} />} 
            label={t.itinerary} 
            active={activeTab === AppTab.ITINERARY} 
            onClick={() => setActiveTab(AppTab.ITINERARY)} 
          />
          <NavItem 
            icon={<Wallet size={20} />} 
            label={t.budget} 
            active={activeTab === AppTab.BUDGET} 
            onClick={() => setActiveTab(AppTab.BUDGET)} 
          />
          <NavItem 
            icon={<CheckSquare size={20} />} 
            label={t.checklists} 
            active={activeTab === AppTab.CHECKLISTS} 
            onClick={() => setActiveTab(AppTab.CHECKLISTS)} 
          />
          <div className="pt-4 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">{t.aiAssistant}</div>
          <NavItem 
            icon={<Sparkles size={20} />} 
            label={t.aiAssistant} 
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
            {isSyncing ? t.syncing : t.sync}
          </button>
          <button 
            onClick={exportData}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Download size={16} />
            {t.export}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{plan.destination}</h2>
              <p className="text-slate-500 text-sm">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                <button 
                  onClick={() => setLanguage('pt')} 
                  className={`px-2 py-1 text-xs font-bold rounded ${language === 'pt' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >PT</button>
                <button 
                  onClick={() => setLanguage('en')} 
                  className={`px-2 py-1 text-xs font-bold rounded ${language === 'en' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >EN</button>
                <button 
                  onClick={() => setLanguage('es')} 
                  className={`px-2 py-1 text-xs font-bold rounded ${language === 'es' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >ES</button>
              </div>
              <input 
                type="text" 
                value={plan.destination}
                onChange={(e) => savePlan({ ...plan, destination: e.target.value })}
                className="px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={t.tripName}
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
