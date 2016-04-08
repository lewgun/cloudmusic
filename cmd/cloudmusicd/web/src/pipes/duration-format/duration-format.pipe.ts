//https://angular.io/docs/ts/latest/guide/pipes.html

import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'durationFormat'})
export class DurationFormatPipe implements PipeTransform {
  transform(duration: number, args: any[] = []) : string {
      
      console.log("duration: ", duration);
      let unit = 1000;
      
      let base = 60 * unit;
      if (args.length >= 1) {
          if (args[0] ==="s") {  //已经是秒了
              base /= unit;
              unit = 1;
          }
      }
      let min = "" + Math.floor( duration / base );
      
      let sec = "" + Math.floor( (duration -  base * (+min) ) / unit);
      
      if ( min.length < 2) {
          min = "0" + min;
      }

      if ( sec.length < 2) {
          sec = "0" + sec;
      }
      return min + ":" + sec;
      
          
  }
}