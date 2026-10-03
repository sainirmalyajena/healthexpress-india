const fs = require('fs');
const path = require('path');
const file = path.join('prisma', 'schema.prisma');
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('address         String?')) {
    content = content.replace(
        'city            String', 
        'city            String\n  address         String?\n  googleMapsUrl   String?'
    );
    fs.writeFileSync(file, content, 'utf8');
    console.log("Schema updated with address and googleMapsUrl.");
} else {
    console.log("Schema already has address field.");
}
