require('dotenv').config({ path: '.env.local' });
const token = process.env.META_PAGE_ACCESS_TOKEN;

async function checkToken() {
  const res = await fetch('https://graph.facebook.com/v19.0/debug_token?input_token=' + token + '&access_token=' + token);
  const data = await res.json();
  console.log(data);
}
checkToken();
