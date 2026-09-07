const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Remove the incorrect one in Lead model
// The Lead model one is followed by `hospital       Hospital?`
content = content.replace(
    /activityLogs\s+ActivityLog\[\]\s+notifications\s+Notification\[\]\s+hospital\s+Hospital\?/,
    'activityLogs   ActivityLog[]\n  hospital       Hospital?'
);

fs.writeFileSync('prisma/schema.prisma', content);
