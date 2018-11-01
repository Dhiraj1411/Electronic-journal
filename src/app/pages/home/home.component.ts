import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
  data = [];
  chartOption = {
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
        useInteractiveGuideline: true
      },
      yAxis: {
        axisLabel: 'Transactions',
        showMaxMin: true,
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

  selected: any;
  graphValues: any = [];
  // drawLinechart: Boolean = false;
  @ViewChild('nvd3LineGraph') nvd3LineGraph: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ssbcs: SidebarSubmitBtnClickService,
    private ts: TimelineService
  ) { }

  ngOnInit() {
    this.ssbcs.sidebarSubmitBtnClick$.subscribe(
      (data) => this.onSidebarSubmitBtnClick(data)
    );

    this.data = [
      {
        key: 'Success',
        color: '#2ca02c',
        values: []
      },
      {
        key: 'Inprogress',
        color: '#0039e6',
        values: []
      },
      {
        key: 'Error',
        color: '#b30000',
        values: []
      },
      {
        key: 'Total',
        color: '#990099',
        values: []
      }
    ];

  }

  onSidebarSubmitBtnClick(data) {
    this.selected = data;
    this.ts.getTimeline().subscribe(
      (data1) => this.generateGraphValues(data1)
    );
  }

  generateGraphValues(data: Array<any>[]) {
    this.updateRouteQueryParam();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {

        this.graphValues = [];
        let startDate = this.selected.start.date['_d'];
        let startMin = 0;
        _.each(data[key], (value) => {
          switch (this.selected.transaction) {
            case 1: {
              const temp = { date: startDate, value: value };
              this.graphValues.push(_.cloneDeep(temp));
              const t = moment(startDate);
              startDate = t.add(1, 'days')['_d'];
              break;
            }
            case 2: {
              const temp = { date: startDate, value: value };
              this.graphValues.push(_.cloneDeep(temp));
              const newHour = startDate.getHours() + 1;
              startDate = startDate.setHours(newHour);
              startDate = new Date(startDate);
              break;
            }
            case 3: {
              if (startMin > 60) {
                break;
              }
              const temp = { date: startMin, value: value };
              this.graphValues.push(_.cloneDeep(temp));
              startMin = startMin + 1;
              break;
            }
          }
        });

        if (key === 'successfulTransaction') {
          this.data[0].values = this.graphValues;
        } else if (key === 'errorTransaction') {
          this.data[2].values = this.graphValues;
        } else if (key === 'inProgressTransaction') {
          this.data[1].values = this.graphValues;
        } else if (key === 'totalTransaction') {
          this.data[3].values = this.graphValues;
        }

      }
    }

    console.log(this.data);

    this.options = _.cloneDeep(this.chartOption);
    if (this.selected.transaction === 1) {
      this.options.chart.xAxis.tickValues = [];
      this.options.chart.xAxis.tickFormat = function (d) {
        return d3.time.format('%d %b')(new Date(d));
      };
      this.graphValues.forEach(element => {
        this.options.chart.xAxis.tickValues.push(element['date']);
      });

    } else if (this.selected.transaction === 2) {

      this.options.chart.xAxis.tickValues = [];
      this.options.chart.xAxis.tickFormat = function (d) {
        return d3.time.format('%H:%M')(new Date(d));
      };

      this.graphValues.forEach(element => {
        this.options.chart.xAxis.tickValues.push(element['date']);
      });

    } else if (this.selected.transaction === 3) {
      this.options.chart.xAxis.tickValues = [0, 10, 20, 30, 40, 50, 59];
      this.options.chart.xAxis.tickFormat = function (d) {
        return d;
      };
    }
  }

  updateRouteQueryParam() {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    if (this.selected.transaction === 1) {
      queryParams['transaction'] = 'Per_Day';
    } else if (this.selected.transaction === 2) {
      queryParams['transaction'] = 'Per_Hour';
    } else if (this.selected.transaction === 3) {
      queryParams['transaction'] = 'Per_Minutes';
    }
    this.router.navigate(['.'], { queryParams: queryParams });
  }

}
