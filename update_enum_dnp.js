const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

content = content.replace(
    /enum LeadStatus \{[\s\S]*?\}/,
    `enum LeadStatus {
  NEW
  CONTACTED
  FOLLOW_UP
  DNP
  OPD_SCHEDULED
  OPD_DONE
  OPD_RESCHEDULE
  SURGERY_SCHEDULED
  SURGERY_DONE
  SURGERY_RESCHEDULE
  LOST
  CLOSED
}`
);

fs.writeFileSync('prisma/schema.prisma', content);
