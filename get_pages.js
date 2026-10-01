require('dotenv').config({ path: '.env.local' });
const token = process.env.META_PAGE_ACCESS_TOKEN;

async function getPages() {
  const res = await fetch('https://graph.facebook.com/v19.0/me/accounts?access_token=' + token);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
getPages();
