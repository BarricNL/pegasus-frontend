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
  public isErrorFlag: boolean = false;
  public themeChangeFlag: string = 'theme1';
  public preBtnSelectedObj: any = null;
  public user:object;
  public modalHeight;
  public styleList: Array<object> = [ {background: 'linear-gradient(135deg, pink, white)'},
                                      {background: 'linear-gradient(135deg, lightgreen, lightblue)'},
                                      {background: 'linear-gradient(135deg, black, white)'},
                                      {background: 'linear-gradient(135deg, red, lightblue)'},
                                      {background: 'linear-gradient(135deg, lightblue, pink)'}]


  @Input() browserHeight;
  @Output() onCloseChattingModal = new EventEmitter();
  constructor(private chattingService:ChattingService) { }

  ngOnInit() {
    this.getModalHeight();
    //if can not get data from server
    if(this.chattingService.errorFlag == true){
      this.isErrorFlag = true;
    }
    //各种初始化 未完成
    //1、获取正在跟跟谁聊天  (subscriber component set数据)
    this.user = sessionStorage.user == undefined ? null : sessionStorage.user;

    //2、获取目前选用的主题 (project项目初始化的时候从后台获取数据) 未完成

    this.preBtnSelectedObj = document.getElementById('initSelected');
   
  }

  /*
    get browser's height, respose in diffrent size of browsers
  */
  getModalHeight() {
    //可能会有bug？加载过慢的时候
    console.log(this.browserHeight)
    if(this.browserHeight <= 750){
      this.modalHeight = 550;
    }
  }

  /*
    display configration panel
  */
  showConfigPanel() {
    let obj = document.getElementsByClassName('m_m_style')[0];
    if (obj['style'].display == '' || obj['style'].display == 'none') {
      obj['style'].display = 'block';
    }
    else {
      obj['style'].display = 'none';
    }
  }

  /*
    custom personl theme
  */
  changeStyle(index) {
    this.themeChangeFlag = 'theme' + index;
    //向后台发送更新的数据 未完成
  }

  /*
    0: subscribers
    1: recently
    2: now chatting
  */
  selectFunctionalBtn(selectId) {
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
      this.modalDisplayHandler(selectId);
    }
  }

  modalDisplayHandler(selectId) {
    let currentflag = this.functionalBtnNames[selectId] + 'DisplayFlag';
    let previousFlag = this.previousBtnName + 'DisplayFlag';
    this[previousFlag] = false;
    this[currentflag] = true;
    this.previousBtnName = this.functionalBtnNames[selectId];
  }
  /*
    选择聊天对象后 跳转到聊天界面
    event == none: 目前没有聊天对象
    event !== none： 目前有聊天对象
  */
  startChattingWith(event?) {
    if (event !== undefined) {
      //如果双击跟某人聊天 接收到指令
      if (event.status == true) {
        this.user = event.user;
        this.selectFunctionalBtn(2);
      }
    }
    else {
      console.log('a')
      this.selectFunctionalBtn(0);
    }
  }

  closeChattingModal() {
    this.onCloseChattingModal.emit('true');
  }

}