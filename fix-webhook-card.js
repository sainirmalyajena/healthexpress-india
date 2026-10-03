const fs = require('fs');
const path = require('path');
const file = path.join('src', 'app', 'api', 'webhooks', 'meta-leads', 'route.ts');
let content = fs.readFileSync(file, 'utf8');

// Update existingLead 
content = content.replace("surgeryId: surgeryId || existingLead.surgeryId,", "surgeryId: surgeryId || existingLead.surgeryId,\n                hasCard: hasCard || existingLead.hasCard,");

// Update newLead
content = content.replace("notes,\n            sourcePage:", "notes,\n            hasCard,\n            sourcePage:");

fs.writeFileSync(file, content, 'utf8');
