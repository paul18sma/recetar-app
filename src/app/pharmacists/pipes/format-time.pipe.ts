import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number): string {
    // for HH:MM:SS
    const hours: number = Math.floor(value / 3600);
    const minutes: number = Math.floor((value % 3600) / 60);
    const seconds: number = Math.floor(value - minutes * 60);
    if(hours > 0){
      return `<div>${('0' + hours).slice(-1)} </div>`;
    }else if(minutes > 0){
      return `<div>${('00' + minutes).slice(-2)}</div>`;
    }else if(seconds > 0){
      return `<div>${('00' + seconds).slice(-2)}</div>`;
    }
 }

}
