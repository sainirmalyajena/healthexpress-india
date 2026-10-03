const fs = require('fs');
const path = require('path');
const file = path.join('src', 'components', 'dashboard', 'CaseManagerModal.tsx');
let content = fs.readFileSync(file, 'utf8');

const replaceStr = '</select>\n' +
'                            {hospitalId && hospitals.find(h => h.id === hospitalId) && (\n' +
'                                <div className="mt-3 p-3 bg-teal-50 border border-teal-100 rounded-lg">\n' +
'                                    <h4 className="text-xs font-bold text-teal-800 uppercase mb-2">Hospital Pitch Details</h4>\n' +
'                                    {hospitals.find(h => h.id === hospitalId)?.doctors?.[0] && (\n' +
'                                        <div className="mb-1">\n' +
'                                            <span className="text-xs font-semibold text-slate-600">Doctor:</span>\n' +
'                                            <span className="ml-1 text-sm font-bold text-slate-900">{hospitals.find(h => h.id === hospitalId)?.doctors?.[0].name}</span>\n' +
'                                        </div>\n' +
'                                    )}\n' +
'                                    <div className="mb-1">\n' +
'                                        <span className="text-xs font-semibold text-slate-600">Location:</span>\n' +
'                                        <span className="ml-1 text-sm text-slate-800">{hospitals.find(h => h.id === hospitalId)?.city}</span>\n' +
'                                    </div>\n' +
'                                    {hospitals.find(h => h.id === hospitalId)?.doctors?.[0]?.about && (\n' +
'                                        <div className="mt-2 text-xs text-slate-600 italic">\n' +
'                                            "{hospitals.find(h => h.id === hospitalId)?.doctors?.[0].about}"\n' +
'                                        </div>\n' +
'                                    )}\n' +
'                                </div>\n' +
'                            )}\n' +
'                        </div>\n' +
'                    </div>\n' +
'\n' +
'                    {/* Assignment */}';

content = content.replace(/<\/select>\s*<\/div>\s*<\/div>\s*\{\/\*\s*Assignment\s*\*\/\}/, replaceStr);

fs.writeFileSync(file, content, 'utf8');
