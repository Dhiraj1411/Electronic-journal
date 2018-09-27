import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


import { Observable, of } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AppLoaderService } from '../helpers/app-loader.service';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {

  constructor(private http: HttpClient, private loader: AppLoaderService) { }

  getTimeline(): Observable<any> {
    const url = environment.local + '/timeline.json';
    this.loader.onAppLoaderSourceToggle(true);
    return this.http.get(url)
      .pipe(
        tap(earnings => earnings),
        catchError(this.handleError('getTimeline', [])),
        finalize(() => this.loader.onAppLoaderSourceToggle(false))
      );
  }
  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T, errMsg?) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      //console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
