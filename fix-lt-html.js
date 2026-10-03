const fs = require('fs');
const path = require('path');
const file = path.join('src', 'components', 'dashboard', 'LeadsTable.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace the phone link block entirely to fix the phone icon
content = content.replace(/<a href=\{`tel:\$\{lead\.phone\}`\}.*?>\s*.*?\s*\{lead\.phone\}\s*<\/a>/, 
    '<a href={`tel:${lead.phone}`} className="text-xs text-teal-600 hover:text-teal-800 hover:underline font-medium flex items-center gap-1">\uD83D\uDCDE {lead.phone}</a>');

// Fix the Export CSV buttons entirely
content = content.replace(/<button[^>]*title="Export all leads to CSV"[^>]*>[\s\S]*?<\/button>/, 
    `<button type="button" onClick={exportToCSV} className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1" title="Export all leads to CSV">\uD83D\uDCC4 Export All CSV</button>`);

content = content.replace(/<button[^>]*title="Export all leads as Contacts"[^>]*>[\s\S]*?<\/button>/, 
    `<button type="button" onClick={exportToVCF} className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1" title="Export all leads as Contacts">\uD83D\uDCD7 Export All Contacts (.vcf)</button>`);

// Fix the Bland AI alert messages
content = content.replace(/alert\(`.*?Bland AI Notice:[\s\S]*?`\);/g, `alert('\uD83D\uDEA8 Bland AI Notice: International calls to Indian (+91) numbers are locked on trial accounts.\\n\\nTo unlock AI calling to India:\\n1. Log into your Bland AI dashboard at https://app.bland.ai\\n2. Go to Billing and make a minimum $10 credit purchase.\\n\\n\uD83D\uDCA1 In the meantime, you can message ' + lead.fullName + ' directly for \u20B90 using the green WhatsApp button!');`);

content = content.replace(/if \(\!window\.confirm\([\s\S]*?\)\) return;/g, `if (!window.confirm('\uD83E\uDD16 Trigger Bland AI Voice Call to ' + lead.fullName + ' (' + lead.phone + ')?\\n\\n\u26A0\uFE0F COST NOTICE: Bland AI charges ~$0.09 (\u20B97.50) per minute from your Bland balance.\\nYour current account balance is ~$1.96 (~15-20 minutes total).\\n\\nSarah (AI Voice Receptionist) will dial the patient, inquire about their "' + (lead.surgery?.name || 'medical consultation') + '", and attempt to book an appointment automatically.\\n\\nDo you want to proceed?')) return;`);

// Find any other ? or weird chars and clean them if necessary.
// We also have to fix the date string
// <td>{lead.createdAt} ... dY"? ...

fs.writeFileSync(file, content, 'utf8');
