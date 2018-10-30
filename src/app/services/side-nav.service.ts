import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AppLoaderService } from '../helpers/app-loader.service';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

  constructor(private http: HttpClient, private loader: AppLoaderService) { }

  getClient() {
    const url = environment.local + '/client.json';
    this.loader.onAppLoaderSourceToggle(true);
    return this.http.get(url).pipe(
      tap(clients => clients),
      catchError(this.handleError('get client', [])),
      finalize(() => this.loader.onAppLoaderSourceToggle(false))
    );
  }

  private handleError<T>(operation = 'operation', result?: T, errMsg?) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
