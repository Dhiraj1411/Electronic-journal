import { Component, OnInit } from '@angular/core';
import { AppLoaderService } from '../../helpers/app-loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  show:boolean = false;
  constructor(private loader: AppLoaderService) { }

  ngOnInit() {
    this.loader.appLoaderSource$.subscribe(
      (data) => this.show = data
    )
  }

}
