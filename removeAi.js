const fs = require('fs');

function modifySettingsClient() {
    const path = 'src/components/dashboard/SettingsClient.tsx';
    let content = fs.readFileSync(path, 'utf8');

    const startString = '{/* 1. BLAND AI VOICE RECEPTIONIST */}';
    const startIndex = content.indexOf(startString);
    if (startIndex !== -1) {
        const endString = '{/* 2. RESEND EMAIL GATEWAY */}';
        const endIndex = content.indexOf(endString);
        if (endIndex !== -1) {
            const before = content.substring(0, startIndex);
            const after = content.substring(endIndex);
            const replacement = '{/* BLAND AI VOICE RECEPTIONIST (Temporarily Disabled per user request) */}\n                        ';
            content = before + replacement + after;
            fs.writeFileSync(path, content, 'utf8');
            console.log('Modified SettingsClient.tsx');
        }
    }
}

try {
    modifySettingsClient();
} catch (e) {
    console.error(e);
}
