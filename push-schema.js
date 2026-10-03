require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

try {
    console.log(execSync('npx prisma db push --accept-data-loss', { encoding: 'utf8', env: { ...process.env } }));
    console.log(execSync('npx prisma generate', { encoding: 'utf8', env: { ...process.env } }));
} catch (e) {
    console.error(e.stdout || e.message);
}
