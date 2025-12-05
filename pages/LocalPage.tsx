import React, { useState } from 'react';
import { LocalType } from '../types';
import { useApp } from '../contexts/AppContext';
import { LOCAL_CONFIG } from '../constants';
import { SalesForm } from '../components/SalesForm';
import { Search } from '../components/Search';
import { Lock, History, ChevronDown, ChevronUp, AlertTriangle, Wallet, Receipt } from 'lucide-react';

interface Props {
  local: LocalType;
}

export const LocalPage: React.FC<Props> = ({ local }) => {
  const { role, state, closeDay } = useApp();
  const config = LOCAL_CONFIG[local];
  const sales = state.currentSales[local];
  const history = state.history[local];

  const [confirmClose, setConfirmClose] = useState(false);
  const [expandedDayId, setExpandedDayId] = useState<string | null>(null);

  const totalToday = sales.reduce((acc, curr) => acc + curr.amount, 0);

  // Calculate detailed stats for today
  const methodStats = sales.reduce<Record<string, { count: number, total: number }>>((acc, curr) => {
    const method = curr.paymentMethod;
    if (!acc[method]) {
      acc[method] = { count: 0, total: 0 };
    }
    acc[method].count += 1;
    acc[method].total += curr.amount;
    return acc;
  }, {});

  const sortedStats = (Object.entries(methodStats) as [string, { count: number; total: number }][])
    .sort(([, a], [, b]) => b.total - a.total);

  const handleCloseDay = () => {
    closeDay(local);
    setConfirmClose(false);
    alert('Día cerrado correctamente. Se ha iniciado un nuevo día.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className={`${config.bgClass} rounded-2xl p-6 text-white shadow-lg`}>
        <h2 className="text-3xl font-bold">{config.name}</h2>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="opacity-80">Total acumulado hoy:</span>
          <span className="text-4xl font-bold">${totalToday.toLocaleString()}</span>
        </div>
        {role === 'employee' && (
          <p className="mt-4 text-sm bg-white/20 p-2 rounded inline-block">
            Modo Asesor Comercial: Solo registro habilitado.
          </p>
        )}
      </div>

      {/* Main Action: Register */}
      <section>
        <SalesForm local={local} />
      </section>

      {/* Owner Only Sections */}
      {role === 'owner' && (
        <>
          {/* Payment Method Breakdown (Today) - Detailed Table */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${config.textClass}`}>
                <Wallet className="w-5 h-5" />
                Resumen de Caja por Método de Pago
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Método de Pago</th>
                    <th className="px-6 py-3 text-center">Cant. Ventas</th>
                    <th className="px-6 py-3 text-right">Total Recaudado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedStats.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-400 italic">
                        No hay ingresos registrados hoy.
                      </td>
                    </tr>
                  ) : (
                    sortedStats.map(([method, stats]) => (
                      <tr key={method} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{method}</td>
                        <td className="px-6 py-4 text-center text-gray-600">
                          <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs font-bold">
                            <Receipt className="w-3 h-3" />
                            {stats.count}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-right font-bold text-lg ${config.textClass}`}>
                          ${stats.total.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {sortedStats.length > 0 && (
                  <tfoot className="bg-gray-50 font-bold">
                    <tr>
                      <td className="px-6 py-3 text-gray-900">Total General</td>
                      <td className="px-6 py-3 text-center text-gray-900">{sales.length}</td>
                      <td className={`px-6 py-3 text-right ${config.textClass}`}>${totalToday.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </section>

          {/* Active Sales List (Today) */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className={`text-lg font-bold mb-4 ${config.textClass}`}>Detalle de Movimientos de Hoy ({sales.length})</h3>
            <div className="space-y-3">
              {sales.length === 0 ? (
                <p className="text-gray-400 italic">No hay registros hoy aún.</p>
              ) : (
                sales.map(sale => (
                  <div key={sale.id} className="flex justify-between items-center border-b pb-2 last:border-0 hover:bg-gray-50 p-2 rounded transition-colors">
                    <div>
                      <p className="font-bold text-gray-800">{sale.sellerName}</p>
                      <p className="text-xs text-gray-500 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded mt-1">
                        {sale.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${config.textClass}`}>${sale.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{new Date(sale.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Search */}
          <section>
            <Search data={[...sales, ...history.flatMap(h => h.sales)]} colorClass={config.textClass} />
          </section>

          {/* History */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <History className="w-5 h-5" />
              Historial de Días Cerrados
            </h3>
            
            {history.map((day, idx) => (
              <div key={day.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedDayId(expandedDayId === day.id ? null : day.id)}
                >
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Día Cerrado</span>
                    <h4 className="font-bold text-gray-800">{day.dateDisplay}</h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xl font-bold ${config.textClass}`}>${day.total.toLocaleString()}</span>
                    {expandedDayId === day.id ? <ChevronUp className="w-5 h-5 text-gray-400"/> : <ChevronDown className="w-5 h-5 text-gray-400"/>}
                  </div>
                </div>

                {expandedDayId === day.id && (
                  <div className="bg-gray-50 p-4 border-t">
                    <table className="w-full text-sm text-left">
                      <thead className="text-gray-500 font-medium border-b">
                        <tr>
                          <th className="pb-2">Vendedor</th>
                          <th className="pb-2">Método</th>
                          <th className="pb-2 text-right">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {day.sales.map(sale => (
                          <tr key={sale.id} className="border-b last:border-0">
                            <td className="py-2 font-bold text-gray-800">{sale.sellerName}</td>
                            <td className="py-2 text-gray-500">{sale.paymentMethod}</td>
                            <td className={`py-2 text-right font-bold ${config.textClass}`}>
                              ${sale.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </section>

          <section className="pt-4">
             <button
               onClick={() => setConfirmClose(true)}
               className="w-full py-4 border-2 border-red-100 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
             >
               <Lock className="w-5 h-5" />
               Cerrar Día – {config.name}
             </button>
             {confirmClose && (
               <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                 <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl">
                   <div className="flex flex-col items-center text-center mb-6">
                     <div className="bg-red-100 p-3 rounded-full mb-4">
                       <AlertTriangle className="w-8 h-8 text-red-600" />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900">¿Cerrar el día actual?</h3>
                     <p className="text-gray-500 mt-2">
                       No podrá registrar más ingresos ni modificar los existentes para este día. Se creará un nuevo día.
                     </p>
                   </div>
                   <div className="flex gap-3">
                     <button
                       onClick={() => setConfirmClose(false)}
                       className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200"
                     >
                       Cancelar
                     </button>
                     <button
                       onClick={handleCloseDay}
                       className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700"
                     >
                       Confirmar Cierre
                     </button>
                   </div>
                 </div>
               </div>
             )}
          </section>
        </>
      )}
    </div>
  );
};