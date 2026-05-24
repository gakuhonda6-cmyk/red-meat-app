import MeatCalculator from './components/MeatCalculator';

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center py-8 px-4 font-sans">
      <div className="w-full max-w-md mx-auto space-y-6">
        <header className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-500">
            Red Meat Calc
          </h1>
          <p className="text-sm text-slate-400">赤肉仕込みをスマートに</p>
        </header>

        <main>
          <MeatCalculator />
        </main>

        <footer className="text-center text-xs text-slate-500 pt-8 pb-4">
          &copy; {new Date().getFullYear()} Factory App
        </footer>
      </div>
    </div>
  );
}

export default App;
