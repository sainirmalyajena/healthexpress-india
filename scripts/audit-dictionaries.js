const fs = require('fs');
const path = require('path');

const enPath = path.join(__dirname, '../src/dictionaries/en.json');
const hiPath = path.join(__dirname, '../src/dictionaries/hi.json');

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

function getKeys(obj, prefix = '') {
    return Object.keys(obj).reduce((res, el) => {
        if (Array.isArray(obj[el])) {
            return res.concat(prefix + el);
        } else if (typeof obj[el] === 'object' && obj[el] !== null) {
            return res.concat(getKeys(obj[el], prefix + el + '.'));
        }
        return res.concat(prefix + el);
    }, []);
}

const enKeys = getKeys(en);
const hiKeys = getKeys(hi);

const missingInHi = enKeys.filter(key => !hiKeys.includes(key));
const missingInEn = hiKeys.filter(key => !enKeys.includes(key));

console.log('--- Missing in Hindi (hi.json) ---');
missingInHi.forEach(k => console.log(k));

console.log('\n--- Missing in English (en.json) ---');
missingInEn.forEach(k => console.log(k));

if (missingInHi.length === 0 && missingInEn.length === 0) {
    console.log('\nDictionaries are perfectly in sync!');
}
