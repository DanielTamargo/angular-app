import { Pipe, PipeTransform } from '@angular/core';
import { GitHubFilesInterface } from '../../github/interfaces/github-files.interface';

@Pipe({
  name: 'retrieveGistFileNames'
})
export class RetrieveGistFileNamesPipe implements PipeTransform {

  transform(gistsFiles: GitHubFilesInterface): string {
    let resp = 'No files attached';

    const files = Object.values(gistsFiles);
    if (files.length > 0) {
      resp = '';
      let first = true;
      for (const file of files) {
        if (first) first = false;
        else resp += '  //  ';

        resp += `${file.filename} (${file.language})`;
      }
    }

    return resp;
  }

}
