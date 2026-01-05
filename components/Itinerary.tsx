
import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Clock, Info } from 'lucide-react';
import { TravelPlan, ItineraryItem, Language } from '../types';
import { translations } from '../translations';

interface ItineraryProps {
  plan: TravelPlan;
  onUpdate: (plan: TravelPlan) => void;
  language: Language;
}

const Itinerary: React.FC<ItineraryProps> = ({ plan, onUpdate, language }) => {
  const t = translations[language];
  const [newItem, setNewItem] = useState<Partial<ItineraryItem>>({
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    activity: '',
    location: '',
    notes: ''
  });

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.activity) return;

    const item: ItineraryItem = {
      id: crypto.randomUUID(),
      date: newItem.date || '',
      time: newItem.time || '',
      activity: newItem.activity || '',
      location: newItem.location || '',
      notes: newItem.notes || ''
    };

    onUpdate({
      ...plan,
      itinerary: [...plan.itinerary, item].sort((a, b) => 
        (a.date + a.time).localeCompare(b.date + b.time)
      )
    });

    setNewItem({ ...newItem, activity: '', location: '', notes: '' });
  };

  const deleteItem = (id: string) => {
    onUpdate({
      ...plan,
      itinerary: plan.itinerary.filter(i => i.id !== id)
    });
  };

  const groupedItinerary = plan.itinerary.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = [];
    acc[curr.date].push(curr);
    return acc;
  }, {} as Record<string, ItineraryItem[]>);

  const sortedDates = Object.keys(groupedItinerary).sort();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
      <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit sticky top-24">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">{t.newActivity}</h3>
        <form onSubmit={addItem} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.date}</label>
              <input 
                type="date" 
                value={newItem.date}
                onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.time}</label>
              <input 
                type="time" 
                value={newItem.time}
                onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.activity}</label>
            <input 
              required
              type="text" 
              value={newItem.activity}
              onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: Museum visit"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.location}</label>
            <input 
              type="text" 
              value={newItem.location}
              onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: 123 Street"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t.notes}</label>
            <textarea 
              value={newItem.notes}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="..."
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <Plus size={20} /> {t.saveItinerary}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-8">
        {sortedDates.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-dashed border-slate-300 text-center text-slate-400">
            {t.emptyItinerary}
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="relative pl-6 border-l-2 border-indigo-100 space-y-4">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-50"></div>
              <h3 className="text-lg font-bold text-slate-800 pt-1 capitalize">
                {new Date(date + 'T00:00:00').toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'en' ? 'en-US' : 'es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h3>
              
              <div className="space-y-4">
                {groupedItinerary[date].map((item) => (
                  <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all flex gap-4 group">
                    <div className="flex flex-col items-center gap-2 text-indigo-600">
                       <Clock size={18} />
                       <span className="text-sm font-bold">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-800 text-lg">{item.activity}</h4>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {item.location && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                          <MapPin size={14} className="text-indigo-400" /> {item.location}
                        </div>
                      )}
                      {item.notes && (
                        <div className="flex items-start gap-1.5 text-slate-400 text-sm mt-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <Info size={14} className="mt-0.5 flex-shrink-0" />
                          <p className="italic">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Itinerary;
