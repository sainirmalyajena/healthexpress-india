const fs = require('fs');
const path = 'src/components/dashboard/LeadsTable.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('Added: {new Date(lead.createdAt)')) {
    content = content.replace(
        /(<a href={`tel:\$\{lead\.phone\}`}.*?<\/a>)/s,
        `$1\n                                                      <div className="md:hidden mt-1 text-[10px] text-slate-500 font-medium w-full">\n                                                          Added: {new Date(lead.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}\n                                                      </div>`
    );
    fs.writeFileSync(path, content, 'utf8');
    console.log("Updated LeadsTable.tsx!");
} else {
    console.log("Already updated.");
}
