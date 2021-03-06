import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SessionsService} from '../../../../../../services/http/sessions.service';
import {ActivatedRoute, Router} from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-session-cancel-modal',
  templateUrl: './session-cancel-modal.component.html',
  styleUrls: ['./session-cancel-modal.component.css'],
})
export class SessionCancelModalComponent implements OnInit {
  public CancelReason;
  isloading = false;
  isConfirmClick = false;
  public isCancelSuccess = false;
  public isCancelFailed = false;
  @Input() lessionId: any;
  constructor(public activeModal: NgbActiveModal, private sessionsService: SessionsService,
              private router: Router) { }

  ngOnInit() {
  }

  CancelConfirm = () => {
    this.isloading = true;
    this.isConfirmClick = true;
    this.sessionsService.DeleteSession(this.lessionId, this.CancelReason).subscribe( data => {
      this.isloading = false;
      this.isCancelSuccess = true;
      setTimeout(() => {
        this.activeModal.dismiss('Cross click');
      }, 1000);
    }, err => {
      this.isloading = false;
      this.isCancelFailed = true;
      Swal.fire({
        type: 'error',
        title: 'Oops...',
        text: err.error.ErrorMessage,
      });
    });
  }
}
