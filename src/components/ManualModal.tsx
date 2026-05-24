import { X, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function ManualModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-200 dark:bg-white/5 px-3 py-1.5 rounded-full text-xs font-semibold"
      >
        <HelpCircle size={14} />
        使い方
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 w-full max-w-md h-[85vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10 sticky top-0 z-10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle size={20} className="text-rose-500" />
                アプリの使い方
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-12">
              
              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-rose-600 dark:text-rose-400 font-bold text-lg">STEP 1: 計算モードを選ぶ</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">一番上のタブから「総重量」「タル数」「塩の量」の基準となるモードを選択します。</p>
                </div>
                <img src="/manual/screenshot1_initial.png" alt="初期画面" className="w-full rounded-xl border border-slate-200 dark:border-white/10 shadow-lg" />
              </section>

              <div className="h-px w-full bg-slate-200 dark:bg-white/10"></div>

              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-rose-600 dark:text-rose-400 font-bold text-lg">STEP 2: 数字を入力して確認</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">数字を入力するだけで、必要な「作れるタル数」や「各パックの個数」が一瞬で計算され、画面下に表示されます。この通りに準備するだけでOKです！</p>
                </div>
                <img src="/manual/screenshot2_weight.png" alt="総重量の計算" className="w-full rounded-xl border border-slate-200 dark:border-white/10 shadow-lg" />
              </section>

              <div className="h-px w-full bg-slate-200 dark:bg-white/10"></div>

              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-rose-600 dark:text-rose-400 font-bold text-lg">STEP 3: タル数からの逆算も</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">「タル数」モードなら、目標のタル数を入力するだけで『必要な赤肉の総量』や内訳がわかります。</p>
                </div>
                <img src="/manual/screenshot3_barrels.png" alt="タル数の計算" className="w-full rounded-xl border border-slate-200 dark:border-white/10 shadow-lg" />
              </section>

              <div className="h-px w-full bg-slate-200 dark:bg-white/10"></div>

              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-rose-600 dark:text-rose-400 font-bold text-lg">STEP 4: 複数タブで並行作業</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">「＋」ボタンで計算タブを増やせます。午前の仕込みと午後の仕込みなど、複数の計算結果を消さずに保存しながら見比べることができます。</p>
                </div>
                <img src="/manual/screenshot4_tabs.png" alt="複数タブ" className="w-full rounded-xl border border-slate-200 dark:border-white/10 shadow-lg" />
              </section>

              <div className="h-px w-full bg-slate-200 dark:bg-white/10"></div>

              <section className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-rose-600 dark:text-rose-400 font-bold text-lg">STEP 5: 困ったらAIに相談！</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">右下のチャットボタン（💬）を押すと、計算ルールを全て暗記しているAIが登場します。「5タルだと塩は何グラム？」など何でも聞いてください。</p>
                </div>
                <img src="/manual/screenshot5_chat.png" alt="AIチャット" className="w-full rounded-xl border border-slate-200 dark:border-white/10 shadow-lg" />
              </section>

              <div className="pt-4 pb-8 text-center text-slate-500 text-sm">
                これで使い方はバッチリです！
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
