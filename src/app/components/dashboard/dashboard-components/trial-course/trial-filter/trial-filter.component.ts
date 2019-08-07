import { CoursesService } from 'src/app/services/http/courses.service';
import { Component, OnInit } from '@angular/core';
import { TeachersService } from 'src/app/services/http/teachers.service';
import { forkJoin } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrialCalendarComponent } from '../trial-calendar/trial-calendar.component';

@Component({
  selector: 'app-trial-filter',
  templateUrl: './trial-filter.component.html',
  styleUrls: ['./trial-filter.component.css']
})
export class TrialFilterComponent implements OnInit {
  public filterLabel: Array<string> = ['Categories', 'Orgnizations', 'DayOfWeek'];
  public orgIdFilter: number;
  public cateIdFilter: number;

  /**@property {Array<string>} filterString -  A list stored the filter tags that selected.*/
  public filterString: Array<string> = [];

  /**@property {Array<Array<any>>} filterTags - A list stored all filter tags.*/
  public filterTags: Array<Array<any>> = [];

  /**@property {Array<Array<object>>} teachersList - Teachers list to display */
  public teachersList: Array<Array<object>> = [];
  public originalData;
  public dayOfWeekIndex: number = 0;
  public nodata = 'No Data Found!';

  constructor(
    private coursesService: CoursesService,
    private teachersService: TeachersService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.AddFilterString(0);
  }

  /**
   * Add a new filter string when user select a filter tag.
   * @param operationIndex - steps of opreation
   * @param itemIndex - item index (index of which item was selected)
   * @param item - item object (which item was selected)
   */
  AddFilterString(operationIndex: number, itemIndex?: number, item?: object) {
    //init get&set course categories filter tags
    if (operationIndex == 0) {
      this.getCates().subscribe(
        (res) => {
          this.filterTags.push(res['Data']);
        }
      )
    }

    //course categories filter tags processor
    if (operationIndex == 1) {
      //if a cate already selected
      if (this.filterString.length >= 1) {
        return
      }
      //if no cate seleted
      else {
        this.filterString.push(item['CourseCategoryName']);
        this.cateIdFilter = item['CourseCategoryId'];
        //get&set orgs filter tags
        this.getOrgs().subscribe(
          (res) => {
            this.filterTags.push(res['Data']);
          }
        );
      }
    }

    //orgs filter tags processor
    if (operationIndex == 2) {
      //if a org already selected
      if (this.filterString.length >= 2) {
        return
      }
      //if no org selected
      else {
        this.filterString.push(item['Abbr']);
        this.orgIdFilter = item['OrgId'];
        //get&set day of week filter tags
        let dayOfWeek = this.getDayOfWeek();
        this.filterTags.push(dayOfWeek);
      }
    }

    //day of week filter tags processor
    if (operationIndex == 3) {
      //if a day of week already selected
      if (this.filterString.length >= 3) {
        return
      }
      //if no day of week tag selected
      else {
        this.filterString.push(item.toString());
        //get&set teachers (results)
        //if data already exist, no use to get it again
        if (this.originalData) {
          this.processTeachersList(this.originalData, itemIndex);
          return;
        }
        //no data exist, get it from server
        else {
          this.getTeachersNTeachingCourses().subscribe(
            (res) => {
              this.originalData = res;
              //process data got
              this.processTeachersList(res, itemIndex);
            }
          )
        }
      }
    }
  }

  /**
   * Get course Categories from server.
   */
  getCates() {
    return this.coursesService.getCourseCategories();
  }

  /**
   * Get orgs from server.
   */
  getOrgs() {
    return this.coursesService.getLocations();
  }

  getDayOfWeek() {
    return [1, 2, 3, 4, 5, 6, 7, 'All'];
  }

  /**
   * Get teachers from server.
   */
  getTeachersNTeachingCourses() {
    let getTeachers = this.teachersService.getTeachersInfo();
    let getTeachingCourses = this.teachersService.getTeachingCourse();
    return forkJoin([getTeachers, getTeachingCourses]);
  }

  /**
   * Process the data of tachers with filters
   * @param data - data to process
   * @param selectionIndex - index of which teacher selected 
   */
  processTeachersList(data: Array<object>, selectionIndex: any) {
    /**@property {Array<object>} array1 - array after processing (teachers list that pass org filter)*/
    let array1: Array<object> = [];
    //data[0] - teachers list
    data[0]['Data'].map(
      (val) => {
        val['AvailableDays'].map(
          (item) => {
            if (item.OrgId == this.orgIdFilter) {
              if (array1.indexOf(val) == -1) {
                array1.push(val);
              }
            }
          }
        )
      }
    )
    /**@property {Array<object>} array2 - array after processing (teachers list that pass cate and org filter) */
    let array2: Array<object> = [];
    array1.map(
      (val) => {
        //data[1] - courses teaching list
        for (let i of data[1]['Data']) {
          if (i.Course.CourseCategory.CourseCategoryId == this.cateIdFilter && val['TeacherId'] == i.TeacherId) {
            if (array2.indexOf(val) == -1) {
              array2.push(val);
            }
          }
        }
      }
    )
    this.checkTeacherAvailableDays(array2, selectionIndex);
    //console.log(this.teachersListAfterFilter)
  }

  /**
   * Distribute teachers in avaliable days.
   * @param teacherList - teachers list to process
   */
  checkTeacherAvailableDays(teacherList: Array<object>, selectionIndex: any) {
    /**@property {Array<Array<object>>} array - list after process*/
    let array: Array<Array<object>> = [[], [], [], [], [], [], []];
    teacherList.map(
      (val) => {
        for (let i of val['AvailableDays']) {
          if (array[i.DayOfWeek - 1].indexOf(val) == -1) {
            array[i.DayOfWeek - 1].push(val);
          }
        }
      }
    );

    this.getTeacherListAfterDayOfWeekFilter(array, selectionIndex);
  }

  /**
   * Get teacher list with different day of week.
   * @param list - 
   * @param selectionIndex - index of different day
   */
  getTeacherListAfterDayOfWeekFilter(list, selectionIndex: any) {
    if (selectionIndex == 7) {
      this.dayOfWeekIndex = null;
      this.teachersList = list;
    }
    else {
      this.dayOfWeekIndex = selectionIndex;
      this.teachersList = [list[selectionIndex]];
    }
  }

  /**
   * Display calendar modal.
   * @param teacher - teacher selected
   */
  popupCalendarModal(teacher: object) {
    let modalRef = this.modalService.open(TrialCalendarComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.teacher = teacher;
  }

  removeFilters(index) {
    if (index == 0) {
      this.filterString = [];
      this.filterTags = [this.filterTags[0]];
    }
    else {
      this.filterString = this.filterString.slice(0, index);
      this.filterTags = this.filterTags.slice(0, index + 1);
    }

    this.teachersList = [];
    this.dayOfWeekIndex = 0;
  }

}