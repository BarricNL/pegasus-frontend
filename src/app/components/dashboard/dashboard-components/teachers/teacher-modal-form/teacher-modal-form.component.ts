import { TeachersService } from '../../../../../services/http/teachers.service';
import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-teacher-modal-form',
  templateUrl: './teacher-modal-form.component.html',
  styleUrls: ['./teacher-modal-form.component.css',
    '../../../../../shared/css/teacher-global.css']
})
export class TeacherModalFormComponent implements OnInit {
  public updateForm;
  //qualification dropdown options
  public qualificationOptions: Object;
  //language dropdown options
  public languageOptions: Object;
  //orgs dropdown options
  public orgOptions: Object;
  //readonly or not
  public readOnlyFlag: boolean = false;
  public showLeftImgFlag: boolean = true;
  public showRightImgFlag: boolean = false;
  public photoToSubmit: any;
  public idPhotoToSubmit: any;
  public week: Array<string> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  public idTypeList = [{ 'idTypeId': 1, 'idTypeName': 'Driver Lisence' },
  { 'idTypeId': 2, 'idTypeName': '18+' },
  { 'idTypeId': 3, 'idTypeName': 'Passport' }];

  @Input() command;
  @Input() whichTeacher;
  @ViewChildren('lan') languagesCheckBox;
  @ViewChildren('branches') branchesCheckBox;

  constructor(private fb: FormBuilder, private teachersService: TeachersService) { }

  ngOnInit() {
    //console.log(this.whichTeacher)
    this.setReadOnly();
    this.updateForm = this.fb.group(this.formGroupAssemble());
    this.getDropdownOptions();
  }

  /////////////////////////////////////////////methods call by other methods/////////////////////////////////////////////////

  /*
    in detail mode, data can only be read
  */
  setReadOnly() {
    if (this.command == 1) {
      this.readOnlyFlag = true;
    }
  }

  /*
    some dropdown options are come from server
    get them and save in specific paras
  */
  getDropdownOptions() {
    this.teachersService.getDropdownOptions().subscribe(
      (res) => {
        this.qualificationOptions = res.Data.qualifications;
        this.languageOptions = res.Data.Languages;
        this.orgOptions = res.Data.Orgs;
        // console.log(res)
        // console.log(this.qualificationOptions)
        // console.log(this.languageOptions)
        // console.log(this.orgOptions)
      },
      (err) => {

      }
    )
  }

  /*
    when only date format is like YYYY-MM-DD, formControlName will show the correct things 
  */
  getDateFormat(date) {
    if (date !== null) {
      return (date.substring(0, 10))
    }
    return null;
  }
  /*
    需要修改 暂时别动了 目前还不知道显示最高学历还是显示所有学历
  */
  getQualiId() {
    if (this.whichTeacher.TeacherQualificatiion.length !== 0) {
      console.log(this.whichTeacher)
      console.log( this.whichTeacher.TeacherQualificatiion[0].QualiId)
      return this.whichTeacher.TeacherQualificatiion[0].QualiId;
    }
    else {
      return null;
    }
  }

  /////////////////////////////////////////////methods call by HTML Element or Event/////////////////////////////////////////////////

  /*
    display default language selection
  */
  setDefaultLanguageSelection(LanguageId) {
    if (this.command !== 0) {
      for (let i of this.whichTeacher.TeacherLanguage) {
        if (LanguageId == i.LangId) {
          return true;
        }
      }
      return false;
    }
    else {
      return false;
    }
  }

  /*
    switch photo and IdPhoto
    and change them styles
  */
  showPhotos(position) {
    let leftImgObj = document.getElementById('img_left');
    let rightImgObj = document.getElementById('img_right');

    if (position == 0) {
      this.showLeftImgFlag = true;
      this.showRightImgFlag = false;

      rightImgObj.style.display = 'none';
      leftImgObj.style.display = 'block';
    }
    else {
      this.showRightImgFlag = true;
      this.showLeftImgFlag = false;

      leftImgObj.style.display = 'none';
      rightImgObj.style.display = 'block';
    }
  }

  /*
    in update and add mode
    get days that teacher available of one week
  */
  getAvailableDays() {
    let availableDays: Array<number> = []
    if (this.command == 1 && this.whichTeacher.AvailableDays.length !== 0) {
      for (let i of this.whichTeacher.AvailableDays) {
        if (availableDays.indexOf(i.DayOfWeek) == -1) {
          availableDays.push(i.DayOfWeek)
        }
      }
    }
    return availableDays;
  }

