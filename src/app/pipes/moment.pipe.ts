import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(_.isEmpty(value)) return null;
    if(!moment(value).isValid()) return "invalid date format";
    return moment(value).format(args);
  }

}
