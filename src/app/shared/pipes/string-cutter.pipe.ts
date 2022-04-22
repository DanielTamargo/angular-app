import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringCutter'
})
export class StringCutterPipe implements PipeTransform {

  transform(value: string, maxLength = 65): string {
    if (value.length > maxLength) return value.substring(0, maxLength) + '...';
    return value;
  }

}
