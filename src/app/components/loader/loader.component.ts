import { Component, OnInit } from '@angular/core';
import { AppLoaderService } from '../../helpers/app-loader.service';
@Component({
  selector: 'app-loader',
  template: `
  <div class="query-progressbar-wrapper" *ngIf="show">
    <mat-progress-bar mode="indeterminate"></mat-progress-bar>
  </div>
  `,
  styles: [
    `.query-progressbar-wrapper{
      position: fixed;
      top: 0;
      left: 0;
      background:transparent;
      z-index: 1050;
      width:100%;
      height:100vh;
    }
    .query-progressbar-wrapper mat-progress-bar{
        margin-top:60px;
    }
  `]
})
export class LoaderComponent implements OnInit {
  show: Boolean = false;
  constructor(private loader: AppLoaderService) { }
  ngOnInit() {
    this.loader.appLoaderSource$.subscribe(
      (data) => this.show = data
    );
  }
}
