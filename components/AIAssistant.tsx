
import React, { useState } from 'react';
import { Sparkles, MapPin, Loader2, Send, Check } from 'lucide-react';
import { suggestItinerary } from '../services/gemini';
import { TravelPlan, ItineraryItem, Language } from '../types';
import { translations } from '../translations';

interface AIAssistantProps {
  plan: TravelPlan;
  onUpdate: (plan: TravelPlan) => void;
  language: Language;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ plan, onUpdate, language }) => {
  const t = translations[language];
  const [destination, setDestination] = useState(plan.destination !== 'Minha Viagem' ? plan.destination : '');
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleSuggest = async () => {
    if (!destination) return;
    setLoading(true);
    try {
      const result = await suggestItinerary(destination, days);
      setSuggestions(result);
    } catch (e) {
      console.error(e);
      alert(language === 'pt' ? "Houve um erro" : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const importToItinerary = () => {
    const newItems: ItineraryItem[] = [];
    
    suggestions.forEach((dayPlan: any, index: number) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      const dateStr = date.toISOString().split('T')[0];

      dayPlan.activities.forEach((act: any) => {
        newItems.push({
          id: crypto.randomUUID(),
          date: dateStr,
          time: act.time || '10:00',
          activity: act.activity,
          location: act.location || '',
          notes: act.notes || ''
        });
      });
    });

    onUpdate({
      ...plan,
      itinerary: [...plan.itinerary, ...newItems]
    });
    alert(language === 'pt' ? "Sugestões importadas!" : "Suggestions imported!");
    setSuggestions([]);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-2xl text-white shadow-lg relative overflow-hidden">
        <Sparkles className="absolute -right-4 -top-4 w-48 h-48 text-white/10 rotate-12" />
        <div className="relative z-10 max-w-xl">
          <h3 className="text-3xl font-bold mb-4">{t.aiTitle}</h3>
          <p className="text-indigo-100 mb-8 text-lg">{t.aiSubtitle}</p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300 w-5 h-5" />
              <input 
                type="text" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={t.whereTo}
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              />
            </div>
            <div className="w-full md:w-32 flex items-center gap-2">
              <input 
                type="number" 
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                min={1}
                max={15}
                className="w-full bg-white/10 border border-white/20 text-white pl-4 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              />
              <span className="text-xs text-indigo-200">{t.days}</span>
            </div>
            <button 
              onClick={handleSuggest}
              disabled={loading}
              className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
              {t.generate}
            </button>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-bold text-slate-800">{t.itinerary}</h4>
            <button 
              onClick={importToItinerary}
              className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold hover:bg-emerald-200 transition-colors"
            >
              <Check size={18} /> {t.importAll}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((dayPlan: any) => (
              <div key={dayPlan.day} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 font-bold text-slate-700">
                  {language === 'pt' ? 'Dia' : language === 'en' ? 'Day' : 'Día'} {dayPlan.day}
                </div>
                <div className="p-5 space-y-4">
                  {dayPlan.activities.map((act: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="text-xs font-bold text-indigo-600 w-12 pt-1">{act.time}</div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 text-sm">{act.activity}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{act.location}</div>
                        <p className="text-xs text-slate-400 mt-1 italic">{act.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
