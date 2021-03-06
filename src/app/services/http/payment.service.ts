import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  baseUrl = environment.baseUrl;
  token:string
  httpHeaders: HttpHeaders;

  constructor(private http: HttpClient) {
    this.prepareHeaders()
  }

  // API Request headers
  prepareHeaders(){
    this.token = localStorage.getItem('Token')
    return this.httpHeaders = new HttpHeaders({'Authorization': "Bearer "+ localStorage.getItem('Token')})
  }

  getInvoice(id){
    return this.http.get<any[]>(this.baseUrl + 'invoice/' + id);
  }
  addFund(fund) {
    return this.http.post(this.baseUrl + 'payment/payInvoice', fund, { responseType: 'text' })
  //   .pipe(
  //     catchError(this.errorHandler)
  //   );
  // }
  //  errorHandler(error: HttpErrorResponse){
  //   return Observable.throw(error.message || "Server Error");
   }

  postRegiPaymentService(payment){
    return this.http.post(this.baseUrl + 'regi', payment)
  }

  // other Pay
  postPaymentService(payment) {
    return this.http.post(this.baseUrl + 'other', payment);
  }

  //email invoice
  emailInvoice(invoice) {
    return this.http.post(this.baseUrl + 'invoice', invoice);
  }
}
