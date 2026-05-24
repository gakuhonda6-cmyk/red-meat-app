import { useState } from 'react';
import MeatCalculator from './components/MeatCalculator';
import ChatAssistant from './components/ChatAssistant';
import { Plus, X } from 'lucide-react';

function App() {
  const [tabs, setTabs] = useState([{ id: 1, name: '計算 1' }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextId, setNextId] = useState(2);

  const addTab = () => {
    if (tabs.length >= 5) return; // Max 5 tabs
    const newTab = { id: nextId, name: `計算 ${nextId}` };
    setTabs([...tabs, newTab]);
    setActiveTabId(nextId);
    setNextId(nextId + 1);
  };

  const removeTab = (idToRemove: number) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(t => t.id !== idToRemove);
    setTabs(newTabs);
    if (activeTabId === idToRemove) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-8 px-4 font-sans pb-24">
      <div className="w-full max-w-md mx-auto space-y-6">
        <header className="text-center space-y-2 mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-500">
            Red Meat Calc
          </h1>
          <p className="text-sm text-slate-400">赤肉仕込みをスマートに</p>
        </header>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all whitespace-nowrap border ${
                activeTabId === tab.id
                  ? 'bg-rose-600/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-900/20'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
              }`}
            >
              {tab.name}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                  className="p-0.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          {tabs.length < 5 && (
            <button
              onClick={addTab}
              className="flex items-center justify-center p-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all border border-white/5"
              title="新しい計算を追加"
            >
              <Plus size={18} />
            </button>
          )}
        </div>

        <main>
          {tabs.map((tab) => (
            <div key={tab.id} className={activeTabId === tab.id ? 'block animate-in fade-in duration-300' : 'hidden'}>
              <MeatCalculator />
            </div>
          ))}
        </main>

        <footer className="text-center text-xs text-slate-500 pt-8 pb-4">
          &copy; {new Date().getFullYear()} Factory App
        </footer>
      </div>

      {/* Floating Chat Assistant */}
      <ChatAssistant />
    </div>
  );
}

export default App;
