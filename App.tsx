import React, { useState } from 'react';
import { useApp } from './contexts/AppContext';
import { Auth } from './components/Auth';
import { LocalPage } from './pages/LocalPage';
import { Dashboard } from './pages/Dashboard';
import { LogOut, Home, Store, BarChart3 } from 'lucide-react';

type View = 'dashboard' | 'esquina' | 'principal';

const App = () => {
  const { role, resetApp } = useApp();
  const [currentView, setCurrentView] = useState<View>('esquina'); // Default to one local

  if (!role) {
    return <Auth />;
  }

  const NavButton = ({ view, label, icon: Icon, colorClass }: any) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex-1 flex flex-col items-center justify-center p-3 gap-1 transition-colors ${
        currentView === view 
          ? 'text-gray-900 bg-gray-100 font-bold' 
          : 'text-gray-400 hover:text-gray-600'
      } ${currentView === view ? colorClass : ''}`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* Top Bar */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Cascos JHC</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium uppercase">
              {role === 'owner' ? 'Administrador' : 'Asesor Comercial'}
            </span>
          </div>
          <button 
            onClick={resetApp}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {currentView === 'esquina' && <LocalPage local="esquina" />}
        {currentView === 'principal' && <LocalPage local="principal" />}
        {currentView === 'dashboard' && role === 'owner' && <Dashboard />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t sticky bottom-0 pb-safe">
        <div className="flex justify-around max-w-5xl mx-auto">
          <NavButton 
            view="esquina" 
            label="Local Esquina" 
            icon={Store} 
            colorClass="text-red-600"
          />
          
          <NavButton 
            view="principal" 
            label="Local Principal" 
            icon={Store} 
            colorClass="text-amber-600"
          />

          {role === 'owner' && (
            <NavButton 
              view="dashboard" 
              label="Totales" 
              icon={BarChart3} 
              colorClass="text-blue-600"
            />
          )}
        </div>
      </nav>
    </div>
  );
};

export default App;