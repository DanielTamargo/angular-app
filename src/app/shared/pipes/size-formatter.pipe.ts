import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sizeFormatter'
})
export class SizeFormatterPipe implements PipeTransform {

  transform(value: number, sizeType = 1): string {
    
    switch (sizeType) {
      case 1: // Capacidad
        return this.convertBytes(value);
        
      // Otros cases posibles serían Kilómetros, medidas en pulgadas, etc
    }

    // Retornamos la conversión a string por si el sizeType indicado no está contemplado
    return String(value);
  }

  convertBytes(bytes: number): string {
    let resp: string;
    if      (bytes >= 1073741824) { resp = (bytes / 1073741824).toFixed(2) + " GB"; }
    else if (bytes >= 1048576)    { resp = (bytes / 1048576).toFixed(2) + " MB"; }
    else if (bytes >= 1024)       { resp = (bytes / 1024).toFixed(2) + " KB"; }
    else if (bytes > 1)           { resp = bytes + " bytes"; }
    else if (bytes == 1)          { resp = bytes + " byte"; }
    else                          { resp = "0 bytes"; }
    return resp;
  }

}
