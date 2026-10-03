const fs = require('fs');
const path = require('path');
const file = path.join('src', 'components', 'dashboard', 'CaseManagerModal.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<a href=\{`tel:\$\{lead\.phone\}`\}.*?>\s*.*?\s*\{lead\.phone\}\s*<\/a>/, 
    '<a href={`tel:${lead.phone}`} className="text-sm text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1">\uD83D\uDCDE {lead.phone}</a>');
    
content = content.replace(/<button onClick=\{onClose\}.*?>\s*.*?\s*<\/button>/, 
    '<button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 text-xl">\u2715</button>');
    
content = content.replace(/Quoted Cost \(.*?\)/, 'Quoted Cost (\u20B9)');

fs.writeFileSync(file, content, 'utf8');
