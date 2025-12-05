import React, { useState } from 'react';
import { LocalType } from '../types';
import { useApp } from '../contexts/AppContext';
import { SELLERS, PAYMENT_METHODS, LOCAL_CONFIG } from '../constants';
import { Save, CheckCircle } from 'lucide-react';

interface Props {
  local: LocalType;
}

export const SalesForm: React.FC<Props> = ({ local }) => {
  const { addSale } = useApp();
  const config = LOCAL_CONFIG[local];
  const [success, setSuccess] = useState(false);

  // Form State
  const [sellerName, setSellerName] = useState(SELLERS[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    addSale({
      id: crypto.randomUUID(),
      sellerName,
      paymentMethod,
      amount: Number(amount),
      timestamp: Date.now(),
      local
    });

    setSuccess(true);
    setAmount('');
    // Keep seller and method as they might repeat
    
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className={`text-xl font-bold mb-4 ${config.textClass}`}>Registrar Nuevo Ingreso</h3>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Ingreso registrado correctamente.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Vendedor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
          <select
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            className={`w-full p-2 border rounded-lg outline-none ${config.ringClass} focus:ring-2`}
          >
            {SELLERS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Row 2: Payment & Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={`w-full p-2 border rounded-lg outline-none ${config.ringClass} focus:ring-2`}
            >
              {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor ($)</label>
            <input
              required
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full p-2 border rounded-lg outline-none ${config.ringClass} focus:ring-2`}
              placeholder="0"
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 ${config.bgClass} ${config.hoverClass}`}
        >
          <Save className="w-5 h-5" />
          Guardar Ingreso – {config.name.replace('Local ', '')}
        </button>
      </form>
    </div>
  );
};