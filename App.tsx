
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  MapPin, 
  CheckSquare, 
  Sparkles,
  Plane,
  Save,
  Download,
  Coins,
  ChevronDown
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Budget from './components/Budget';
import Itinerary from './components/Itinerary';
import Checklists from './components/Checklists';
import AIAssistant from './components/AIAssistant';
import { AppTab, TravelPlan, Language, CurrencyCode, CURRENCIES } from './types';
import { translations } from './translations';
import { getExchangeRates } from './services/currency';

const STORAGE_KEY = 'voyageur_pro_data';
const LANG_KEY = 'voyageur_pro_lang';
const CURRENCY_KEY = 'voyageur_pro_currency';

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
  
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(() => {
    return (localStorage.getItem(CURRENCY_KEY) as CurrencyCode) || 'BRL';
  });
  const [rates, setRates] = useState<Record<CurrencyCode, number>>({ BRL: 1, USD: 0.2, EUR: 0.18, GBP: 0.16, JPY: 30, ARS: 165 });
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const t = translations[language];
  const activeCurrency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPlan(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    }
    
    // Buscar taxas reais ao iniciar
    getExchangeRates().then(setRates);
  }, []);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currencyCode);
  }, [currencyCode]);

  const savePlan = (newPlan: TravelPlan) => {
    setPlan(newPlan);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPlan));
  };

  const convertValue = useCallback((val: number) => {
    const rate = rates[currencyCode] || 1;
    return val * rate;
  }, [rates, currencyCode]);

  const renderContent = () => {
    const props = { 
      plan, 
      onUpdate: savePlan, 
      language, 
      currency: activeCurrency,
      convert: convertValue
    };
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
            onClick={() => {
              setIsSyncing(true);
              setTimeout(() => { setIsSyncing(false); alert("Sincronizado!"); }, 1000);
            }}
            disabled={isSyncing}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <Save size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? t.syncing : t.sync}
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
              {/* Currency Selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-200 transition-all shadow-sm"
                >
                  <Coins size={16} className="text-indigo-600" />
                  {activeCurrency.code} ({activeCurrency.symbol})
                  <ChevronDown size={14} className={`transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showCurrencyDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowCurrencyDropdown(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 animate-fadeIn">
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCurrencyCode(c.code);
                            setShowCurrencyDropdown(false);
                          }}
                          className={`flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-indigo-50 transition-colors ${currencyCode === c.code ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'}`}
                        >
                          <span>{c.name}</span>
                          <span className="text-slate-400">{c.symbol}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Language Selector */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                {(['pt', 'en', 'es'] as Language[]).map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setLanguage(lang)} 
                    className={`px-2 py-1 text-xs font-bold rounded uppercase transition-all ${language === lang ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
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
