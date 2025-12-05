export type Role = 'owner' | 'employee' | null;
export type LocalType = 'esquina' | 'principal';

export interface Sale {
  id: string;
  sellerName: string;
  paymentMethod: string;
  amount: number;
  timestamp: number;
  local: LocalType;
}

export interface DayRecord {
  id: string;
  date: string; // ISO Date string
  dateDisplay: string;
  sales: Sale[];
  total: number;
  local: LocalType;
  closedAt: number;
}

export interface SalesFilter {
  seller?: string;
  dateStart?: string;
  dateEnd?: string;
  minAmount?: number;
}

export interface AppState {
  currentSales: {
    esquina: Sale[];
    principal: Sale[];
  };
  history: {
    esquina: DayRecord[];
    principal: DayRecord[];
  };
}