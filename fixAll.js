const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('./src/app', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    if (content.includes('"/og-image.png"')) {
      content = content.replace(/"\/og-image\.png"/g, '`${baseUrl}/logo.png`');
      changed = true;
    }
    
    // Some places might not have baseUrl defined, let's inject it if missing
    if (changed && !content.includes('const baseUrl')) {
       // if generateMetadata exists, prepend baseUrl
       content = content.replace(/export async function generateMetadata[^\{]+\{\n/, match => {
           return match + "  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://healthexpressindia.com';\n";
       });
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', filePath);
    }
  }
});
