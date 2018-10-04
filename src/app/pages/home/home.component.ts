import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('nvd3LineGraph') nvd3LineGraph: any;
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
        x: function (d) { return d.date; },
        y: function (d) { return d.value; },
        useInteractiveGuideline: true,
        dispatch: {
          stateChange: function (e) { console.log('stateChange'); },
          changeState: function (e) { console.log('changeState'); },
          tooltipShow: function (e) { console.log('tooltipShow'); },
          tooltipHide: function (e) { console.log('tooltipHide'); }
        },
        xAxis: {
          axisLabel: 'Time (ms)',
          rotateLabels: -20,
          axisLabelDistance: -35,
          useInteractiveGuideline: true,
          tickFormat: function (d) {
            return d3.time.format('%H:%M')(new Date(d));
          },
          tickValues: []
        },
        yAxis: {
          axisLabel: 'Transactions',
          tickFormat: function (d) {
            return d3.format('.02f')(new Date(d));
          },
          axisLabelDistance: -5
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
        key: 'Transactions',
        color: '#2ca02c',
        values: []
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
    let startDate = this.selected.start.date['_d'];
    _.each(data, (value) => {
      const temp = { date: startDate, value: value };
      this.graphValues.push(_.cloneDeep(temp));
      const newHour = startDate.getHours() + 1;
      startDate = startDate.setHours(newHour);
      startDate = new Date(startDate);
    });

    this.data[0].values = this.graphValues;
    this.graphValues.forEach(element => {
      this.options.chart.xAxis.tickValues.push(element['date']);
    });

    this.nvd3LineGraph.chart.update();
    this.drawLinechart = true;
  }

}
