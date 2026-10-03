const fs = require('fs');
const path = require('path');
const file = path.join('src', 'app', '[lang]', 'dashboard', 'doctors', 'page.tsx');
if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/dY'/g, '\uD83D\uDC68\u200D\u2695\uFE0F');
    content = content.replace('<AddDoctorModal />', '{session.role === "admin" && <AddDoctorModal />}');
    fs.writeFileSync(file, content, 'utf8');
}
