const fs = require('fs');
const path = require('path');
const file = path.join('src', 'app', 'api', 'webhooks', 'meta-leads', 'route.ts');
let content = fs.readFileSync(file, 'utf8');

// 1. Add hasCard extraction
content = content.replace("let surgery = '';", "let surgery = '';\n    let hasCard = false;");

const parseFieldRegex = /\} else if \(fieldName\.includes\('surgery'\) \|\| fieldName\.includes\('treatment'\) \|\| fieldName\.includes\('procedure'\)\) \{\s*surgery = val;\s*\}/;
const replaceParseField = `} else if (fieldName.includes('surgery') || fieldName.includes('treatment') || fieldName.includes('procedure')) {
                        surgery = val;
                    } else if (fieldName.includes('insurance') || fieldName.includes('health') || fieldName.includes('card')) {
                        if (val.toLowerCase() === 'yes' || val.toLowerCase() === 'true') {
                            hasCard = true;
                        }
                    }`;
content = content.replace(parseFieldRegex, replaceParseField);

// 2. Fix the notes formatting
const buildNotesRegex = /if \(Object\.keys\(rawFields\)\.length > 0\) \{\s*notes \+= \`Fields: \$\{JSON\.stringify\(rawFields\)\}\\n\`;\s*\}/;
const replaceBuildNotes = `if (Object.keys(rawFields).length > 0) {
        notes += '\\n--- Lead Details ---\\n';
        for (const [key, val] of Object.entries(rawFields)) {
            notes += \`\${key.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}: \${val}\\n\`;
        }
    }`;
content = content.replace(buildNotesRegex, replaceBuildNotes);

// 3. Add hasCard to the prisma creation
const createRegex = /notes,\n\s*source: 'Meta Ads',/;
const replaceCreate = `notes,\n                hasCard,\n                source: 'Meta Ads',`;
content = content.replace(createRegex, replaceCreate);

fs.writeFileSync(file, content, 'utf8');
