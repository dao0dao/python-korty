import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentsName',
})
export class PaymentsNamePipe implements PipeTransform {
  transform(value: string) {
    switch (value) {
      case 'payment':
        return 'pobranie z konta';
      case 'transfer':
        return 'przelew';
      case 'cash':
        return 'gotówka';
      default:
        value;
        break;
    }
  }
}
