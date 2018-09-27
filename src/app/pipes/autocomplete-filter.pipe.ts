import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
@Pipe({
  name: 'autocompleteFilter'
})
export class AutocompleteFilterPipe implements PipeTransform {

  transform(options: any, args?: any): any {
    if(_.isEmpty(options) || _.isEmpty(args)){
      return options;
    }
    let options$ = options.filter((option) => {
      return option.text.indexOf(args) === 0;
    });
    return options$;
  }

}
