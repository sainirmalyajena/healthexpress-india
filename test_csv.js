require('dotenv').config({ path: '.env.local' });
const Papa = require('papaparse');
const fs = require('fs');

const text = "id"\t"created_time"\t"ad_id"\t"ad_name"\t"adset_id"\t"adset_name"\t"campaign_id"\t"campaign_name"\t"form_id"\t"form_name"\t"is_organic"\t"platform"\t"which_centre_would_you_prefer?"\t"do_you_have_health_insurance?"\t"are_you_looking_for_lasik_surgery"\t"full_name"\t"phone_number"\t"city"\n"l:1104709795248728"\t"2026-10-02T15:48:56+05:30"\t"ag:52524681724174"\t"New Engagement Ad"\t"as:52524681723774"\t"New Engagement Ad Set"\t"c:52524681723974"\t"New Campaign Video"\t"f:1010420755350301"\t"LASIK Special Offer – Consultation new-copy"\t"false"\t"fb"\t"kalyan"\t"no"\t"yes"\t"saddam husain mohmmad Habib tagala"\t"p:+919022877826"\t"bhiwandi";

const cleanText = text.replace(/^"/gm, '').replace(/"\s*$/gm, '');
const result = Papa.parse(cleanText, { header: true, skipEmptyLines: true });
console.log(result.data[0]);
