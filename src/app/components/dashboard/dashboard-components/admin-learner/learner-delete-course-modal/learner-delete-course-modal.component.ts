import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LearnerRegistrationService } from '../../../../../services/http/learner-registration.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-learner-delete-course-modal',
  templateUrl: './learner-delete-course-modal.component.html',
  styleUrls: ['./learner-delete-course-modal.component.css']
})
export class LearnerDeleteCourseModalComponent implements OnInit {
  isGroupCourse = false;
  @Input() whichLearner;
  groupEndDate;
  one2OneEndDate;
  constructor(public activeModal: NgbActiveModal, private endCourse : LearnerRegistrationService) {}
  chooseCourse(){
    this.isGroupCourse = !this.isGroupCourse;
  }
  onSubmit(ele){
    console.log(ele)
    let fun;
    if(this.isGroupCourse){
      let idIns = ele.GroupCourseInstanceId
      fun = this.endCourse.endGroupCourse(idIns, this.groupEndDate);
    } else{
      let idIns = ele.CourseInstanceId
      fun = this.endCourse.end121Course(idIns, this.one2OneEndDate);
    }
    fun.subscribe(
      res => {
        Swal.fire({
          title: 'Success!',
          text: 'Your Work Has Been Save',
          type: 'success',
        });
      },
      error => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: 'Sorry! '+ error.error.ErrorMessage,
          type: 'error',
        });
      });
  }
  ngOnInit() {
  }

}