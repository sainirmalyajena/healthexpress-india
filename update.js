const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/TeamAnalytics.tsx', 'utf8');

content = content.replace(import { useState } from 'react';, import { useState, useEffect } from 'react';\nimport { useRouter } from 'next/navigation';);

content = content.replace(
    export default function TeamAnalytics({ team, activityFeed }: TeamAnalyticsProps) {,
    export default function TeamAnalytics({ team, activityFeed }: TeamAnalyticsProps) {\n    const router = useRouter();\n    useEffect(() => {\n        const interval = setInterval(() => { router.refresh(); }, 15000);\n        return () => clearInterval(interval);\n    }, [router]);
);

fs.writeFileSync('src/components/dashboard/TeamAnalytics.tsx', content);
