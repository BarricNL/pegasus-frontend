import { TeacherDetailModalComponent } from './../teacher-detail-modal/teacher-detail-modal.component';
import { TeacherUpdateModalComponent } from './../teacher-update-modal/teacher-update-modal.component';
import { NgbootstraptableService } from '../../../../../services/others/ngbootstraptable.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TeachersService } from '../../../../../services/http/teachers.service';
import { NgbModal, NgbModalRef, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { TeacherDeleteModalComponent } from '../teacher-delete-modal/teacher-delete-modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import { TeacherCourseModalComponent } from '../teacher-course-modal/teacher-course-modal.component';
import { CoursesService } from 'src/app/services/http/courses.service';
import { LookUpsService } from 'src/app/services/http/look-ups.service';

@Component({
  selector: 'app-teacher-info',
  templateUrl: './teacher-info.component.html',
  styleUrls: ['./teacher-info.component.css']
})
export class TeacherInfoComponent implements OnInit {
  //what columns showed in the info page, can get from back-end in the future. must as same as database
  public columnsToShow: Array<string> = ['FirstName', 'LastName', 'Email'];
  //teachers data from database
  public teachersList: Array<any>;
  //teachers list copy. Using in searching method, in order to initialize data to original
  public teachersListCopy: Array<any>;
  //how many datas in teachersList
  public teachersListLength: number;
  public queryParams: object = {};
  public currentPage: number = 1;
  public pageSize: number = 10;
  //loading
  public loadingFlag: boolean = false;
  public courses;
  public teachingCourses;
  public level;
  public duration;

  @ViewChild('pagination') pagination;

  constructor(
    private teachersService: TeachersService,
    private coursesService: CoursesService,
    private ngTable: NgbootstraptableService,
    private lookUps: LookUpsService,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): any {
    this.loadingFlag = true;
    this.getDataFromSever();
    this.getCourses();
    this.getTeachingCourse();
    this.lookUp4();
    this.lookUp8();
  }

  /////////////////////////////////////////////////data handlers////////////////////////////////////////////////////
  /*
    get data from service
  */
  getDataFromSever() {
    this.teachersService.getTeachersInfo().subscribe(
      (res) => {
        this.teachersList = res.Data;
        this.teachersListCopy = this.teachersList;
        this.teachersListLength = res.Data.length;
        //console.log(this.teachersList)

        this.refreshPageControl();
        this.loadingFlag = false;

      },
      (err) => {
        alert("Thers's something wrong in server, please try later.")
      }
    )
  }

  /*
    get all courses that provided by this school
  */
  getCourses() {
    this.coursesService.getCourses().subscribe(
      (res) => {
        this.courses = res.Data;
      },
      (err) => {
        alert('Sorry, there\'s something wrong with server.');
        console.log(err)
      }
    )
  }

  /*
    get all of the courses that all of teachers current teaching.
  */
  getTeachingCourse() {
    this.teachersService.getTeachingCourse().subscribe(
      (res) => {
        this.teachingCourses = res.Data;
      },
      (err) => {
        alert('Sorry, there\'s something wrong with server.');
        console.log(err)
      }
    )
  }

  /*
    不要问我这堆lookUp是干什么的 问就说不知道
  */
  lookUp4() {
    this.lookUps.getLookUps(4).subscribe(
      (res) => {
        this.level = res.Data;
      },
      (err) => {
        alert('Sorry, there\'s something wrong with server.');
      }
    )
  }

  lookUp8() {
    this.lookUps.getLookUps(8).subscribe(
      (res) => {
        this.duration = res.Data;
      },
      (err) => {
        alert('Sorry, there\'s something wrong with server.');
      }
    )
  }



  /*
    set the default params when after page refresh
  */
  refreshPageControl() {
    this.activatedRoute.queryParams.subscribe(res => {
      let { searchString, searchBy, orderBy, orderControl, currentPage } = res;
      if (searchString !== undefined && searchBy !== undefined) {
        this.onSearch(null, { 'searchString': searchString, 'searchBy': searchBy })
      }
      if (orderBy !== undefined && orderControl !== undefined) {
        this.onSort(orderBy, orderControl)
      }
      if (currentPage !== undefined) {
        this.currentPage = currentPage;
      }
    })
    return;
  }
  ///////////////////////////////////////////called by other methods//////////////////////////////////////////////

  /*
    items of queryParams:
      1, searchString
      2, searchBy
      3, orderBy
      4, orderControl
  */
  setQueryParams(paraName, paraValue) {

    if (paraValue == '') {
      delete this.queryParams[paraName];
      delete this.queryParams['searchBy'];
    }
    else {
      this.queryParams[paraName] = paraValue;
    }

    this.router.navigate(['tutors/list'], {
      queryParams: this.queryParams
    });
  }

  ///////////////////////////////////////////called by template event/////////////////////////////////////////////
  /*
    sort method
  */
  onSort(orderBy, orderControls?) {
    let orderControl = this.ngTable.sorting(this.teachersList, orderBy, orderControls);
    this.setQueryParams('orderBy', orderBy);
    this.setQueryParams('orderControl', orderControl);
  }

  /*
    search method
  */
  onSearch(event, initValue?) {
    if (event !== null && !(event.type == 'keydown' && event.key == 'Enter')) {
      return;
    }
    else {
      let searchString: string;
      let searchBy: string;
      let searchingInputObj = document.getElementById('searchingInput');
      let optionsObj = document.getElementById('searchOption');

      (initValue == undefined) ? { searchString, searchBy } = { searchString: searchingInputObj['value'], searchBy: optionsObj['value'] } :
        { searchString, searchBy } = initValue;

      this.teachersList = this.ngTable.searching(this.teachersListCopy, searchBy, searchString);
      this.teachersListLength = this.teachersList.length;
      optionsObj['value'] = searchBy;

      this.setQueryParams('searchBy', searchBy);
      this.setQueryParams('searchString', searchString);
    }

  }

  getCurrentPage() {
    let currentPage = this.pagination.page;
    this.setQueryParams('currentPage', currentPage)
  }

  ///////////////////////////////////////handler of angular-bootstrap modals/////////////////////////////////////

  /*
    update modal
  */
  updateModal(command, whichTeacher) {
    const modalRef = this.modalService.open(TeacherUpdateModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    let that = this;
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
    modalRef.componentInstance.refreshFlag.subscribe(
      (res) => {
        modalRef.result.then(
          function () {
            if(res == true){
              that.ngOnInit();
            }
          },
          function () {
            return;
          })
      }
    )
  }

  courseModal(command, whichTeacher) {
    //                                                                               禁止点击外部或使用esc关闭modal
    const modalRef = this.modalService.open(TeacherCourseModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    let that = this;
    modalRef.result.then(
      function (event) {
        that.ngOnInit();
      },
      function (event) {
        return;
      })
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
    modalRef.componentInstance.courses = this.courses;
    modalRef.componentInstance.teachingCourses = this.teachingCourses;
    modalRef.componentInstance.level = this.level;
    modalRef.componentInstance.duration = this.duration;
  }

  /*
    delete modal
  */
  deleteModal(command, whichTeacher) {
    const modalRef = this.modalService.open(TeacherDeleteModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    let that = this;
    modalRef.componentInstance.refreshFlag.subscribe(
      (res) => {
        modalRef.result.then(
          function () {
            if(res == true){
              that.ngOnInit();
            }
          },
          function () {
            return;
          })
      }
    )
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }

  /*
    detail modal
  */
  detailModal(command, whichTeacher) {
    const modalRef = this.modalService.open(TeacherDetailModalComponent, { size: 'lg' });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichTeacher = whichTeacher;
  }
}
