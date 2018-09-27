import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppLoaderService {

  // Observable string sources
  private appLoaderSource = new Subject<boolean>();

  // Observable string streams
  appLoaderSource$ = this.appLoaderSource.asObservable();

  onAppLoaderSourceToggle(data: boolean) {
    this.appLoaderSource.next(data);
  }

}
