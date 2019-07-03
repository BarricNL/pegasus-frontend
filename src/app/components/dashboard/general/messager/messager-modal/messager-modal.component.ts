import { ChattingService } from './../../../../../services/repositories/chatting.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Animations } from '../../../../../../animation/chatting-animation'

@Component({
  selector: 'app-messager-modal',
  templateUrl: './messager-modal.component.html',
  styleUrls: ['./messager-modal.component.css'],
  animations: [Animations.changeThemeColor]
})
export class MessagerModalComponent implements OnInit {
  //数组里的顺序和名字要和HTML里的一致
  public functionalBtnNames: Array<string> = ['subscribers', 'recently', 'chatting'];
  //previoud btn user clicked
  public previousBtnName: string = 'subscribers';
  //current btn user clicked
  public currentBtnIndex: number = 0;
  //display personalLabel or not
  public personalLabelDisplayFlag: boolean = true;
  public subscribersDisplayFlag: boolean = true;
  public recentlyDisplayFlag: boolean = false;
  public chattingDisplayFlag: boolean = false;
  public settingDisaplayFlag: boolean = false;
  public isErrorFlag: boolean = false;
  public themeChangeFlag: string = 'theme1';
  public preBtnSelectedObj: any = null;
  public chattingWithStr: string = '';
  public styleList: Array<object> = [{ background: 'linear-gradient(135deg, pink, white)' },
  { background: 'linear-gradient(135deg, lightgreen, lightblue)' },
  { background: 'linear-gradient(135deg, black, white)' },
  { background: 'linear-gradient(135deg, red, lightblue)' },
  { background: 'linear-gradient(135deg, lightblue, pink)' }]


  @Input() browserHeight;
  @Output() onCloseChattingModal = new EventEmitter();
  constructor(private chattingService: ChattingService) { }

  ngOnInit() {
    //if failed read data.
    this.isErrorFlag = this.chattingService.errorFlag;
    //set init modal title
    this.setChattingModalTitle();
    //get custom theme.
    this.getCustomTheme();
    //get init preBtnSelectOnj
    this.preBtnSelectedObj = document.getElementById('initSelected');
  }

  /*
    called by template.
    set browser's height, respose in diffrent size of browsers
  */
  setChattingModalHeight() {
    let modalHeight = (this.browserHeight <= 750) ? 550 : null;
    return modalHeight;
  }

  /*
    set modal title.
  */
  setChattingModalTitle() {
    let subObj = this.chattingService.getSubscriberChattingWith();
    if (subObj) {
      this.chattingWithStr = 'Chatting with ' + subObj.FirstName + ' ' + subObj.LastName;
    }
  }

  /*
    get custom theme setting.
  */
  getCustomTheme() {
    this.themeChangeFlag = localStorage.getItem('themeIndex') ? localStorage.getItem('themeIndex') : 'theme1';
  }

  /*
    display/hide configration panel
  */
  displayConfigPanel() {
    this.settingDisaplayFlag = !this.settingDisaplayFlag;
  }

  /*
    custom personl theme
  */
  customizeTheme(index) {
    this.themeChangeFlag = 'theme' + index;
    //save custom theme in local storage.
    localStorage.setItem('themeIndex', this.themeChangeFlag);
  }

  /*
    0: subscribers
    1: recently
    2: now chatting
  */
  switchDisplayView(selectId) {
    //如果点击的是当前页的btn 则不发生任何事情
    if (selectId == this.currentBtnIndex) {
      return;
    }
    else {
      this.currentBtnIndex = selectId;
      if (selectId == 2) {
        this.personalLabelDisplayFlag = false;
      }
      else {
        this.personalLabelDisplayFlag = true;
      }
      this.viewDisplayHandler(selectId);
    }
  }

  /*
    display/hide views
  */
  viewDisplayHandler(selectId) {
    let currentflag = this.functionalBtnNames[selectId] + 'DisplayFlag';
    let previousFlag = this.previousBtnName + 'DisplayFlag';
    this[previousFlag] = false;
    this[currentflag] = true;
    this.previousBtnName = this.functionalBtnNames[selectId];
  }

  /*
    选择聊天对象后 跳转到聊天界面
    event == true: a subscriber is selected, start chatting now
    event == false: no subscriber selected
  */
  startChattingWith(event) {
    if (event == true) {
      this.setChattingModalTitle();
      this.switchDisplayView(2);
    }
    else {
      this.switchDisplayView(0);
    }
  }

  /*
    fire emit to parent component to close chatting modal(minimize)
  */
  closeChattingModal() {
    this.onCloseChattingModal.emit('true');
  }

}
