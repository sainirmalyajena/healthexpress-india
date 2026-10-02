require('dotenv').config({ path: '.env.local' });
const token = process.env.META_PAGE_ACCESS_TOKEN;

async function checkPages() {
  const res = await fetch('https://graph.facebook.com/v19.0/me/accounts?access_token=' + token);
  const data = await res.json();
  console.log("Pages accessible by Autobot token:");
  console.log(data);
}
checkPages();
