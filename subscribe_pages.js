require('dotenv').config({ path: '.env.local' });
const token = process.env.META_PAGE_ACCESS_TOKEN;

async function setupWebhooks() {
  const res = await fetch('https://graph.facebook.com/v19.0/me/accounts?access_token=' + token);
  const data = await res.json();
  
  if (!data.data || data.data.length === 0) {
    console.log('No pages found for this token.', data);
    return;
  }

  for (const page of data.data) {
    console.log('Found Page:', page.name, page.id);
    const subscribeRes = await fetch('https://graph.facebook.com/v19.0/' + page.id + '/subscribed_apps?subscribed_fields=leadgen&access_token=' + page.access_token, {
      method: 'POST'
    });
    const subData = await subscribeRes.json();
    console.log('Subscribe Response for', page.name, ':', subData);
  }
}
setupWebhooks();
