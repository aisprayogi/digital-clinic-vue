export interface CashierSession {
  id: string;
  sessionNumber: string;
  cashierId: string;
  cashierName: string;
  openedAt: Date;
  closedAt?: Date;
  openingBalance: number;
  closingBalance?: number;
  totalTransactions?: number;
  totalRevenue?: number;
  status: 'open' | 'closed';
}

export interface DraftTransaction {
  id: string;
  draftNumber: string;
  sessionId: string;
  customerType: 'patient' | 'walk-in';
  customerId?: string;
  customerName: string;
  items: DraftTransactionItem[];
  subtotal: number;
  tax: number;
  discount: number;
  discountType?: 'none' | 'percentage' | 'fixed' | 'promotion';
  discountNote?: string;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DraftTransactionItem {
  id: string;
  name: string;
  type: 'service' | 'medicine';
  price: number;
  quantity: number;
  total: number;
}

export interface SessionReport {
  session: CashierSession;
  transactions: {
    id: string;
    transactionNumber: string;
    customerName: string;
    total: number;
    paymentMethod: string;
    timestamp: Date;
  }[];
  summary: {
    totalTransactions: number;
    totalRevenue: number;
    paymentMethods: {
      cash: number;
      card: number;
      transfer: number;
    };
  };
}
