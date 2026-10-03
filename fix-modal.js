const fs = require('fs');
const path = require('path');
const file = path.join('src', 'components', 'dashboard', 'CaseManagerModal.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Update Hospital interface
content = content.replace('interface Hospital {', 'interface Hospital {\n    city?: string;\n    doctors?: { name: string, about: string }[];');

// 2. Insert the hospital info card
const replaceStr = '</select>' +
'                            {hospitalId && hospitals.find(h => h.id === hospitalId) && (' +
'                                <div className="mt-3 p-3 bg-teal-50 border border-teal-100 rounded-lg">' +
'                                    <h4 className="text-xs font-bold text-teal-800 uppercase mb-2">Hospital Pitch Details</h4>' +
'                                    {hospitals.find(h => h.id === hospitalId)?.doctors?.[0] && (' +
'                                        <div className="mb-1">' +
'                                            <span className="text-xs font-semibold text-slate-600">Doctor:</span>' +
'                                            <span className="ml-1 text-sm font-bold text-slate-900">{hospitals.find(h => h.id === hospitalId)?.doctors?.[0].name}</span>' +
'                                        </div>' +
'                                    )}' +
'                                    <div className="mb-1">' +
'                                        <span className="text-xs font-semibold text-slate-600">Location:</span>' +
'                                        <span className="ml-1 text-sm text-slate-800">{hospitals.find(h => h.id === hospitalId)?.city}</span>' +
'                                    </div>' +
'                                    {hospitals.find(h => h.id === hospitalId)?.doctors?.[0]?.about && (' +
'                                        <div className="mt-2 text-xs text-slate-600 italic">' +
'                                            "{hospitals.find(h => h.id === hospitalId)?.doctors?.[0].about}"' +
'                                        </div>' +
'                                    )}' +
'                                </div>' +
'                            )}';

content = content.replace('</select>', replaceStr);

fs.writeFileSync(file, content, 'utf8');
