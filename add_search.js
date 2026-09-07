const fs = require('fs');

let content = fs.readFileSync('src/app/[lang]/dashboard/leads/page.tsx', 'utf8');

// 1. Add `query?: string;` to SearchParams
content = content.replace(
    /interface SearchParams \{/,
    `interface SearchParams {\n    query?: string;`
);

// 2. Add query to where clause
const queryLogic = `
    if (searchParams.query) {
        where.OR = [
            { phone: { contains: searchParams.query, mode: 'insensitive' } },
            { fullName: { contains: searchParams.query, mode: 'insensitive' } },
            { referenceId: { contains: searchParams.query, mode: 'insensitive' } }
        ];
    }
`;
content = content.replace(
    /if \(searchParams\.city\) \{/,
    `${queryLogic}\n    if (searchParams.city) {`
);

// 3. Update grid to md:grid-cols-6 or whatever fits. 
// It currently says grid-cols-1 md:grid-cols-5. 
content = content.replace(
    `className="grid grid-cols-1 md:grid-cols-5 gap-4"`,
    `className="grid grid-cols-1 lg:grid-cols-6 md:grid-cols-3 gap-4"`
);

// 4. Add the input element
const searchInputHTML = `
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Search</label>
                                <input
                                    type="text"
                                    name="query"
                                    placeholder="Phone, Name, or ID"
                                    defaultValue={searchParamsData.query || ''}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50"
                                />
                            </div>
`;
content = content.replace(
    /<form action=\{`\/\$\{lang\}\/dashboard\/leads`\} method="GET"[^>]*>/,
    `$&${searchInputHTML}`
);

fs.writeFileSync('src/app/[lang]/dashboard/leads/page.tsx', content);
