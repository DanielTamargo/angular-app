import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstWord'
})
export class FirstWordPipe implements PipeTransform {

  transform(value?: string, prefix: string = ''): string {
    if (!value) return '';
    if (!value.includes(' ')) return prefix + value;

    return prefix + value.split(' ')[0];
  }

}
