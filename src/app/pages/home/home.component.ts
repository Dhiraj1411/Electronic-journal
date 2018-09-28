import { Component, OnInit } from '@angular/core';
import { SidebarSubmitBtnClickService } from '../../helpers/sidebar-submit-btn-click.service';
import { TimelineService } from '../../services/timeline.service';
import * as _ from 'lodash';
import * as moment from 'moment';
declare let d3: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  options;
  data;

  selected: any;
  graphValues: any = [];
  drawLinechart: Boolean = false;
  constructor(private ssbcs: SidebarSubmitBtnClickService, private ts: TimelineService) { }

  ngOnInit() {
    this.ssbcs.sidebarSubmitBtnClick$.subscribe(
      (data) => this.onSidebarSubmitBtnClick(data)
    );

    this.options = {
      chart: {
        type: 'lineChart',
        height: 400,
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: function (d) { return d.x; },
        y: function (d) { return d.y; },
        useInteractiveGuideline: true,
        dispatch: {
          stateChange: function (e) { console.log('stateChange'); },
          changeState: function (e) { console.log('changeState'); },
          tooltipShow: function (e) { console.log('tooltipShow'); },
          tooltipHide: function (e) { console.log('tooltipHide'); }
        },
        xAxis: {
          axisLabel: 'Time (ms)'
        },
        yAxis: {
          axisLabel: 'Voltage (v)',
          tickFormat: function (d) {
            return d3.format('.02f')(d);
          },
          axisLabelDistance: -10
        },
        callback: function (chart) {
          console.log('!!! lineChart callback !!!');
        }
      },
      title: {
        enable: true,
        text: 'Title for Line Chart'
      }
    };

    this.data = [
      {
        key: 'Cumulative Return',
        color: '#2ca02c',
        values: [
          {
            'x': 1,
            'y': 10
          },
          {
            'x': 2,
            'y': 20
          },
          {
            'x': 3,
            'y': 30
          },
          {
            'x': 4,
            'y': 50
          },
          {
            'x': 5,
            'y': 50
          },
          {
            'x': 6,
            'y': 60
          },
          {
            'x': 7,
            'y': 70
          },
          {
            'x': 8,
            'y': 80
          },
        ]
      }
    ];

  }

  onSidebarSubmitBtnClick(data) {
    this.selected = data;
    this.drawLinechart = false;
    this.ts.getTimeline().subscribe(
      (data1) => this.generateGraphValues(data1)
    );
  }

  generateGraphValues(data) {
    this.graphValues = [];
    let startDate = this.selected.start.date;
    _.each(data, (value) => {
      const temp = { date: moment(startDate).format(), value: value };
      this.graphValues.push(_.cloneDeep(temp));
      startDate = moment(startDate).add('1', 'hour').format();
    });

    this.drawLinechart = true;
  }


}
