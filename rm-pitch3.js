const fs = require('fs');
const path = require('path');
const file = path.join('src', 'components', 'dashboard', 'CaseManagerModal.tsx');
let content = fs.readFileSync(file, 'utf8');

const strToRemove = `{hospitalId && hospitals.find(h => h.id === hospitalId) && (
                                  <div className="mt-3 p-3 bg-teal-50 border border-teal-100 rounded-lg">
                                      <h4 className="text-xs font-bold text-teal-800 uppercase mb-2">Hospital Pitch Details</h4>
                                      {hospitals.find(h => h.id === hospitalId)?.doctors?.[0] && (
                                          <div className="mb-1">
                                              <span className="text-xs font-semibold text-slate-600">Doctor:</span>
                                              <span className="ml-1 text-sm font-bold text-slate-900">{hospitals.find(h => h.id === hospitalId)?.doctors?.[0].name}</span>
                                          </div>
                                      )}
                                      <div className="mb-1">
                                          <span className="text-xs font-semibold text-slate-600">Location:</span>
                                          <span className="ml-1 text-sm text-slate-800">{hospitals.find(h => h.id === hospitalId)?.city}</span>
                                      </div>
                                      {hospitals.find(h => h.id === hospitalId)?.doctors?.[0]?.about && (
                                          <div className="mt-2 text-xs text-slate-600 italic">
                                              "{hospitals.find(h => h.id === hospitalId)?.doctors?.[0]?.about}"
                                          </div>
                                      )}
                                  </div>
                              )}`;

if (content.includes(strToRemove)) {
    content = content.replace(strToRemove, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log("Removed exact string match");
} else {
    // let's try a regex that is more robust
    const startIndex = content.indexOf('{hospitalId && hospitals.find(h => h.id === hospitalId) && (');
    if (startIndex !== -1) {
        let openBraces = 0;
        let endIndex = -1;
        for (let i = startIndex; i < content.length; i++) {
            if (content[i] === '{') openBraces++;
            if (content[i] === '}') {
                openBraces--;
                if (openBraces === 0) {
                    endIndex = i + 1;
                    break;
                }
            }
        }
        if (endIndex !== -1) {
            content = content.substring(0, startIndex) + content.substring(endIndex);
            fs.writeFileSync(file, content, 'utf8');
            console.log("Removed using brace counting");
        }
    } else {
        console.log("Could not find start");
    }
}
