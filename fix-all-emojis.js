const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all corrupted symbols
    content = content.replace(/dY"z/g, '\uD83D\uDCDE'); // Phone 📞
    content = content.replace(/dY -/g, '\uD83E\uDD16'); // Robot 🤖
    content = content.replace(/\?O/g, '\uD83D\uDEA8'); // Siren 🚨
    content = content.replace(/dY'/g, '\uD83D\uDCA1'); // Bulb 💡
    content = content.replace(/dY\+/g, '\uD83D\uDCE2'); // Megaphone 📢
    content = content.replace(/dY"/g, '\uD83D\uDCE3'); // Megaphone 📣
    content = content.replace(/o\./g, '\u2705'); // Check ✅
    content = content.replace(/T,\?/g, '\uD83D\uDD04'); // Recycle 🔄
    
    fs.writeFileSync(filePath, content, 'utf8');
}

fixFile(path.join('src', 'components', 'dashboard', 'LeadsTable.tsx'));
fixFile(path.join('src', 'app', 'api', 'webhooks', 'meta-leads', 'route.ts'));

console.log('Fixed all corrupted emojis in LeadsTable and Meta Webhook!');
