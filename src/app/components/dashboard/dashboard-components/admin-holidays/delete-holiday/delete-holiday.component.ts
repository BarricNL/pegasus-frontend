import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {HolidaysService} from 'src/app/services/http/holidays.service';
@Component({
  selector: 'app-delete-holiday',
  templateUrl: './delete-holiday.component.html',
  styleUrls: ['./delete-holiday.component.css']
})
export class DeleteHolidayComponent implements OnInit {
  public isDeleteSuccess = false;
  public isDeleteFail = false;
@Input() date
  constructor(
    public activeModal: NgbActiveModal,
    private HolidaysService: HolidaysService
  ) { }

  ngOnInit() {
    console.log(this.date)
  }

  delete(){
    this.HolidaysService.deleteHoliday(this.date.event._def.publicId).subscribe(
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
