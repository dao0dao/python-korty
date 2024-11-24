export interface TimeTable {
  label: string;
}

export interface OutputReservationDTO {
  id?: number;
  layer?: number;

  form: {
    date: string;
    timeFrom: string;
    timeTo: string;
    court: number;
    playerOne?: string;
    playerTwo?: string;
    guestOne?: string;
    guestTwo?: string;
  };
}
export interface Reservation {
  id: number;
  timetable: {
    transformY: number;
    transformX: number;
    ceilHeight: number;
    layer: number;
  };
  form: {
    date: string;
    timeFrom: string;
    timeTo: string;
    court: number;
    playerOne: Player | undefined;
    playerTwo: Player | undefined;
    guestOne: string;
    guestTwo: string;
  };
  payment: {
    hourCount: number;
  };
  isEditable?: boolean; //zależy czy admin czy nie
  isPlayerOnePayed?: boolean;
  isPlayerTwoPayed?: boolean;
  isFirstPayment?: boolean;
}

interface Player {
  id: string;
  name: string;
  surname: string;
  telephone: string;
}

export interface ActiveFilters {
  playerOne: { isActive: boolean; isDisabled: boolean };
  playerTwo: { isActive: boolean; isDisabled: boolean };
  allOpponentsOne: { isActive: boolean; isDisabled: boolean };
  allOpponentsTwo: { isActive: boolean; isDisabled: boolean };
}

export interface DeleteConfirm {
  isConfirm: boolean;
  id?: number;
}

export interface PlayerPayment {
  id?: any;
  name?: string;
  method: 'charge' | 'payment' | 'cash' | 'transfer' | 'none';
  value: number;
  serviceName?: string;
}

export type Method = PlayerPayment['method'];

export interface ReservationPayment {
  reservationId: number;
  playerOne?: PlayerPayment;
  playerTwo?: PlayerPayment;
}

//// nowe

export interface CreateReservationDTO {
  status: 'created';
}

export interface ReservationInputDTO {
  id: number;
  timetable: {
    layer: number;
  };
  form: {
    date: string;
    timeFrom: string;
    timeTo: string;
    court: number;
    playerOne: Player | undefined;
    playerTwo: Player | undefined;
    guestOne: string;
    guestTwo: string;
  };
  payment: {
    hourCount: number;
  };
  isEditable: boolean; //zależy czy admin czy nie
  isPlayerOnePayed: boolean;
  isPlayerTwoPayed: boolean;
  isFirstPayment: boolean;
}

export interface PlayerHistoryPrice {
  is_paid: boolean;
  player_position: number;
  price: number;
  player: {
    id: string;
    name: string;
    surname: string;
  };
}

export interface ReservationPriceDTO {
  prices: PlayerHistoryPrice[];
}
