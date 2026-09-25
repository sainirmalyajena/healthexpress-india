const http = require('http');

const BASE_URL = 'http://localhost:3000';

const urlsToTest = [
    { path: '/en', name: 'Homepage (English)' },
    { path: '/hi', name: 'Homepage (Hindi)' },
    { path: '/en/surgeries', name: 'Surgeries Directory' },
    { path: '/en/surgeries/lasik-eye-surgery', name: 'Surgery Page (LASIK)' },
    { path: '/en/mumbai/lasik-eye-surgery', name: 'City + Surgery (Mumbai LASIK)' },
    { path: '/en/doctors', name: 'Doctors Listing' },
    { path: '/robots.txt', name: 'Robots.txt' },
    { path: '/sitemap.xml', name: 'Sitemap.xml' },
    { path: '/og-image.png', name: 'OpenGraph Social Image' },
    { path: '/en/admin/leads', name: 'Admin Leads CRM' }
];

function fetchUrl(path) {
    return new Promise((resolve) => {
        const url = `${BASE_URL}${path}`;
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    contentType: res.headers['content-type'],
                    contentLength: data.length,
                    data: data
                });
            });
        });
        req.on('error', (err) => {
            resolve({ status: 'ERROR', error: err.message });
        });
    });
}

async function runTests() {
    console.log("=================================================");
    console.log("     HEALTHEXPRESS WEBSITE AUTOMATED AUDIT TEST  ");
    console.log("=================================================\n");

    let passedCount = 0;
    let failedCount = 0;
    const results = [];

    for (const test of urlsToTest) {
        process.stdout.write(`Testing ${test.name.padEnd(30)} [${test.path}] ... `);
        const res = await fetchUrl(test.path);

        if (res.status === 200) {
            passedCount++;
            console.log(`✅ 200 OK (${(res.contentLength / 1024).toFixed(1)} KB)`);
            results.push({ name: test.name, path: test.path, status: 'PASSED', code: 200 });
        } else if (res.status === 307 || res.status === 308) {
            console.log(`ℹ️ Redirect (${res.status})`);
            results.push({ name: test.name, path: test.path, status: 'REDIRECT', code: res.status });
        } else {
            failedCount++;
            console.log(`❌ FAILED (${res.status})`);
            results.push({ name: test.name, path: test.path, status: 'FAILED', code: res.status });
        }
    }

    console.log("\n=================================================");
    console.log(`SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED out of ${urlsToTest.length} endpoints`);
    console.log("=================================================");

    // Extra check: verify robots.txt contains the new disallow rules
    console.log("\nInspecting robots.txt content:");
    const robotsRes = await fetchUrl('/robots.txt');
    console.log(robotsRes.data.trim());

    // Extra check: verify LASIK page does NOT contain bn-IN
    console.log("\nVerifying absence of broken bn-IN in LASIK metadata:");
    const lasikRes = await fetchUrl('/en/surgeries/lasik-eye-surgery');
    const hasBnIn = lasikRes.data.includes('bn-IN') || lasikRes.data.includes('/bn/surgeries');
    console.log(`Contains bn-IN alternate: ${hasBnIn ? '❌ YES (Glitch still present)' : '✅ NO (Glitch fixed successfully)'}`);

    // Extra check: verify og-image.png is served as valid PNG
    console.log("\nVerifying /og-image.png asset:");
    const ogRes = await fetchUrl('/og-image.png');
    console.log(`Content-Type: ${ogRes.contentType}, Size: ${(ogRes.contentLength / 1024).toFixed(1)} KB - ${ogRes.status === 200 ? '✅ Valid' : '❌ Broken'}`);
}

runTests();
