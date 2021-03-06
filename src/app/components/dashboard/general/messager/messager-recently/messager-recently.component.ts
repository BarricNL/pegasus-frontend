import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessagerService } from 'src/app/services/repositories/messager.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-messager-recently',
  templateUrl: './messager-recently.component.html',
  styleUrls: ['./messager-recently.component.css',
    '../../../dashboard-components/teachers/teacher-panel/teacher-panel.component.css']
})
export class MessagerRecentlyComponent implements OnInit {
  public recentlySubscribers: Array<object>;
  public photoUrl = environment.photoUrl;
  
  @Output() onChattingWith = new EventEmitter();
  constructor(private messagerService: MessagerService) { }

  ngOnInit() {
    this.recentlySubscribers = this.messagerService.getRecentSubscribers();
  }

  /*
  点击选择和谁聊天
  */
  chattingWithHandler(subscriber) {
    this.messagerService.saveSubscriberNowChattingWith(subscriber);
    this.onChattingWith.emit(true);
  }
}