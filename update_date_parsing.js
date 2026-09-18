const fs = require('fs');
const file = 'src/app/api/admin/leads/import/route.ts';
let content = fs.readFileSync(file, 'utf8');

const oldParse = `            // Parse created_time if available
            let createdAtDate = undefined;
            if (row.created_time || row.Date) {
                const parsedDate = new Date(row.created_time || row.Date);
                if (!isNaN(parsedDate.getTime())) {
                    createdAtDate = parsedDate;
                }
            }`;

const newParse = `            // Parse created_time if available
            let createdAtDate = undefined;
            const rawDate = row.created_time || row.Date || row.created_at || row.createdAt || row.Timestamp || row['Created At'] || row['Date Created'] || row['Submission Date'] || row['date'] || row['time'];
            
            if (rawDate) {
                let parsedDate = new Date(rawDate);
                
                // If invalid date, try DD/MM/YYYY or DD-MM-YYYY fallback
                if (isNaN(parsedDate.getTime()) && typeof rawDate === 'string') {
                    // Try replacing spaces with 'T' (e.g. 2024-09-11 14:00:00 -> 2024-09-11T14:00:00)
                    let cleanStr = rawDate.trim().replace(' ', 'T');
                    parsedDate = new Date(cleanStr);
                    
                    if (isNaN(parsedDate.getTime())) {
                        const parts = rawDate.split(/[\s/:-]/);
                        if (parts.length >= 3) {
                            // Assume DD/MM/YYYY or MM/DD/YYYY based on values
                            const p0 = parseInt(parts[0], 10);
                            const p1 = parseInt(parts[1], 10);
                            const p2 = parseInt(parts[2], 10);
                            
                            if (p2 > 2000) { // DD/MM/YYYY or MM/DD/YYYY
                                const m = p1 > 12 ? p0 : p1;
                                const d = p1 > 12 ? p1 : p0;
                                parsedDate = new Date(`${p2}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}T${parts[3] || '00'}:${parts[4] || '00'}:00`);
                            }
                        }
                    }
                }
                
                if (!isNaN(parsedDate.getTime())) {
                    createdAtDate = parsedDate;
                }
            }`;

content = content.replace(oldParse, newParse);
fs.writeFileSync(file, content);
