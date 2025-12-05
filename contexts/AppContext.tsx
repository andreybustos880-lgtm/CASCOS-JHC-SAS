import React, { createContext, useContext, useState, useEffect, ReactNode, PropsWithChildren } from 'react';
import { Role, Sale, DayRecord, LocalType, AppState } from '../types';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  state: AppState;
  addSale: (sale: Sale) => void;
  closeDay: (local: LocalType) => void;
  resetApp: () => void; // Logout
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_STATE: AppState = {
  currentSales: {
    esquina: [],
    principal: []
  },
  history: {
    esquina: [],
    principal: []
  }
};

export const AppProvider = ({ children }: PropsWithChildren<{}>) => {
  const [role, setRole] = useState<Role>(null);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('cascos_app_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('cascos_app_state', JSON.stringify(state));
  }, [state]);

  const addSale = (sale: Sale) => {
    setState(prev => ({
      ...prev,
      currentSales: {
        ...prev.currentSales,
        [sale.local]: [sale, ...prev.currentSales[sale.local]] // Add to top
      }
    }));
  };

  const closeDay = (local: LocalType) => {
    const salesToClose = state.currentSales[local];
    if (salesToClose.length === 0) {
        // Allow closing empty days? Requirement implies moving forward, so yes, or alert.
        // We will proceed to create a "Zero" record.
    }

    const total = salesToClose.reduce((acc, curr) => acc + curr.amount, 0);
    const now = new Date();
    
    const newDayRecord: DayRecord = {
      id: crypto.randomUUID(),
      date: now.toISOString(),
      dateDisplay: now.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      sales: salesToClose,
      total,
      local,
      closedAt: Date.now()
    };

    setState(prev => ({
      ...prev,
      currentSales: {
        ...prev.currentSales,
        [local]: [] // Reset current sales
      },
      history: {
        ...prev.history,
        [local]: [newDayRecord, ...prev.history[local]] // Add to history
      }
    }));
  };

  const resetApp = () => {
    setRole(null);
  };

  return (
    <AppContext.Provider value={{ role, setRole, state, addSale, closeDay, resetApp }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};