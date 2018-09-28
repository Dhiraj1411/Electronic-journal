import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
declare let d3: any;

@Component({
    selector: 'app-linechart',
    templateUrl: './linechart.component.html',
    styleUrls: ['./linechart.component.css']
})
export class LinechartComponent implements OnInit, AfterViewInit {
    @Input() data;
    d3Chart: any;
    svgWidth: any = 900;
    svgHeight: any = 400;
    svgElement: any;
    @ViewChild('svg') svg: ElementRef;
    constructor() { }

    ngOnInit() {
    }
    ngAfterViewInit() {
        if (_.isEmpty(this.data) || !this.data.length) {
            return;
        }
        // 1
        this.svgElement = this.svg.nativeElement;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 }
            , width = this.svgWidth - margin.left - margin.right // Use the window's width
            , height = this.svgHeight - margin.top - margin.bottom,
            timeHeight = height + 10; // Use the window's height
        // The number of datapoints
        const n = this.data.length;

        // 4
        const xScale = d3.scaleLinear()
            .domain([0, n - 1]) // input
            .range([0, width]); // output

        // 6
        const maxData = _.maxBy(this.data, (data) => data.value);
        const yScale = d3.scaleLinear()
            .domain([0, maxData.value]) // input
            .range([height, 0]); // output

        // 7
        const line = d3.line()
            .x(function (d, i) { return xScale(i); }) // set the x values for the line generator
            .y(function (d) { return yScale(d.value); }) // set the y values for the line generator
            .curve(d3.curveMonotoneX); // apply smoothing to the line

        // 2
        this.d3Chart = d3.select(this.svgElement)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        // 3a
        const xAxisDate = d3.axisBottom(xScale)
            .tickFormat(i => this.xLabelDate(i))
            .ticks(n);
        const xAxisTime = d3.axisBottom(xScale)
            .tickFormat(i => this.xLabelTime(i)).
            ticks(n);
        // 3
        this.d3Chart.append('g')
            .attr('class', 'timeClass')
            .attr('transform', 'translate(0,' + timeHeight + ')')
            .call(xAxisTime)
            .select('path')
            .style('display', 'none');

        this.d3Chart.select('.timeClass')
            .selectAll('line')
            .style('display', 'none');

        this.d3Chart.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxisDate);

        // 5
        this.d3Chart.append('g')
            .attr('class', 'y axis')
            .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

        this.d3Chart.append('path')
            .datum(this.data) // 10. Binds data to the line
            .attr('class', 'line') // Assign a class for styling
            .attr('d', line); // 11. Calls the line generator

    }

    xLabelDate(index) {
        const date = this.data[index].date;
        return moment(date).format('DD/MM');
    }

    xLabelTime(index) {
        const date = this.data[index].date;
        return moment(date).format('HH:mm');
    }



}




