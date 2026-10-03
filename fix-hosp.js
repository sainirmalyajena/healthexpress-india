const fs = require('fs');
const path = require('path');
const file = path.join('src', 'app', '[lang]', 'dashboard', 'hospitals', 'page.tsx');
let content = fs.readFileSync(file, 'utf8');

// Also fix the 🏥 emoji corruption I just saw
content = content.replace(/dY\?/g, '\uD83C\uDFE5'); 

content = content.replace('<AddHospitalModal />', '{session.role === "admin" && <AddHospitalModal />}');
fs.writeFileSync(file, content, 'utf8');
