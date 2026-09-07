const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/CaseManagerModal.tsx', 'utf8');

// 1. Add new status options
const newOptions = `                                <option value="FOLLOW_UP">Follow Up</option>
                                <option value="OPD_SCHEDULED">OPD Scheduled</option>
                                <option value="OPD_DONE">OPD Done</option>
                                <option value="OPD_RESCHEDULE">OPD Reschedule</option>
                                <option value="SURGERY_SCHEDULED">Surgery Scheduled</option>
                                <option value="SURGERY_DONE">Surgery Done</option>
                                <option value="SURGERY_RESCHEDULE">Surgery Reschedule</option>
                                <option value="LOST">Lost</option>`;

content = content.replace(
    /<option value="OPD_SCHEDULED">OPD Scheduled<\/option>[\s\S]*?<option value="LOST">Lost<\/option>/,
    newOptions
);

// 2. Change OPD Date from format date to format datetime
// Find where opdDate state is initialized: `const [opdDate, setOpdDate] = useState(formatDateForInput(lead.opdDate));`
// Wait, I previously injected `formatDateTimeForInput`. So let's replace `formatDateForInput(lead.opdDate)` with `formatDateTimeForInput(lead.opdDate)`.
content = content.replace(
    /const \[opdDate, setOpdDate\] = useState\(formatDateForInput\(lead\.opdDate\)\);/,
    `const [opdDate, setOpdDate] = useState(formatDateTimeForInput(lead.opdDate));`
);

// 3. Change OPD Date input type
content = content.replace(
    /type="date"([\s\S]*?)value=\{opdDate\}/m,
    `type="datetime-local"$1value={opdDate}`
);

fs.writeFileSync('src/components/dashboard/CaseManagerModal.tsx', content);
