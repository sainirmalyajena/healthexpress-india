const sharp = require('sharp');
sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }
})
.composite([{
  input: Buffer.from('<svg width="1024" height="1024"><circle cx="512" cy="512" r="400" fill="#1e3a8a"/></svg>'),
  blend: 'over'
}])
.png()
.toFile('C:\\Users\\nirma\\.gemini\\antigravity\\brain\\f67091a1-43c2-4a93-92f8-466674b73fe7\\transparent_icon_final.png')
.then(() => console.log('Done'))
.catch(console.error);
