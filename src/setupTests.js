// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom'

// Mock document.createElement for canvas
global.document = {
  createElement: (tagName) => {
    if (tagName === 'canvas') {
      return new global.HTMLCanvasElement()
    }
    return {}
  }
}

// Mock HTMLCanvasElement for Node environment
global.HTMLCanvasElement = class HTMLCanvasElement {
  constructor() {
    this.width = 0
    this.height = 0
  }

  getContext() {
    return {
      drawImage: jest.fn(),
      getImageData: jest.fn(),
      putImageData: jest.fn(),
      fillRect: jest.fn(),
      clearRect: jest.fn(),
    }
  }

  toDataURL() {
    return 'data:image/jpeg;base64,fakeImageData'
  }
}

// Mock Image constructor
global.Image = class {
  constructor() {
    this.width = 800
    this.height = 600
    this._onload = null
    this._src = null
  }
  
  set onload(fn) {
    this._onload = fn
    // If src has already been set, trigger immediately
    if (this._src && fn) {
      setImmediate(() => fn())
    }
  }
  
  get onload() {
    return this._onload
  }
  
  set src(value) {
    this._src = value
    // If onload handler is already set, trigger it
    if (this._onload) {
      setImmediate(() => this._onload())
    }
  }
  
  get src() {
    return this._src
  }
}

// Mock FileReader
global.FileReader = class {
  constructor() {
    this._onload = null
    this._onerror = null
  }
  
  set onload(fn) {
    this._onload = fn
  }
  
  get onload() {
    return this._onload
  }
  
  set onerror(fn) {
    this._onerror = fn
  }
  
  get onerror() {
    return this._onerror
  }
  
  readAsText(blob) {
    // Create a proper result based on blob content
    let text = ''
    if (blob instanceof Blob || blob instanceof File) {
      // For our mock, extract the text from the Blob/File
      // In tests, we pass mock data, so we'll return GPX data
      text = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Test">
  <trk>
    <name>Test Track</name>
    <trkseg>
      <trkpt lat="51.5074" lon="-0.1278">
        <ele>10</ele>
      </trkpt>
      <trkpt lat="51.5075" lon="-0.1279">
        <ele>11</ele>
      </trkpt>
      <trkpt lat="51.5076" lon="-0.1280">
        <ele>12</ele>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`
    } else {
      text = String(blob)
    }
    
    // Call onload asynchronously but immediately
    setImmediate(() => {
      if (this._onload) {
        this._onload({ target: { result: text } })
      }
    })
  }
  
  readAsDataURL() {
    // Call onload asynchronously but immediately
    setImmediate(() => {
      if (this._onload) {
        this._onload({ target: { result: 'data:image/jpeg;base64,fakeImageData' } })
      }
    })
  }
}
