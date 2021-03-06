import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IOtherPay } from '../../../../../models/learners';
import { PaymentService } from 'src/app/services/http/payment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-learner-payment-other',
  templateUrl: './admin-learner-payment-other.component.html',
  styleUrls: ['./admin-learner-payment-other.component.css']
})
export class AdminLearnerPaymentOtherComponent implements OnInit {
  // post other payment
  public otherPaymentObj: IOtherPay;
  public paymentTitle;
  public paymentAmount;
  public errorMsg;
  constructor(
    private fb: FormBuilder,
    private paymentOtherService: PaymentService
    ) { }

  // other fb
  otherPayment = this.fb.group({
    title: ['', Validators.required],
    amount: ['', Validators.required]
  });
  get title() {
    return this.otherPayment.get('title');
  }
  get amount() {
    return this.otherPayment.get('amount');
  }

  ngOnInit() {
  }
  otherPaymentSubmit() {
    const title = this.otherPayment.value.title;
    const amount = this.otherPayment.value.amount;
    const conf = confirm(`the title of the payment is ${title}, the amount is ${amount}$, Please Confirm`);
    if (conf) {
    this.otherPaymentObj = {
      StaffId: Number(localStorage.getItem('staffId')),
      title: this.otherPayment.value.title,
      amount: this.otherPayment.value.amount
    };

    this.paymentOtherService.postPaymentService(this.otherPaymentObj).subscribe(
      response => {
        console.log('Success!', response);

      },
      error => {
        this.errorMsg = JSON.parse(error.error);
        console.error('Error!', this.errorMsg.ErrorCode);
        //alert(`Can not access server ${this.errorMsg.ErrorCode}`);
        Swal.fire({  type: 'error',  title: 'Oops...', text: this.errorMsg.ErrorCode });
      }
    );
  }
  }
}
