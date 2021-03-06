import { Component, OnInit,Input } from '@angular/core';
import { LearnersService } from 'src/app/services/http/learners.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-learner-delete-modal',
  templateUrl: './learner-delete-modal.component.html',
  styleUrls: ['./learner-delete-modal.component.css']
})
export class LearnerDeleteModalComponent implements OnInit {
  //delete flag
  public isDeleteSuccess = false;
  public isDeleteFail = false;

  @Input() command;
  @Input() whichLearner;
  constructor(
    private LearnerListService: LearnersService,
    public activeModal: NgbActiveModal,
   
  ) { }

  ngOnInit() {
    console.log(this.whichLearner)
  }

   /*
    delete data
  */
 delete(){

  this.LearnerListService.deleteLearner(this.whichLearner.LearnerId).subscribe(
    (res) => {
      this.isDeleteSuccess = true;
     
    },
    (err) => {
      //失败信息
      this.isDeleteFail = true;
    }
  );
}


}
