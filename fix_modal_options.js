const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/CaseManagerModal.tsx', 'utf8');

const oldSelect = `<option value="FOLLOW_UP">Follow Up</option>
                                <option value="OPD_SCHEDULED">OPD Scheduled</option>`;

const newSelect = `<option value="FOLLOW_UP">Follow Up</option>
                                <option value="CALL_BACK">Call Back</option>
                                <option value="DNP">DNP (Did Not Pick Up)</option>
                                <option value="OPD_SCHEDULED">OPD Scheduled</option>`;

content = content.replace(oldSelect, newSelect);

const oldClosed = `<option value="LOST">Lost</option>`;
const newClosed = `<option value="LOST">Lost</option>
                                <option value="CLOSED">Closed</option>`;

content = content.replace(oldClosed, newClosed);

fs.writeFileSync('src/components/dashboard/CaseManagerModal.tsx', content);
