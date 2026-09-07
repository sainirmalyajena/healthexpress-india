const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/CaseManagerModal.tsx', 'utf8');

// Change formatDateForInput to support datetime-local format if needed. 
// We'll create a new one: formatDateTimeForInput
const newFunc = `
    const formatDateTimeForInput = (dateObj?: Date | null) => {
        if (!dateObj) return '';
        const d = new Date(dateObj);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0,16);
    };
`;

content = content.replace(
    /const formatDateForInput = [^}]+};\s*/m,
    `$&${newFunc}`
);

// Now change `followUpDate` to use it
content = content.replace(
    /const \[followUpDate, setFollowUpDate\] = useState\(formatDateForInput\(lead\.followUpDate\)\);/,
    `const [followUpDate, setFollowUpDate] = useState(formatDateTimeForInput(lead.followUpDate));`
);

// Change input type="date" to type="datetime-local" for followUpDate
content = content.replace(
    /type="date"([\s\S]*?)value=\{followUpDate\}/m,
    `type="datetime-local"$1value={followUpDate}`
);

fs.writeFileSync('src/components/dashboard/CaseManagerModal.tsx', content);
