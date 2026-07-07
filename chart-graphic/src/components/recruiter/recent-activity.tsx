import recentActivityData from "@/data/recent-activity.json";

export default function RecentActivity() {
  const candidates = recentActivityData.candidates;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
        <h4 className="text-base font-semibold text-slate-800">Candidatures Récentes & Score de Matching IA</h4>
        <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">Voir tout</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <th className="px-6 py-3">Candidat</th>
              <th className="px-6 py-3">Poste visé</th>
              <th className="px-6 py-3">Date de postulation</th>
              <th className="px-6 py-3 text-right">Score IA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {candidates.map((cand, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-800">{cand.name}</td>
                <td className="px-6 py-4 text-slate-500">{cand.role}</td>
                <td className="px-6 py-4 text-slate-400 text-xs">{cand.time}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${cand.statusClass}`}>
                    {cand.score}% match
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}