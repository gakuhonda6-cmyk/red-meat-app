import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: 'こんにちは！赤肉の計算やルールについて、何でも質問してください。' }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMsg: Message = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.slice(1) })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '通信エラーが発生しました');
      }

      setMessages([...newMessages, { role: 'model', parts: [{ text: data.text }] }]);
    } catch (error: any) {
      setMessages([...newMessages, { role: 'model', parts: [{ text: `エラー: ${error.message}` }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-rose-900/50 transition-all z-40 ${isOpen ? 'scale-0' : 'scale-100 hover:scale-110'}`}
      >
        <MessageCircle size={28} />
      </button>

      <div className={`fixed bottom-0 md:bottom-6 md:right-6 w-full md:w-[400px] h-[80vh] md:h-[600px] bg-white dark:bg-slate-900 border-t md:border border-slate-200 dark:border-white/10 md:rounded-2xl shadow-2xl flex flex-col z-50 transition-all transform duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10 md:rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="bg-rose-500 p-2 rounded-lg text-white">
              <Bot size={20} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">計算AIアシスタント</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-sky-600' : 'bg-rose-600'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white"/> : <Bot size={16} className="text-white"/>}
              </div>
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] whitespace-pre-wrap text-sm leading-relaxed ${msg.role === 'user' ? 'bg-sky-100 dark:bg-sky-600/20 text-sky-900 dark:text-sky-100 border border-sky-200 dark:border-sky-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/5'}`}>
                {msg.parts[0].text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white"/>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 flex gap-1 items-center">
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-white/10 md:rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="質問を入力してください..."
              className="flex-1 bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-rose-600 text-white p-3 rounded-xl transition-colors shadow-lg shadow-rose-900/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
