import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixCCAAnames'
})
export class FixCCAAnamesPipe implements PipeTransform {

  /**
   * Algunas CCAA vienen con el nombre incorrecto o desordenado, este pipe lo soluciona
   * 
   * @param value texto a 'fixear'
   * @returns texto 'fixeado'
   */
  transform(text: string): string {
    text = text.replace(' -', '');
    if (!text.includes(',')) return text;

    const parts = text.split(',');
    parts.reverse();
    return parts.join(' ');
  }

}
