const fs = require('fs');
let content = fs.readFileSync('src/app/[lang]/dashboard/leads/page.tsx', 'utf8');

// Remove the quick stats banner UI from leads page
content = content.replace(/\{\/\* Quick Stats Banner \*\/\}[\s\S]*?(?=\{\/\* Filters \*\/)/, '');
// Keep the backend `quickFilter` logic since the dashboard will redirect here!

fs.writeFileSync('src/app/[lang]/dashboard/leads/page.tsx', content);
