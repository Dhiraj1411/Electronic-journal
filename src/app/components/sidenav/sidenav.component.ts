import { Component, OnInit } from '@angular/core';
import { HomeTransactionOptions } from '../../hardcoded/home-transaction-options';
import { HomeClientOptions } from '../../hardcoded/home-client-options';
import { SidebarSubmitBtnClickService } from '../../helpers/sidebar-submit-btn-click.service';
import { SideNavService } from '../../services/side-nav.service';

import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  transactions = HomeTransactionOptions;
  hours: any = [];
  mins: any = [];
  today = moment();
  yesterday = moment().add('-1', 'day');
  hours_now = _.toString(this.today.format('HH'));
  minutes_now = _.toString(this.today.format('mm'));
  selected: any = {
    transaction: null,
    client: null,
    start: {
      date: this.yesterday.format(),
      hours: (parseInt(this.hours_now, 10) + 1).toString(),
      mins: this.minutes_now
    },
    end: {
      date: this.today.format(),
      hours: this.hours_now,
      mins: this.minutes_now
    }
  };
  disableHourDropDown: Boolean = false;
  disableMinuteDropDown: Boolean = false;
  constructor(
    private ssbcs: SidebarSubmitBtnClickService,
    private sideNav: SideNavService
  ) { }

  ngOnInit() {
    this.sideNav.getClient().subscribe((data) => {
      this.selected.client = data;
    });
    this.selected.transaction = this.transactions[1].code;
    this.setTimeValues();
    setTimeout(() => {
      this.onSubmit();
    });
  }

  onTransactionChange() {
    switch (this.selected.transaction) {
      case 1: {
        this.disableHourDropDown = true;
        this.disableMinuteDropDown = true;
        this.selected.start.mins = this.minutes_now;
        this.selected.end.mins = this.minutes_now;
        this.selected.start.date = moment().add('-15', 'day').format();
        break;
      }
      case 3: {
        this.disableHourDropDown = true;
        this.disableMinuteDropDown = false;
        this.selected.start.mins = 0;
        this.selected.end.mins = 59;
        break;
      }
      default: {
        this.disableHourDropDown = false;
        this.disableMinuteDropDown = false;
        this.selected.start.mins = this.minutes_now;
        this.selected.end.mins = this.minutes_now;
      }
    }
  }

  setTimeValues() {
    for (let i = 0; i < 24; i++) {
      let hour = _.toString(i);
      if (hour.length === 1) {
        hour = '0' + hour;
      }
      this.hours.push({ text: hour, value: hour });
    }
    for (let i = 0; i < 60; i++) {
      let mins = _.toString(i);
      if (mins.length === 1) {
        mins = '0' + mins;
      }
      this.mins.push({ text: mins, value: mins });
    }
  }

  onSubmit() {
    const selected = _.cloneDeep(this.selected);
    selected.start.date = moment(selected.start.date).set({ 'hours': selected.start.hours, 'minutes': selected.start.mins });
    selected.end.date = moment(selected.end.date).set({ 'hours': selected.end.hours, 'minutes': selected.end.mins });
    this.ssbcs.onSidebarSubmitBtnClick(selected);
  }

}
