const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

content = content.replace(
    /SURGERY_DONE\s+LOST/,
    `SURGERY_DONE\n  OPD_RESCHEDULE\n  SURGERY_RESCHEDULE\n  LOST`
);

fs.writeFileSync('prisma/schema.prisma', content);