  /*
    get branches that teacher available in specfy date
  */
  getAvailableOrgs(whichDay) {
    if (this.command == 1 && this.whichTeacher.AvailableDays.length !== 0) {
      let temOrgs = [];
      for (let i of this.whichTeacher.AvailableDays) {
        if (i.DayOfWeek == whichDay && temOrgs.indexOf(i.OrgId) == -1) {
          temOrgs.push(i.OrgId);
        }
      }
      return temOrgs;
    }
  }

  /*
    pre view the img that user upload
    whichPhoto value:
      0 --> userPhoto
      1 --> userIdPhoto
  */
  preViewImg(event, whichPhoto) {
    let photoObj;
    let photoRender;
    if (whichPhoto == 0) {
      photoObj = document.getElementById('userPhoto');
      //assign photo to photoToSubmit
      this.photoToSubmit = <File>event.target.files[0];
      photoRender = this.photoToSubmit;
    }
    else {
      photoObj = document.getElementById('userIdPhoto');
      //assign id photo to idPhotoToSubmit
      this.idPhotoToSubmit = <File>event.target.files[0];
      photoRender = this.idPhotoToSubmit;
    }
    //important! 
    //set src and read it 
    let reader = new FileReader();
    reader.onloadend = function () {
      photoObj.setAttribute("src", this.result.toString());
    }
    reader.readAsDataURL(photoRender);
  }


  /*
    in add and update mode
    Branch options hide in default, when user click week name, toggle branch options,
  */
  toggleBranchOptions(event, i) {
    let dropDownObj = document.getElementById(i);
    //set [flag] attr to element, to switch between show and hide
    event.target.attributes.flag = !event.target.attributes.flag;

    if (event.target.attributes.flag == true) {
      dropDownObj.style.display = 'block';
    }
    else {
      dropDownObj.style.display = 'none';
    }
  }

  /////////////////////////////////////////////form group/////////////////////////////////////////////////

  formGroupAssemble() {
    let groupObj: any;
    if (this.command == 0) {
      groupObj = {
        FirstName: [null, Validators.required],
        LastName: [null, Validators.required],
        Gender: [null, Validators.required],
        Dob: [null, Validators.required],
        Qualificatiion: [null, Validators.required],
        MobilePhone: [null, Validators.required],
        HomePhone: [null, Validators.required],
        Email: [null, [Validators.required, Validators.email]],
        IRDNumber: [null, Validators.required],
        Language: [null, Validators.required],
        IDType: [null, Validators.required],
        IDNumber: [null, Validators.required],
        ExpiryDate: [null, Validators.required],
        DayOfWeek: [null]
      }
    }
    else {
      groupObj = {
        //formControlName 决定了提交表单时的参数名
        FirstName: [{ value: this.whichTeacher.FirstName, disabled: this.readOnlyFlag }, Validators.required],
        LastName: [{ value: this.whichTeacher.LastName, disabled: this.readOnlyFlag }, Validators.required],
        Gender: [{ value: this.whichTeacher.Gender, disabled: this.readOnlyFlag }, Validators.required],
        //★★★★★只有当日期格式为YYYY-MM-DD的时候 才会显示出formControlName的默认值
        Dob: [{ value: this.getDateFormat(this.whichTeacher.Dob), disabled: this.readOnlyFlag }, Validators.required],
        Qualificatiion: [{ value: this.getQualiId(), disabled: this.readOnlyFlag }, Validators.required],
        MobilePhone: [{ value: this.whichTeacher.MobilePhone, disabled: this.readOnlyFlag }, Validators.required],
        HomePhone: [{ value: this.whichTeacher.HomePhone, disabled: this.readOnlyFlag }, Validators.required],
        Email: [{ value: this.whichTeacher.Email, disabled: this.readOnlyFlag }, [Validators.required, Validators.email]],
        IRDNumber: [{ value: this.whichTeacher.IrdNumber, disabled: this.readOnlyFlag }, Validators.required],
        Language: [{ value: this.whichTeacher.TeacherLanguage, disabled: this.readOnlyFlag }, Validators.required],
        IDType: [{ value: this.whichTeacher.IdType, disabled: this.readOnlyFlag }, Validators.required],
        IDNumber: [{ value: this.whichTeacher.IdNumber, disabled: this.readOnlyFlag }, Validators.required],
        ExpiryDate: [{ value: this.getDateFormat(this.whichTeacher.ExpiryDate), disabled: this.readOnlyFlag }, Validators.required], //用dateFormat
        DayOfWeek: [{ value: null, disabled: this.readOnlyFlag }],
      }
    }

    return groupObj;
  }
} 
