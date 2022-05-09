import { SizeFormatterPipe } from "./size-formatter.pipe"

describe('SizeFormatterPipe', () => {
  // El pipe es pure, una función sin estado, no hace falta implementar el BeforeEach ni inyectarlo
  const pipe = new SizeFormatterPipe()

  it('transforms 0 into "0 bytes"', () => {
    expect(pipe.transform(0)).toBe('0 bytes')
  })

  it('transforms 1 into "1 byte"', () => {
    expect(pipe.transform(1)).toBe('1 byte')
  })

  it('transforms 2 into "2 bytes"', () => {
    expect(pipe.transform(2)).toBe('2 bytes')
  })

  it('transforms 1024 into "1 KB"', () => {
    expect(pipe.transform(1024)).toBe('1.00 KB')
  })

  it('transforms 1048576 into "1 MB"', () => {
    expect(pipe.transform(1048576)).toBe('1.00 MB')
  })

  it('transforms 1073741824 into "1 GB"', () => {
    expect(pipe.transform(1073741824)).toBe('1.00 GB')
  })

  it('should just convert output to string but not transform it', () => {
    expect(pipe.transform(1000, 0)).toBe('1000')
  })
})
