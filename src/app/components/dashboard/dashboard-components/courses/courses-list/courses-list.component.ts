import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbootstraptableService } from '../../../../../services/others/ngbootstraptable.service';

import { CoursesService } from '../../../../../services/http/courses.service';
import { CourseDetailModalComponent } from '../course-detail-modal/course-detail-modal.component';
import { CourseDeleteModalComponent } from '../course-delete-modal/course-delete-modal.component';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css'],
  providers: [DecimalPipe]
})
export class CoursesListComponent implements OnInit {
  public coursesList: any;
  public coursesListLength: number;
  public closeResult: string;
  public page: number = 1;  //pagination current page
  public pageSize: number = 10;    //[can modify] pagination page size
  public currentPage: number = 1;
  public coursesListCopy: Array<any>;
  public errorMessage: string;
  //search by which columns, determine by users
  public queryParams: object = {};
  public filter = new FormControl('');  
  //loading
  public loadingFlag: boolean = false;

  constructor(
    private coursesService: CoursesService,
    private modalService: NgbModal,
    private ngTable: NgbootstraptableService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadingFlag = true;
    this.getData();
  }

  /*
    get data form serve
  */
  getData() {
    this.coursesService.getCourses().subscribe(
      (res) => {
        this.coursesList = res.Data;
        this.coursesListCopy = this.coursesList;
        this.coursesListLength = res.Data.length; //length prop is under Data prop
        this.refreshPageControl();
        this.loadingFlag = false;
        // console.log(this.coursesList);
      },
      (err) => {
        this.backendErrorHandler(err);
      })
  }

  backendErrorHandler(err) {
    console.warn(err)
    if (err.error.ErrorMessage != null) {
      this.errorMessage = err.error.ErrorMessage;
    }
    else {
      this.errorMessage = "Error! Can't catch Data."
    }
  }

  /*
    the page no change after page refreshing
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
    this.router.navigate(['courses/list'], {
      queryParams: this.queryParams
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /*
    update modal
  */
  detailModal(command, whichCourse) {
    const modalRef = this.modalService.open(CourseDetailModalComponent, { size: 'lg' });
    let that = this;
    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      that.ngOnInit();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichCourse = whichCourse;
  }

  /*
    delete modal
  */
  deleteModal(command, whichCourse) {
    const modalRef = this.modalService.open(CourseDeleteModalComponent);
    let that = this;
    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      that.ngOnInit()
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    modalRef.componentInstance.command = command;
    modalRef.componentInstance.whichCourse = whichCourse;
  }

  /*
    sort method
  */
  onSort(orderBy, orderControls?) {
    let orderControl = this.ngTable.sorting(this.coursesList, orderBy, orderControls);
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

      (initValue == undefined) ? { searchString, searchBy } =
        { searchString: searchingInputObj['value'], searchBy: 'CourseName' } :
        { searchString, searchBy } = initValue;

      this.coursesList = this.ngTable.searching(this.coursesListCopy, searchBy, searchString);
      this.coursesListLength = this.coursesList.length;

      this.setQueryParams('searchBy', searchBy);
      this.setQueryParams('searchString', searchString);
    }

  }
}