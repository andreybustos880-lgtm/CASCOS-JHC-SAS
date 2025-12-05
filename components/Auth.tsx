import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { OWNER_PASSWORD } from '../constants';
import { Shield, User, Lock, AlertCircle } from 'lucide-react';

export const Auth = () => {
  const { setRole } = useApp();
  const [mode, setMode] = useState<'initial' | 'owner_login'>('initial');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === OWNER_PASSWORD) {
      setRole('owner');
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
    }
  };

  if (mode === 'initial') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Cascos JHC S.A.S</h1>
            <p className="text-gray-500 mb-8">Bienvenido. Seleccione su modo de acceso.</p>
            
            <div className="space-y-4">
              <button
                onClick={() => setRole('employee')}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="bg-blue-100 p-2 rounded-full group-hover:bg-blue-200">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-gray-700">Ingresar como Asesor Comercial</span>
                  <span className="text-sm text-gray-400">Solo registro de ventas</span>
                </div>
              </button>

              <button
                onClick={() => setMode('owner_login')}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-purple-100 hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <div className="bg-purple-100 p-2 rounded-full group-hover:bg-purple-200">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-gray-700">Ingresar como Administrador</span>
                  <span className="text-sm text-gray-400">Acceso total al sistema</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8">
        <button 
          onClick={() => setMode('initial')}
          className="text-sm text-gray-500 hover:text-gray-800 mb-4 flex items-center gap-1"
        >
          ← Volver
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Lock className="w-6 h-6" />
          Acceso Administrador
        </h2>

        <form onSubmit={handleOwnerLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Ingrese su clave"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
          >
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
};