import { useState, useEffect } from 'react';
import MeatCalculator from './components/MeatCalculator';
import ChatAssistant from './components/ChatAssistant';
import ManualModal from './components/ManualModal';
import { Plus, X, Sun, Moon } from 'lucide-react';

function App() {
  const [tabs, setTabs] = useState([{ id: 1, name: '計算 1' }]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextId, setNextId] = useState(2);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

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
        <header className="text-center space-y-3 mb-6 relative">
          <div className="absolute left-0 top-0">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/10 transition-colors"
              title={isDarkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <div className="absolute right-0 top-0">
            <ManualModal />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-red-600 dark:from-rose-400 dark:to-red-500 pt-2">
            Red Meat Calc
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">赤肉仕込みをスマートに</p>
        </header>

        {/* Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all whitespace-nowrap border ${
                activeTabId === tab.id
                  ? 'bg-rose-100 dark:bg-rose-600/20 text-rose-600 dark:text-rose-300 border-rose-300 dark:border-rose-500/50 shadow-md shadow-rose-200 dark:shadow-rose-900/20'
                  : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10'
              }`}
            >
              {tab.name}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                  className="p-0.5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          {tabs.length < 5 && (
            <button
              onClick={addTab}
              className="flex items-center justify-center p-2 rounded-lg bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white transition-all border border-slate-200 dark:border-white/5"
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

        <footer className="text-center text-xs text-slate-400 dark:text-slate-500 pt-8 pb-4">
          &copy; {new Date().getFullYear()} Factory App
        </footer>
      </div>

      {/* Floating Chat Assistant */}
      <ChatAssistant />
    </div>
  );
}

export default App;
