export interface Balance {
  id: string;
  playerId: string;
  playerName: string;
  date: string;
  service: string;
  price: number;
  isPaid: boolean;
  method: method;
  beforePayment: number;
  afterPayment: number;
  cashier: string;
  gameId?: string;
}

export type method = 'payment' | 'cash' | 'transfer' | 'debet';

export interface BalancePayment {
  id: string;
  playerId: string;
  method: method;
}

export interface Timestamp {
  dateFrom: string;
  dateTo: string;
}

export interface Payment {
  playerId: string;
  historyId: string;
  price: number;
  service: string;
  method: method;
}

// nowe

export interface PlayerHistoryInputDTO {
  history: HistoryInputDTO[];
  totalPrice: number;
  balance: string;
}

export interface HistoryInputDTO {
  id: number;
  serviceDate: string;
  serviceName: string;
  price: number;
  isPaid: boolean;
  paymentMethod: string;
  paymentDate: string;
  cashier: string;
}

export interface PlayerHistoryPaymentDTO {
  id: number;
  paymentMethod: string;
}

export interface OutputPayment {
  id: number;
  payment_method: method;
  price: string;
}
