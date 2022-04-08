import * as artkit from '@artkit/connect';
import p5 from 'p5';

const { id, isPreview } = artkit.parseQueryParameters({
  id: 'number',
  isPreview: 'boolean'
})

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    if (isPreview) p.noLoop()
  }
  
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
  
  p.draw = () => {
    const seed = id * 100000
    p.randomSeed(seed)
    p.noiseSeed(seed)
  
    const shape = p.random() < 0.5 ? 'Circle' : 'Square';
    
    p.background(p.random(255), p.random(255), p.random(255));
    p.noStroke()
    p.fill(p.random(255), p.random(255), p.random(255));
    const size = p.min(p.windowWidth, p.windowHeight) * 0.5
  
    if (shape === 'Circle') {
      p.circle(p.windowWidth / 2, p.windowHeight / 2, size)
    } else {
      p.rect(p.windowWidth / 4, p.windowHeight / 4, size)
    }
    
    if (isPreview) {
      saveMetadata({
        Shape: shape
      })
    }
  }
}

// Call this function once the art has been fully rendered.
// This saves the metadata attributes and preview image.
function saveMetadata(attributes) {
  artkit.saveMetadata({
    attributes() {
      return attributes
    },
    // This function should return a 'data:' url containing an image
    image() {
      const canvas = document.querySelector('canvas')
      return canvas.toDataURL('image/png', 100)
    }
  })
}

const instanceP5 = new p5(sketch);
