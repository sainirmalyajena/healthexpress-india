require('dotenv').config({ path: '.env.local' });
const pageToken = 'EAAgEGMtlZAQwBSpgsSys7ZAApreIIS2YFcYjO2bIFovnZABHccl0QzvxCWLvLBdHSXRjtZAurE4dZBu4sWShcMKffDf1TqhILMwkkqlXpb7lAfu23kXVvbDR45eYWLxkFLIWsJnVn6L8B2RArqWXZC2ZBNZAGZBs2iGkOqDcDVRrF6uGUm8mruNHSqgdCZCzG7nKc2OorzryVD';
const pageId = '1271143726079245';

async function subscribePage() {
  console.log('Subscribing page to webhook...');
  const res = await fetch('https://graph.facebook.com/v19.0/' + pageId + '/subscribed_apps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subscribed_fields: ['leadgen'],
      access_token: pageToken
    })
  });
  
  const data = await res.json();
  console.log(data);
}
subscribePage();
