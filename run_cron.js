require('dotenv').config();
const { GET } = require('./.next/server/app/api/cron/seo-sync/route.js');

async function test() {
    const mockReq = new Request('http://localhost:3000/api/cron/seo-sync');
    const res = await GET(mockReq);
    console.log(await res.json());
}
test();
