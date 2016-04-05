//https://angular.io/docs/ts/latest/guide/pipes.html

import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'durationFormat'})
export class DurationFormatPipe implements PipeTransform {
  transform(duration: number, args: any[] = []) : string {
      
      const base = 60 * 1000;
      let min = "" + Math.floor( duration / base );
      
      let sec = "" + Math.floor( (duration -  base * (+min) ) / 1000);
      
      if ( min.length < 2) {
          min = "0" + min;
      }

      if ( sec.length < 2) {
          sec = "0" + sec;
      }
      return min + ":" + sec;
      
          
  }
}