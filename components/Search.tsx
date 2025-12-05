import React, { useState } from 'react';
import { Sale } from '../types';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  data: Sale[];
  colorClass: string;
}

export const Search: React.FC<Props> = ({ data, colorClass }) => {
  const [term, setTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [minVal, setMinVal] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredData = data.filter(item => {
    const matchesTerm = 
      item.sellerName.toLowerCase().includes(term.toLowerCase()) ||
      item.paymentMethod.toLowerCase().includes(term.toLowerCase());

    const matchesMin = minVal ? item.amount >= Number(minVal) : true;
    
    // Simple date string match YYYY-MM-DD
    const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
    const matchesDate = dateFilter ? itemDate === dateFilter : true;

    return matchesTerm && matchesMin && matchesDate;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`p-4 border-b border-gray-100 flex items-center justify-between ${isExpanded ? 'bg-gray-50' : ''}`}>
        <div className="flex items-center gap-2 text-gray-700">
          <SearchIcon className={`w-5 h-5 ${colorClass}`} />
          <span className="font-semibold">Buscador {isExpanded ? 'Avanzado' : ''}</span>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-500 hover:text-gray-900 underline"
        >
          {isExpanded ? 'Ocultar' : 'Mostrar filtros'}
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por vendedor, método de pago..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-200 outline-none"
          />
          <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        {isExpanded && (
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Valor Mínimo</label>
              <input 
                type="number" 
                value={minVal} 
                onChange={e => setMinVal(e.target.value)}
                className="w-full mt-1 p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Fecha Exacta</label>
              <input 
                type="date" 
                value={dateFilter} 
                onChange={e => setDateFilter(e.target.value)}
                className="w-full mt-1 p-2 border rounded text-sm"
              />
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="mt-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
            Resultados ({filteredData.length})
          </h4>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredData.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No se encontraron registros.</p>
            ) : (
              filteredData.map(sale => (
                <div key={sale.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>{sale.sellerName}</span>
                    <span className={colorClass}>${sale.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-gray-500 text-xs flex justify-between mt-1">
                    <span>{sale.paymentMethod}</span>
                    <span>{new Date(sale.timestamp).toLocaleDateString()} {new Date(sale.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};