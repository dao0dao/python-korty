export type ModalAction = 'new' | 'edit' | 'show';

export interface HourPrice {
  from: string;
  to: string;
  days: number[];
  price: number;
}

export interface HourPriceNumber {
  from: number;
  to: number;
  price: number;
}

export interface PriceListDTO {
  id?: string;
  name: string;
  defaultPrice: number;
  hours: { [key: string]: HourPrice };
}

export type PriceListNumber = Omit<PriceListDTO, 'hours'> & {
  hours: { [key: string]: HourPriceNumber };
};

export interface ApiError {
  status: number;
  error: {
    alreadyExist?: boolean;
  };
}
