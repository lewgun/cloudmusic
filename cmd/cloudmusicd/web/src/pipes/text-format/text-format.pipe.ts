
import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'textFormat'})
export class TextFormatPipe implements PipeTransform {
  
  //args[0]: sep
  //args[1]: len   
  transform(text: any, args: any[] = []) : string {
      
      if (text.length > args[0]) {
          text = text.substr(0, args[0]);
          text += "..."
      }
      return text;     
          
  }
}

