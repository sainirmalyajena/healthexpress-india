const fs = require('fs');
let utils = fs.readFileSync('src/lib/utils.ts', 'utf8');
utils = utils.replace(/QUALIFIED: 'bg-green-100 text-green-800',/, "FOLLOW_UP: 'bg-orange-100 text-orange-800',\n        CALL_BACK: 'bg-purple-100 text-purple-800',\n        DNP: 'bg-red-100 text-red-800',");
fs.writeFileSync('src/lib/utils.ts', utils, 'utf8');
console.log('Fixed utils');
