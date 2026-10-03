const fs = require('fs');
const path = require('path');
const file = path.join('src', 'components', 'dashboard', 'CaseManagerModal.tsx');
let content = fs.readFileSync(file, 'utf8');

// Find the pitch box div and remove it
const startTag = '<div className="mt-3 p-3 bg-teal-50 rounded-lg border border-teal-100">';
const startIndex = content.indexOf(startTag);
if (startIndex !== -1) {
    let endIndex = startIndex;
    let openDivs = 0;
    let found = false;
    
    // Simple tag counting
    for (let i = startIndex; i < content.length - 5; i++) {
        if (content.substr(i, 4) === '<div') {
            openDivs++;
            found = true;
        } else if (content.substr(i, 5) === '</div') {
            openDivs--;
        }
        
        if (found && openDivs === 0) {
            endIndex = i + 6; // include </div>
            break;
        }
    }
    
    // We also need to remove the condition wrapping it
    // {selectedHospital && pitchData && ( ... )}
    const beforeStr = content.substring(0, startIndex);
    const braceStart = beforeStr.lastIndexOf('{selectedHospital && pitchData && (');
    
    if (braceStart !== -1) {
        content = content.substring(0, braceStart) + content.substring(endIndex);
        // Clean up the closing brace and paren if it exists
        const remainingStr = content.substring(braceStart);
        content = content.substring(0, braceStart) + remainingStr.replace(/^\s*\)\}\s*/, '');
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log("Pitch box removed.");
} else {
    console.log("Pitch box not found.");
}
