require('dotenv').config({ path: '.env.local' });
const pageToken = 'EAAgEGMtlZAQwBSpgsSys7ZAApreIIS2YFcYjO2bIFovnZABHccl0QzvxCWLvLBdHSXRjtZAurE4dZBu4sWShcMKffDf1TqhILMwkkqlXpb7lAfu23kXVvbDR45eYWLxkFLIWsJnVn6L8B2RArqWXZC2ZBNZAGZBs2iGkOqDcDVRrF6uGUm8mruNHSqgdCZCzG7nKc2OorzryVD';
const pageId = '1271143726079245';

async function grantLeadsAccess() {
  console.log('Granting leads access to app...');
  const res = await fetch('https://graph.facebook.com/v19.0/' + pageId + '/leads_access_settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      permitted_tasks: ['MANAGE'],
      access_token: pageToken
    })
  });
  const data = await res.json();
  console.log(data);
}
grantLeadsAccess();
