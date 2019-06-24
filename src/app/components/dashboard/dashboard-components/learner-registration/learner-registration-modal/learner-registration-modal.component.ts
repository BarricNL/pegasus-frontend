import { Component, OnInit, Input, ViewChild, AfterViewChecked } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TimePickerComponent } from '../../time-picker/time-picker.component';
@Component({
  selector: 'app-learner-registration-modal',
  templateUrl: './learner-registration-modal.component.html',
  styleUrls: ['./learner-registration-modal.component.css']
})
export class LearnerRegistrationModalComponent implements OnInit, AfterViewChecked {
  timepickerChosen;
  // get data from timepickerComponent
  @ViewChild(TimePickerComponent) timePickerComponent;

  // edwin add
  @Input() whichLearner;

   constructor(public activeModal: NgbActiveModal) {}

   ngAfterViewChecked(){
     this.timepickerChosen = this.timePickerComponent.name;
   }
   ngOnInit() {
   }
}
