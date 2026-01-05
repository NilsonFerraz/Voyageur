
import React, { useState } from 'react';
import { Plus, Trash2, Check, ClipboardList } from 'lucide-react';
import { TravelPlan, Checklist, ChecklistItem, Language } from '../types';
import { translations } from '../translations';

interface ChecklistsProps {
  plan: TravelPlan;
  onUpdate: (plan: TravelPlan) => void;
  language: Language;
}

const Checklists: React.FC<ChecklistsProps> = ({ plan, onUpdate, language }) => {
  const t = translations[language];
  const [newListName, setNewListName] = useState('');

  const addList = () => {
    if (!newListName.trim()) return;
    const newList: Checklist = {
      id: crypto.randomUUID(),
      title: newListName,
      items: []
    };
    onUpdate({ ...plan, checklists: [...plan.checklists, newList] });
    setNewListName('');
  };

  const deleteList = (id: string) => {
    onUpdate({ ...plan, checklists: plan.checklists.filter(l => l.id !== id) });
  };

  const addItem = (listId: string, task: string) => {
    if (!task.trim()) return;
    const newItem: ChecklistItem = { id: crypto.randomUUID(), task, completed: false };
    onUpdate({
      ...plan,
      checklists: plan.checklists.map(l => 
        l.id === listId ? { ...l, items: [...l.items, newItem] } : l
      )
    });
  };

  const toggleItem = (listId: string, itemId: string) => {
    onUpdate({
      ...plan,
      checklists: plan.checklists.map(l => 
        l.id === listId ? {
          ...l, 
          items: l.items.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i)
        } : l
      )
    });
  };

  const removeItem = (listId: string, itemId: string) => {
    onUpdate({
      ...plan,
      checklists: plan.checklists.map(l => 
        l.id === listId ? { ...l, items: l.items.filter(i => i.id !== itemId) } : l
      )
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{t.myLists}</h3>
          <p className="text-slate-500 text-sm">{t.subtitle}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="flex-1 md:w-64 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder={t.newList}
            onKeyDown={(e) => e.key === 'Enter' && addList()}
          />
          <button 
            onClick={addList}
            className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plan.checklists.map((list) => (
          <ChecklistCard 
            key={list.id} 
            list={list} 
            language={language}
            onAddItem={(task) => addItem(list.id, task)}
            onToggleItem={(itemId) => toggleItem(list.id, itemId)}
            onRemoveItem={(itemId) => removeItem(list.id, itemId)}
            onDeleteList={() => deleteList(list.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface ChecklistCardProps {
  list: Checklist;
  language: Language;
  onAddItem: (task: string) => void;
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onDeleteList: () => void;
}

const ChecklistCard: React.FC<ChecklistCardProps> = ({ list, language, onAddItem, onToggleItem, onRemoveItem, onDeleteList }) => {
  const t = translations[language];
  const [taskInput, setTaskInput] = useState('');
  const progress = list.items.length > 0 ? (list.items.filter(i => i.completed).length / list.items.length) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[400px]">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <ClipboardList className="text-indigo-500 w-5 h-5" />
          <h4 className="font-bold text-slate-800">{list.title}</h4>
        </div>
        <button onClick={onDeleteList} className="text-slate-300 hover:text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="px-5 pt-4">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder={t.newItem}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onAddItem(taskInput);
                setTaskInput('');
              }
            }}
          />
          <button 
            onClick={() => { onAddItem(taskInput); setTaskInput(''); }}
            className="bg-indigo-50 text-indigo-600 p-1.5 rounded-md hover:bg-indigo-100"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-2">
        {list.items.length === 0 ? (
          <p className="text-center text-slate-400 text-sm italic py-10">{t.emptyList}</p>
        ) : (
          list.items.map((item) => (
            <div 
              key={item.id} 
              className={`flex items-center gap-3 p-2 rounded-lg transition-all group ${item.completed ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
            >
              <button 
                onClick={() => onToggleItem(item.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  item.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white hover:border-indigo-400'
                }`}
              >
                {item.completed && <Check size={14} />}
              </button>
              <span className={`flex-1 text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>
                {item.task}
              </span>
              <button 
                onClick={() => onRemoveItem(item.id)}
                className="text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          <span>{language === 'pt' ? 'PROGRESSO' : language === 'en' ? 'PROGRESS' : 'PROGRESO'}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5">
          <div className="bg-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Checklists;
