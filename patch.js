const fs = require('fs');
const file = 'src/app/[lang]/dashboard/leads/page.tsx';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(
    /const \[leads, total\] = await Promise\.all\(\[\s+prisma\.lead\.findMany\(\{[\s\S]*?\}\),\s+prisma\.lead\.count\(\{ where \}\)\s+\]\);/,
    `const leads = await prisma.lead.findMany({
        where,
        include: { surgery: true, hospital: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: ITEMS_PER_PAGE
    });
    const total = await prisma.lead.count({ where });`
);

code = code.replace(
    /const \[surgeries, hospitals, citiesData\] = await Promise\.all\(\[\s+prisma\.surgery\.findMany\(\{ select: \{ id: true, name: true \} \}\),\s+prisma\.hospital\.findMany\(\{ select: \{ id: true, name: true, discountPercent: true \} \}\),\s+prisma\.lead\.findMany\(\{\s+select: \{ city: true \},\s+distinct: \['city'\],\s+where: \{ city: \{ not: undefined \} \}\s+\}\)\s+\]\);/,
    `const surgeries = await prisma.surgery.findMany({ select: { id: true, name: true } });
    const hospitals = await prisma.hospital.findMany({ select: { id: true, name: true, discountPercent: true } });
    const citiesData = await prisma.lead.findMany({ select: { city: true }, distinct: ['city'], where: { city: { not: '' } } });`
);

fs.writeFileSync(file, code);
console.log('File patched successfully.');
