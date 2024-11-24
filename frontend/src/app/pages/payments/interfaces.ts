export interface Service {
  id?: string;
  name: string;
  price: number;
  isDeleting?: boolean;
  isDeleted?: boolean;
}

export type Action = undefined | 'payments' | 'charge';

export interface ServicePayment {
  id: string;
  value: number;
  name: string;
  serviceName: string;
  paymentMethod: 'charge' | 'payment' | 'cash' | 'transfer' | 'debet';
  playerOne?: true;
  playerTwo?: true;
  gameId?: string;
}

export type PaymentMethod = ServicePayment['paymentMethod'];
