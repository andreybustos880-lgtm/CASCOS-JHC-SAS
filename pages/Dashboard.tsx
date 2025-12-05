import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Search } from '../components/Search';
import { TrendingUp, Calendar, DollarSign, Wallet } from 'lucide-react';

export const Dashboard = () => {
  const { state } = useApp();
  
  // Calculate totals for active day
  const totalActiveEsquina = state.currentSales.esquina.reduce((acc, curr) => acc + curr.amount, 0);
  const totalActivePrincipal = state.currentSales.principal.reduce((acc, curr) => acc + curr.amount, 0);
  const globalActive = totalActiveEsquina + totalActivePrincipal;

  // Calculate totals by payment method (Global Active)
  const allActiveSales = [...state.currentSales.esquina, ...state.currentSales.principal];
  const methodTotals = allActiveSales.reduce<Record<string, number>>((acc, curr) => {
    const method = curr.paymentMethod;
    acc[method] = (acc[method] || 0) + curr.amount;
    return acc;
  }, {});

  const activeMethods = Object.entries(methodTotals)
    .filter(([_, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a);

  // Combine all history for global view (simplified grouping by date logic)
  const allHistory = [
    ...state.history.esquina,
    ...state.history.principal
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group history by date string (YYYY-MM-DD)
  const groupedHistory: Record<string, { date: string, esquina: number, principal: number }> = {};

  allHistory.forEach(record => {
    const dayKey = record.date.split('T')[0];
    if (!groupedHistory[dayKey]) {
      groupedHistory[dayKey] = {
        date: record.dateDisplay,
        esquina: 0,
        principal: 0
      };
    }
    groupedHistory[dayKey][record.local] += record.total;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Resumen Global</h2>
        <p className="text-gray-500">Vista general de ambos locales</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
          <p className="text-red-600 font-medium mb-1">Activo Esquina</p>
          <p className="text-3xl font-bold text-red-900">${totalActiveEsquina.toLocaleString()}</p>
        </div>
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
          <p className="text-amber-700 font-medium mb-1">Activo Principal</p>
          <p className="text-3xl font-bold text-amber-900">${totalActivePrincipal.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-2xl text-white shadow-xl">
          <p className="text-gray-400 font-medium mb-1">Total Global (Activo)</p>
          <p className="text-4xl font-bold">${globalActive.toLocaleString()}</p>
        </div>
      </div>

      {/* Payment Method Breakdown */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-600" />
          Desglose Global por Método de Pago (Hoy)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeMethods.length === 0 ? (
             <p className="text-gray-400 text-sm italic col-span-full">No hay ventas registradas hoy.</p>
          ) : (
            activeMethods.map(([method, amount]) => (
              <div key={method} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{method}</span>
                <span className="text-xl font-bold text-gray-900">${amount.toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Global History */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
           <Calendar className="w-5 h-5" />
           Historial Global Combinado
        </h3>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Fecha</th>
                <th className="p-4 font-semibold text-red-600">Esquina</th>
                <th className="p-4 font-semibold text-amber-600">Principal</th>
                <th className="p-4 font-semibold text-gray-900 text-right">Total Día</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(groupedHistory).length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400">No hay días cerrados en el historial.</td>
                </tr>
              ) : (
                Object.values(groupedHistory).map((day, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{day.date}</td>
                    <td className="p-4 text-red-600">${day.esquina.toLocaleString()}</td>
                    <td className="p-4 text-amber-700">${day.principal.toLocaleString()}</td>
                    <td className="p-4 text-right font-bold text-gray-900">
                      ${(day.esquina + day.principal).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Global Search */}
      <section>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
           <SearchIcon />
           Buscador Global
        </h3>
        <Search 
          data={[
            ...state.currentSales.esquina, 
            ...state.currentSales.principal,
            ...state.history.esquina.flatMap(d => d.sales),
            ...state.history.principal.flatMap(d => d.sales)
          ]} 
          colorClass="text-blue-600"
        />
      </section>
    </div>
  );
};

// Helper for icon
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);