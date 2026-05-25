import { useState, useMemo } from 'react';
import { Beef, Snowflake, Scale, Package, Calculator, Scissors, Flame, Beaker } from 'lucide-react';

function calculateMeatOnly(totalMeatKg: number) {
  const num6 = Math.floor(totalMeatKg / 6);
  const rem1 = totalMeatKg - num6 * 6;
  const num3 = Math.floor(rem1 / 3);
  const remainder = rem1 - num3 * 3;
  return { p6kg: num6, p3kg: num3, remainder, totalMeat: totalMeatKg };
}

function calculateTomatoIce(totalBarrels: number) {
  let best6 = 0, best5 = 0, bestRem = totalBarrels;
  for (let i = Math.floor(totalBarrels / 6); i >= 0; i--) {
    const rem = totalBarrels - i * 6;
    const j = Math.floor(rem / 5);
    const remRem = rem - j * 5;
    if (remRem < bestRem) {
      bestRem = remRem;
      best6 = i;
      best5 = j;
    }
    if (bestRem === 0) break;
  }
  return { p6barrels: best6, p5barrels: best5, remBarrels: bestRem };
}

export default function MeatCalculator() {
  const [mode, setMode] = useState<'salt' | 'weight' | 'barrels'>('weight');
  const [subMode, setSubMode] = useState<'combined' | 'meat' | 'tomato'>('combined');
  const [inputValue, setInputValue] = useState<string>('');

  const [parisawBarrels, setParisawBarrels] = useState<number>(0);
  const [bistroBarrels, setBistroBarrels] = useState<number>(0);
  const [salamiBarrels, setSalamiBarrels] = useState<number>(0);

  const data = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val <= 0) return null;

    if (mode === 'salt') {
      return { isSalt: true, saltAmount: val * 0.03 };
    }

    const isWeight = mode === 'weight';
    const isBarrels = mode === 'barrels';

    let combinedBarrels = 0;
    let combinedMeat = null;
    let combinedTomato = null;
    let combinedLeftover = 0;

    let actualMeatOnlyKg = 0;
    let actualTomatoMeatKg = 0;

    if (isWeight) {
      combinedBarrels = Math.floor(val / 3.3);
      actualMeatOnlyKg = combinedBarrels * 1.5;
      actualTomatoMeatKg = combinedBarrels * 1.8;
      
      combinedMeat = calculateMeatOnly(actualMeatOnlyKg);
      combinedTomato = calculateTomatoIce(combinedBarrels);
      combinedLeftover = val - combinedBarrels * 3.3;
    } else {
      const totalBarrels = val;
      const standardBarrels = Math.max(0, totalBarrels - bistroBarrels - salamiBarrels - parisawBarrels);
      
      const totalMeatKg = (standardBarrels * 1.5) + (bistroBarrels * 2.0) + (salamiBarrels * 1.5) + (parisawBarrels * 3.0);
      const totalTomatoBarrels = (standardBarrels * 1.0) + (bistroBarrels * 1.0) + (salamiBarrels * 0.5) + (parisawBarrels * (4/3));

      actualMeatOnlyKg = totalMeatKg;
      actualTomatoMeatKg = totalTomatoBarrels * 1.8;

      combinedBarrels = totalBarrels;
      combinedMeat = calculateMeatOnly(totalMeatKg);
      combinedTomato = calculateTomatoIce(totalTomatoBarrels);
      combinedLeftover = 0;
    }

    const exclusiveMeat = isWeight ? calculateMeatOnly(val) : null;

    let exclusiveTomato = null;
    let exclusiveTomatoLeftover = 0;
    let exclusiveTomatoBarrels = 0;
    if (isWeight) {
      exclusiveTomatoBarrels = Math.floor(val / 1.8);
      exclusiveTomato = calculateTomatoIce(exclusiveTomatoBarrels);
      exclusiveTomatoLeftover = val - exclusiveTomatoBarrels * 1.8;
    }

    return {
      isSalt: false,
      val,
      isWeight,
      isBarrels,
      standardBarrels: isBarrels ? Math.max(0, val - bistroBarrels - salamiBarrels - parisawBarrels) : 0,
      bistroBarrels,
      salamiBarrels,
      parisawBarrels,
      actualMeatOnlyKg,
      actualTomatoMeatKg,
      combined: { barrels: combinedBarrels, meat: combinedMeat, tomato: combinedTomato, leftover: combinedLeftover },
      exclusiveMeat,
      exclusiveTomato: exclusiveTomato ? { barrels: exclusiveTomatoBarrels, tomato: exclusiveTomato, leftover: exclusiveTomatoLeftover } : null,
    };
  }, [inputValue, mode, bistroBarrels, salamiBarrels, parisawBarrels]);

  const handleModeSwitch = (newMode: 'salt' | 'weight' | 'barrels') => {
    setMode(newMode);
    setInputValue('');
    if (newMode !== 'weight') setSubMode('combined');
    if (newMode !== 'barrels') {
      setParisawBarrels(0);
      setBistroBarrels(0);
      setSalamiBarrels(0);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="glass-panel p-6 space-y-6">
        <div className="flex bg-slate-200/50 dark:bg-black/40 rounded-lg p-1 backdrop-blur-sm border border-slate-300 dark:border-white/5">
          <button
            onClick={() => handleModeSwitch('weight')}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-md text-[13px] font-medium transition-all duration-300 ${
              mode === 'weight' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Scale size={14} />
            総重量(kg)
          </button>
          <button
            onClick={() => handleModeSwitch('barrels')}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-md text-[13px] font-medium transition-all duration-300 ${
              mode === 'barrels' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Package size={14} />
            タル数
          </button>
          <button
            onClick={() => handleModeSwitch('salt')}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-md text-[13px] font-medium transition-all duration-300 ${
              mode === 'salt' ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Beaker size={14} />
            塩の量(g)
          </button>
        </div>

        <div className="relative">
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={mode === 'salt' ? "例: 1500" : mode === 'weight' ? "例: 49.5" : "例: 15"}
            className="w-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-xl px-4 py-4 text-3xl font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-center"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium">
            {mode === 'salt' ? 'g' : mode === 'weight' ? 'kg' : 'タル'}
          </div>
        </div>
        
        {mode === 'barrels' && parseFloat(inputValue) > 0 && (
          <div className="bg-slate-50 dark:bg-black/30 p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>イレギュラーなソーセージ</span>
              <span className="text-xs font-normal text-slate-500">
                通常: <span className="font-bold text-slate-800 dark:text-white">{Math.max(0, parseFloat(inputValue) - bistroBarrels - salamiBarrels - parisawBarrels)}</span> タル
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block text-center">パリソー</label>
                <input type="number" min="0" value={parisawBarrels || ''} onChange={e => setParisawBarrels(parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-2 py-1.5 text-center text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500/50" placeholder="0" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block text-center">ビストロ</label>
                <input type="number" min="0" value={bistroBarrels || ''} onChange={e => setBistroBarrels(parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-2 py-1.5 text-center text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500/50" placeholder="0" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block text-center">玄米/サラミ</label>
                <input type="number" min="0" value={salamiBarrels || ''} onChange={e => setSalamiBarrels(parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg px-2 py-1.5 text-center text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500/50" placeholder="0" />
              </div>
            </div>
          </div>
        )}
      </div>

      {data && !data.isSalt && mode === 'weight' && (
        <div className="flex p-1 bg-slate-200/50 dark:bg-black/40 rounded-xl border border-slate-300 dark:border-white/5 backdrop-blur-sm">
          <button onClick={() => setSubMode('combined')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${subMode === 'combined' ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>通常 (両方)</button>
          <button onClick={() => setSubMode('meat')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${subMode === 'meat' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>肉のみ 全量</button>
          <button onClick={() => setSubMode('tomato')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${subMode === 'tomato' ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>トマト氷 全量</button>
        </div>
      )}

      {data && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
          {mode === 'salt' && data.isSalt && (
            <div className="glass-panel p-8 text-center border-amber-300 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-950/20">
              <div className="text-amber-600 dark:text-amber-400 text-sm font-semibold mb-3 flex items-center justify-center gap-2"><Beaker size={18}/>必要な塩の量 (3%)</div>
              <div className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">{data.saltAmount?.toFixed(1)} <span className="text-2xl text-amber-600 dark:text-amber-200/70 font-medium">g</span></div>
            </div>
          )}

          {!data.isSalt && subMode === 'combined' && data.combined && (
            <>
              {mode === 'weight' ? (
                <div className="glass-panel p-4 text-center border-emerald-300 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20">
                  <div className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1 flex items-center justify-center gap-2"><Calculator size={16}/>ソーセージ作成分</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.combined.barrels} <span className="text-base text-emerald-600 dark:text-emerald-200/70 font-medium">タル分</span></div>
                  {data.combined.leftover > 0 && (
                    <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-2 bg-emerald-100 dark:bg-emerald-900/40 py-1 px-3 rounded-full inline-block border border-emerald-200 dark:border-transparent">余り肉: {data.combined.leftover.toFixed(1)}kg</div>
                  )}
                </div>
              ) : mode === 'barrels' ? (
                <div className="glass-panel p-4 text-center border-emerald-300 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-950/20">
                  <div className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1 flex items-center justify-center gap-2"><Beef size={16}/>必要な赤肉（くず肉）の総量</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{(data.actualMeatOnlyKg + data.actualTomatoMeatKg).toFixed(1)} <span className="text-base text-emerald-600 dark:text-emerald-200/70 font-medium">kg</span></div>
                  <div className="flex justify-center gap-3 mt-3 text-xs md:text-sm">
                    <div className="bg-rose-100 dark:bg-rose-900/40 py-1 px-3 rounded-full text-rose-700 dark:text-rose-200 border border-rose-300 dark:border-rose-800/50">
                      肉のみ用: <span className="font-bold">{data.actualMeatOnlyKg.toFixed(1)}</span>kg
                    </div>
                    <div className="bg-sky-100 dark:bg-sky-900/40 py-1 px-3 rounded-full text-sky-700 dark:text-sky-200 border border-sky-300 dark:border-sky-800/50">
                      トマト氷用: <span className="font-bold">{data.actualTomatoMeatKg.toFixed(1)}</span>kg
                    </div>
                  </div>
                </div>
              ) : null}

              <MeatOnlyCard meatOnly={data.combined.meat} />
              <TomatoIceCard tomatoIce={data.combined.tomato} />
            </>
          )}

          {!data.isSalt && subMode === 'meat' && data.exclusiveMeat && (
            <>
               <div className="glass-panel p-4 text-center border-rose-300 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/20">
                  <div className="text-rose-600 dark:text-rose-400 text-sm font-semibold mb-1 flex items-center justify-center gap-2"><Flame size={16}/>全量を肉のみにする場合</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{(data.exclusiveMeat.p6kg * 4 + data.exclusiveMeat.p3kg * 2)} <span className="text-base text-rose-600 dark:text-rose-200/70 font-medium">タル分</span></div>
                  <div className="text-xs text-rose-700 dark:text-rose-300 mt-2 bg-rose-100 dark:bg-rose-900/40 py-1 px-3 rounded-full inline-block border border-rose-200 dark:border-transparent">
                    使用可能な肉: {(data.exclusiveMeat.p6kg * 6 + data.exclusiveMeat.p3kg * 3).toFixed(1)}kg
                    {data.exclusiveMeat.remainder > 0 && ` / 余り肉: ${data.exclusiveMeat.remainder.toFixed(1)}kg`}
                  </div>
                </div>
              <MeatOnlyCard meatOnly={data.exclusiveMeat} />
            </>
          )}

          {!data.isSalt && subMode === 'tomato' && data.exclusiveTomato && (
            <>
               <div className="glass-panel p-4 text-center border-sky-300 dark:border-sky-900/30 bg-sky-50 dark:bg-sky-950/20">
                  <div className="text-sky-600 dark:text-sky-400 text-sm font-semibold mb-1 flex items-center justify-center gap-2"><Flame size={16}/>全量をトマト氷にする場合</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{data.exclusiveTomato.barrels} <span className="text-base text-sky-600 dark:text-sky-200/70 font-medium">タル分</span></div>
                  {data.exclusiveTomato.leftover > 0 && (
                    <div className="text-xs text-sky-700 dark:text-sky-300 mt-2 bg-sky-100 dark:bg-sky-900/40 py-1 px-3 rounded-full inline-block border border-sky-200 dark:border-transparent">余り肉: {data.exclusiveTomato.leftover.toFixed(1)}kg</div>
                  )}
                </div>
              <TomatoIceCard tomatoIce={data.exclusiveTomato.tomato} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MeatOnlyCard({ meatOnly }: { meatOnly: ReturnType<typeof calculateMeatOnly> }) {
  return (
    <div className="glass-panel overflow-hidden border-rose-200 dark:border-rose-900/30">
      <div className="bg-rose-100 dark:bg-rose-950/40 p-4 border-b border-rose-200 dark:border-white/5 flex items-center gap-3">
        <div className="p-2 bg-rose-200 dark:bg-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400">
          <Beef size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">肉のみ</h2>
        <span className="ml-auto text-sm text-rose-700 dark:text-rose-200 font-medium bg-rose-200/50 dark:bg-rose-900/50 px-2 py-1 rounded">
          計算対象: {meatOnly.totalMeat.toFixed(1)}kg
        </span>
      </div>
      <div className="p-4 space-y-3">
        {meatOnly.p6kg > 0 && (
          <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
            <div>
              <div className="font-bold text-slate-900 dark:text-rose-100 text-lg">6kg <span className="text-sm text-slate-500 dark:text-slate-400 font-normal ml-2">(4タル分)</span></div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">塩: <span className="text-rose-600 dark:text-rose-300 font-medium">180g</span></div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-black/30 px-4 py-1 rounded-lg">
              {meatOnly.p6kg}<span className="text-sm text-slate-500 dark:text-slate-400 ml-1">個</span>
            </div>
          </div>
        )}
        {meatOnly.p3kg > 0 && (
          <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/5 shadow-sm">
            <div>
              <div className="font-bold text-slate-900 dark:text-rose-100 text-lg">3kg <span className="text-sm text-slate-500 dark:text-slate-400 font-normal ml-2">(2タル分)</span></div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">塩: <span className="text-rose-600 dark:text-rose-300 font-medium">90g</span></div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-black/30 px-4 py-1 rounded-lg">
              {meatOnly.p3kg}<span className="text-sm text-slate-500 dark:text-slate-400 ml-1">個</span>
            </div>
          </div>
        )}
        {meatOnly.remainder > 0 && (
          <div className="flex justify-between items-center bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-300 dark:border-rose-900/50 border-dashed">
            <div className="flex items-center gap-2">
              <Scissors size={16} className="text-rose-500 dark:text-rose-400"/>
              <div className="font-bold text-rose-600 dark:text-rose-300 text-base">余り肉</div>
            </div>
            <div className="text-xl font-bold text-rose-700 dark:text-rose-200 bg-rose-200/50 dark:bg-rose-900/30 px-3 py-1 rounded-lg">
              {meatOnly.remainder.toFixed(1)}<span className="text-sm text-rose-500 dark:text-rose-400 ml-1">kg</span>
            </div>
          </div>
        )}
        {meatOnly.p6kg === 0 && meatOnly.p3kg === 0 && meatOnly.remainder === 0 && (
           <div className="text-center text-slate-500 text-sm py-2">分量がありません</div>
        )}
      </div>
    </div>
  );
}

function TomatoIceCard({ tomatoIce }: { tomatoIce: ReturnType<typeof calculateTomatoIce> }) {
  if (tomatoIce.p6barrels === 0 && tomatoIce.p5barrels === 0 && tomatoIce.remBarrels === 0) {
    return (
      <div className="glass-panel overflow-hidden border-sky-200 dark:border-sky-900/30">
        <div className="bg-sky-50 dark:bg-sky-950/40 p-4 border-b border-sky-200 dark:border-white/5 flex items-center gap-3">
          <div className="p-2 bg-sky-200 dark:bg-sky-500/20 rounded-lg text-sky-600 dark:text-sky-400"><Snowflake size={20} /></div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">トマト氷</h2>
        </div>
        <div className="p-6 text-center text-slate-500 text-sm">分量がありません</div>
      </div>
    )
  }

  return (
    <div className="glass-panel overflow-hidden border-sky-200 dark:border-sky-900/30">
      <div className="bg-sky-50 dark:bg-sky-950/40 p-4 border-b border-sky-200 dark:border-white/5 flex items-center gap-3">
        <div className="p-2 bg-sky-200 dark:bg-sky-500/20 rounded-lg text-sky-600 dark:text-sky-400">
          <Snowflake size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">トマト氷</h2>
      </div>
      <div className="p-4 space-y-4">
        
        {tomatoIce.p6barrels > 0 && (
          <div className="space-y-2 bg-white dark:bg-black/20 p-4 rounded-xl border border-sky-200 dark:border-sky-900/30 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/5">
              <div className="font-bold text-sky-700 dark:text-sky-200 text-lg">6タル分</div>
              <div className="text-xl font-bold text-sky-800 dark:text-sky-100 bg-sky-100 dark:bg-sky-900/40 px-3 py-0.5 rounded-lg border border-sky-300 dark:border-sky-500/20">
                {tomatoIce.p6barrels}<span className="text-sm text-sky-600 dark:text-sky-300/60 ml-1">個</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm pt-1">
              <div className="bg-slate-50 dark:bg-white/5 p-2 rounded flex flex-col gap-1">
                <span className="text-xs text-sky-600 dark:text-sky-300 font-semibold">肉 ＋ 塩</span>
                <span className="text-slate-800 dark:text-white">肉 <span className="font-bold text-base">7.2</span>kg</span>
                <span className="text-slate-800 dark:text-white">塩 <span className="font-bold text-base">216</span>g</span>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-2 rounded flex flex-col gap-1">
                <span className="text-xs text-sky-600 dark:text-sky-300 font-semibold">肉 ＋ 脂</span>
                <span className="text-slate-800 dark:text-white">肉 <span className="font-bold text-base">3.6</span>kg</span>
                <span className="text-slate-800 dark:text-white">脂 <span className="font-bold text-base">3.6</span>kg</span>
              </div>
            </div>
          </div>
        )}

        {tomatoIce.p5barrels > 0 && (
          <div className="space-y-2 bg-white dark:bg-black/20 p-4 rounded-xl border border-sky-200 dark:border-sky-900/30 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/5">
              <div className="font-bold text-sky-700 dark:text-sky-200 text-lg">5タル分</div>
              <div className="text-xl font-bold text-sky-800 dark:text-sky-100 bg-sky-100 dark:bg-sky-900/40 px-3 py-0.5 rounded-lg border border-sky-300 dark:border-sky-500/20">
                {tomatoIce.p5barrels}<span className="text-sm text-sky-600 dark:text-sky-300/60 ml-1">個</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm pt-1">
              <div className="bg-slate-50 dark:bg-white/5 p-2 rounded flex flex-col gap-1">
                <span className="text-xs text-sky-600 dark:text-sky-300 font-semibold">肉 ＋ 塩</span>
                <span className="text-slate-800 dark:text-white">肉 <span className="font-bold text-base">6.0</span>kg</span>
                <span className="text-slate-800 dark:text-white">塩 <span className="font-bold text-base">180</span>g</span>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-2 rounded flex flex-col gap-1">
                <span className="text-xs text-sky-600 dark:text-sky-300 font-semibold">肉 ＋ 脂</span>
                <span className="text-slate-800 dark:text-white">肉 <span className="font-bold text-base">3.0</span>kg</span>
                <span className="text-slate-800 dark:text-white">脂 <span className="font-bold text-base">3.0</span>kg</span>
              </div>
            </div>
          </div>
        )}

        {tomatoIce.remBarrels > 0 && (
          <div className="space-y-2 bg-white dark:bg-black/20 p-4 rounded-xl border border-slate-300 dark:border-slate-700/50 shadow-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/5">
              <div className="font-bold text-slate-700 dark:text-slate-300 text-lg">端数 ({tomatoIce.remBarrels}タル分)</div>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-0.5 rounded-lg border border-slate-300 dark:border-slate-600">
                1<span className="text-sm text-slate-500 dark:text-slate-400 ml-1">個</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm pt-1">
              <div className="bg-slate-50 dark:bg-white/5 p-2 rounded flex flex-col gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">肉 ＋ 塩</span>
                <span className="text-slate-800 dark:text-white">肉 <span className="font-bold text-base">{(1.2 * tomatoIce.remBarrels).toFixed(1)}</span>kg</span>
                <span className="text-slate-800 dark:text-white">塩 <span className="font-bold text-base">{36 * tomatoIce.remBarrels}</span>g</span>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-2 rounded flex flex-col gap-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">肉 ＋ 脂</span>
                <span className="text-slate-800 dark:text-white">肉 <span className="font-bold text-base">{(0.6 * tomatoIce.remBarrels).toFixed(1)}</span>kg</span>
                <span className="text-slate-800 dark:text-white">脂 <span className="font-bold text-base">{(0.6 * tomatoIce.remBarrels).toFixed(1)}</span>kg</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
