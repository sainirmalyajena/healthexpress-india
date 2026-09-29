const sharp = require('sharp');
const fs = require('fs');

async function fixIcons() {
  const source = 'public/icon-192x192.png'; // This is actually 1024x1024 valid PNG

  // Create proper sizes
  await sharp(source).resize(192, 192).toFile('src/app/icon.png');
  await sharp(source).resize(180, 180).toFile('src/app/apple-icon.png');
  await sharp(source).resize(48, 48).toFile('public/icon-48x48.png');

  console.log('Icons generated!');
}

fixIcons().catch(console.error);
