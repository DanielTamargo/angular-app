import { RetrieveGistFileNamesPipe } from "./retrieve-gist-file-names.pipe"

describe('RetrieveGistFileNamesPipe', () => {
  // El pipe es pure, una función sin estado, no hace falta implementar el BeforeEach ni inyectarlo
  const pipe = new RetrieveGistFileNamesPipe()

  const singleFile: any = {
    'singleFile':  {
      filename: 'singleFile',
      type: '',
      language: 'test',
      raw_url: '',
      size: 1,
    }
  }

  const multipleFiles: any = {
    'firstFile':  {
      filename: 'firstFile',
      type: '',
      language: 'test',
      raw_url: '',
      size: 1,
    },
    'secondFile':  {
      filename: 'secondFile',
      type: '',
      language: 'test',
      raw_url: '',
      size: 1,
    },
  }

  it('transforms gist single file to str output', () => {
    expect(pipe.transform(singleFile)).toBe('singleFile (test)')
  })

  it('transforms gist files to str output', () => {
    expect(pipe.transform(multipleFiles)).toBe('firstFile (test)  //  secondFile (test)')
  })
})
