const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Add followUpNotified to Lead model
content = content.replace(
    /followUpDate\s+DateTime\?/g,
    'followUpDate   DateTime?\n  followUpNotified Boolean @default(false)'
);

// Add notifications array to User model
content = content.replace(
    /activityLogs\s+ActivityLog\[\]/g,
    'activityLogs   ActivityLog[]\n    notifications  Notification[]'
);

// Add Notification model at the end
const notificationModel = `
model Notification {
  id        String   @id @default(cuid())
  userId    String
  title     String
  message   String
  isRead    Boolean  @default(false)
  type      String   @default("INFO")
  link      String?
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
`;

if (!content.includes('model Notification')) {
    content += '\n' + notificationModel;
}

fs.writeFileSync('prisma/schema.prisma', content);
