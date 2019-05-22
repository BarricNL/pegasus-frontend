import { TeachersService } from './../../../../../services/http/teachers.service';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-teacher-update-modal',
  templateUrl: './teacher-update-modal.component.html',
  styleUrls: ['./teacher-update-modal.component.css']
})
export class TeacherUpdateModalComponent implements OnInit {
  public infoMessage: string = '';
  public messageColor: string;
  public isSubmitionSuccess: boolean = false;
  public loadingGifFlag: boolean = false;


  @Input() command;
  @Input() whichTeacher;
  //in order to get the form from child component(TeacherModalFormDComponent)
  @ViewChild('modalUpdateFormComponent') modalUpdateFormComponentObj;

  constructor(public activeModal: NgbActiveModal, private teachersService: TeachersService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.isSubmitionSuccess = true;
    this.infoMessage = 'loading.....'
    this.loadingGifFlag = true;
    let valueToSubmit = this.modalUpdateFormComponentObj.updateForm.value;
    let vailadValue = this.checkInputVailad(valueToSubmit);
    if (vailadValue !== null) {
      this.stringifySubmitStr(vailadValue)
    }
  }
  ////////////////////////////////////////handler of submition/////////////////////////////////////////////////////
  /*
    check whether data vailad or not(ruled by Validators).
  */
  checkInputVailad(valueToSubmit) {
    //once click save btn, touch all inputs form with for-loop. In order to trigger Validator
    for (let i in this.modalUpdateFormComponentObj.updateForm.controls) {
      this.modalUpdateFormComponentObj.updateForm.controls[i].touched = true;
    }
    //when input value pass the check of Validators, there is a [status] attr equal to 'VALID'
    if (this.modalUpdateFormComponentObj.updateForm.status == 'VALID') {
      return this.prepareSubmitData(valueToSubmit);
    }
    else {
      this.infoMessage = 'Please check your input.'
      this.loadingGifFlag = false;
      this.messageColor = '#dc3545';
      this.isSubmitionSuccess = false;
      return null;
    }
  }

  /*
    back-end limited submition data's type.
    this method is used to convert data to correct type.
  */
  prepareSubmitData(valueToSubmit) {
    valueToSubmit.Gender = this.checkGender();
    valueToSubmit.Language = this.checkLanguages();
    valueToSubmit.DayOfWeek = this.checkOrgs();
    valueToSubmit.Qualificatiion = this.checkQualifications(valueToSubmit);
    valueToSubmit.IDType = Number(valueToSubmit.IDType);
    console.log(valueToSubmit)
    return valueToSubmit;
  }

  /*
    after stringify submition string, data is ready to submit
  */
  stringifySubmitStr(vailadValue) {
    //console.log(vailadValue)
    let submit = new FormData();
    submit.append('details', JSON.stringify(vailadValue));
    submit.append('Photo', this.modalUpdateFormComponentObj.photoToSubmit);
    submit.append('IdPhoto', this.modalUpdateFormComponentObj.idPhotoToSubmit);
    this.submitByMode(submit)
  }

  /*
   post the data by diffrent api
 */
  submitByMode(submitData) {
    //while push a stream of new data
    if (this.command == 0) {
      let obj = this.teachersService.addNew(submitData);
      this.subscribeHandler(obj);
    }
    //while update data
    else if (this.command == 2) {
      let obj = this.teachersService.update(submitData, this.whichTeacher.TeacherId);
      this.subscribeHandler(obj);
    }
  }

  subscribeHandler(obj) {
    this.isSubmitionSuccess = false;
    obj.subscribe(
      (res) => {
        this.showInfoMessage('Submit success!','#28a745',false)
      },
      (err) => {
        if (err.error.ErrorMessage == 'Teacher has exist.') {
          this.showInfoMessage(err.error.ErrorMessage + ' Please check ID Number.','#dc3545',false);
        }
        else {
          this.showInfoMessage('Sorry, there are something wrong in server.','#dc3545',false);
        }
        console.log('Error', err);
      }
    );
  }

  showInfoMessage(msg, fontColor, gifFlag){
    this.infoMessage = msg;
    this.loadingGifFlag = gifFlag;
    this.messageColor = fontColor;
  }
  
  checkGender() {
    let gender = this.modalUpdateFormComponentObj.genderToSubmit.nativeElement.value;
    switch (gender) {
      case "Female":
        return 0;
      case "Male":
        return 1;
    }
  }

  /*
   to check which language checked
 */
  checkLanguages() {
    let languageBoxObj = this.modalUpdateFormComponentObj.languagesCheckBox._results;
    let checkedLanguagesList = [];
    for (let i in languageBoxObj) {
      //whitchever languages is checked, add it to checkedLanguagesList
      if (languageBoxObj[i].nativeElement.checked == true) {
        checkedLanguagesList.push(Number(languageBoxObj[i].nativeElement.value));
      }
    }
    return checkedLanguagesList;
  }


  checkOrgs() {
    //console.log(this.modalUpdateFormComponentObj)
    let temBranches = this.modalUpdateFormComponentObj.branchesCheckBox._results;
    let temBranchesList = [[], [], [], [], [], [], []];

    for (let i of temBranches) {
      if (i.nativeElement.checked == true) {
        if (i.nativeElement.name == 'Monday') {
          temBranchesList[0].push(Number(i.nativeElement.defaultValue))
        }
        if (i.nativeElement.name == 'Tuesday') {
          temBranchesList[1].push(Number(i.nativeElement.defaultValue))
        }
        if (i.nativeElement.name == 'Wednesday') {
          temBranchesList[2].push(Number(i.nativeElement.defaultValue))
        }
        if (i.nativeElement.name == 'Thursday') {
          temBranchesList[3].push(Number(i.nativeElement.defaultValue))
        }
        if (i.nativeElement.name == 'Friday') {
          temBranchesList[4].push(Number(i.nativeElement.defaultValue))
        }
        if (i.nativeElement.name == 'Saturday') {
          temBranchesList[5].push(Number(i.nativeElement.defaultValue))
        }
        if (i.nativeElement.name == 'Sunday') {
          temBranchesList[6].push(Number(i.nativeElement.defaultValue))
        }
      }
    }
    return temBranchesList;
  }

  checkQualifications(valueToSubmit) {
    let checkQualificationsList = [];
    if (valueToSubmit.Qualificatiion !== undefined) {
      checkQualificationsList.push(Number(valueToSubmit.Qualificatiion));
    }


    return checkQualificationsList;

  }
}
