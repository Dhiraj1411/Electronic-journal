import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarSubmitBtnClickService {

  // Observable string sources
  private sidebarSubmitBtnClickSource = new Subject<any>();

  // Observable string streams
  sidebarSubmitBtnClick$ = this.sidebarSubmitBtnClickSource.asObservable();

  onSidebarSubmitBtnClick(data: any) {
    this.sidebarSubmitBtnClickSource.next(data);
  }

}
