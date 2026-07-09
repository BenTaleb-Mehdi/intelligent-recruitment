export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Chart 1: Bar Chart (Evolution des candidatures) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
        <h4 className="text-base font-semibold text-slate-800 mb-4">Évolution des Candidatures (Par semaine)</h4>
        <div className="h-64 flex items-end justify-between gap-2 pt-4 px-2">
          {/* S7aba dyal pure Tailwind custom charts bars */}
          {[
            { label: "Sem 1", value: "h-[30%]", count: 12 },
            { label: "Sem 2", value: "h-[55%]", count: 24 },
            { label: "Sem 3", value: "h-[45%]", count: 18 },
            { label: "Sem 4", value: "h-[85%]", count: 42 },
            { label: "Sem 5", value: "h-[70%]", count: 28 },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-xs font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">{bar.count}</span>
              <div className={`${bar.value} w-full bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-all cursor-pointer relative`}></div>
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 2: Doughnut Alternative (Répartition des scores IA) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="text-base font-semibold text-slate-800 mb-4">Répartition des Profils par Score IA</h4>
        <div className="space-y-4 pt-2">
          {[
            { label: "Top Match (80% - 100%)", count: "32 candidats", percent: 25, color: "bg-emerald-500" },
            { label: "Potentiel (50% - 80%)", count: "68 candidats", percent: 55, color: "bg-amber-500" },
            { label: "Non adapté (< 50%)", count: "24 candidats", percent: 20, color: "bg-rose-500" },
          ].map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-600">{item.label}</span>
                <span className="text-slate-900 font-bold">{item.count}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.percent}%` }}></div>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-slate-100 flex justify-center">
            <div className="text-center">
              <span className="text-2xl font-extrabold text-indigo-600">80%</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Précision actuelle du matching IA</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}