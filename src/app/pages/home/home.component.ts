import { Component, OnInit } from '@angular/core';
import { SidebarSubmitBtnClickService } from '../../helpers/sidebar-submit-btn-click.service';
import { TimelineService } from '../../services/timeline.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selected:any;
  graphValues:any = [];
  drawLinechart:boolean = false;
  constructor(private ssbcs: SidebarSubmitBtnClickService, private ts:TimelineService) { }
  
  ngOnInit() {
    this.ssbcs.sidebarSubmitBtnClick$.subscribe(
      (data) => this.onSidebarSubmitBtnClick(data)
    )
  }

  onSidebarSubmitBtnClick(data){
    this.selected = data;
    this.drawLinechart = false;
    this.ts.getTimeline().subscribe(
      (data) => this.generateGraphValues(data)
    )
  }

  generateGraphValues(data){
    this.graphValues = [];
    let startDate = this.selected.start.date;
    _.each(data, (value)=>{
      let temp = {date: moment(startDate).format(), value: value};
      this.graphValues.push(_.cloneDeep(temp));
      startDate = moment(startDate).add("1", "hour").format();
    });

    this.drawLinechart = true;
  }


}
