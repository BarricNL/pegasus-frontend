import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-learner-add-modal',
  templateUrl: './learner-add-modal.component.html',
  styleUrls: ['./learner-add-modal.component.css']
})
export class LearnerAddModalComponent implements OnInit, DoCheck {
  addCourse = true;
  toAddLearnerModal = false;
  @Input() whichLearner;
  constructor(public activeModal: NgbActiveModal ) {

  }
  toLearnerListEvent(event){
    if(event == true){
      this.activeModal.dismiss();
    }
  }
  ngDoCheck(){
    console.log(this.toAddLearnerModal);
  }
  ngOnInit() {
  }

}
