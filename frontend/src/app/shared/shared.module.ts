import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiInterceptor } from './api.interceptor';
import { LoaderComponent } from './loader/loader.component';
import { PaymentsNamePipe } from '../pipes/payments-name.pipe';

const INTERCEPT = {
  provide: HTTP_INTERCEPTORS,
  useClass: ApiInterceptor,
  multi: true,
};

@NgModule({
  declarations: [LoaderComponent, PaymentsNamePipe],
  imports: [ReactiveFormsModule, FormsModule, HttpClientModule],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    LoaderComponent,
    PaymentsNamePipe,
  ],
  providers: [INTERCEPT],
})
export class SharedModule {}
