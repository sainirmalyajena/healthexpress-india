const fs = require('fs');
const path = require('path');
const file = path.join('src', 'app', '[lang]', 'dashboard', 'hospitals', 'page.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /<p className="text-sm text-slate-500">\{hospital\.city\}<\/p>/;
const newHtml = `<p className="text-sm text-slate-500">{hospital.city}</p>
                                                        {hospital.address && (
                                                            <div className="mt-2 text-xs text-slate-600 bg-slate-100 p-2 rounded max-w-xs whitespace-pre-wrap">
                                                                <span className="font-semibold block mb-1">Address:</span>
                                                                {hospital.address}
                                                                {hospital.googleMapsUrl && (
                                                                    <a href={hospital.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block mt-1 text-teal-600 hover:underline font-medium">
                                                                        \uD83D\uDDFA\uFE0F View on Maps
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}`;

if (content.match(regex)) {
    content = content.replace(regex, newHtml);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Successfully updated the hospitals page UI.");
} else {
    console.log("Could not find the target html to replace.");
}
