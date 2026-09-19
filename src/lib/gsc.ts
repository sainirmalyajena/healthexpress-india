import { google, searchconsole_v1 } from 'googleapis';

const gsc = google.searchconsole('v1');

export async function getGscData(siteUrl: string, startDate: string, endDate: string) {
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        console.warn('GSC credentials missing. Using mock data.');
        return generateMockGscData();
    }

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    try {
        const response = await gsc.searchanalytics.query({
            auth,
            siteUrl,
            requestBody: {
                startDate,
                endDate,
                dimensions: ['query', 'page', 'country', 'device'],
                rowLimit: 5000,
            },
        });

        return response.data.rows || [];
    } catch (error) {
        console.error('GSC Error:', error);
        return generateMockGscData();
    }
}

function generateMockGscData(): searchconsole_v1.Schema$ApiDataRow[] {
    return [
        { keys: ['healthexpress', 'https://healthexpressindia.com/', 'IND', 'MOBILE'], clicks: 150, impressions: 450, ctr: 0.33, position: 1.2 },
        { keys: ['health express india', 'https://healthexpressindia.com/', 'IND', 'DESKTOP'], clicks: 80, impressions: 200, ctr: 0.40, position: 1.5 },
        { keys: ['best eye hospital in mumbai', 'https://healthexpressindia.com/en/surgeries/cataract-surgery', 'IND', 'MOBILE'], clicks: 45, impressions: 800, ctr: 0.05, position: 5.6 },
        { keys: ['lasik surgery cost in delhi', 'https://healthexpressindia.com/en/surgeries/lasik-surgery', 'IND', 'MOBILE'], clicks: 12, impressions: 600, ctr: 0.02, position: 12.4 },
        { keys: ['knee replacement recovery time', 'https://healthexpressindia.com/en/surgeries/total-knee-replacement', 'IND', 'DESKTOP'], clicks: 5, impressions: 300, ctr: 0.016, position: 22.1 },
        { keys: ['best surgeon for hernia', 'https://healthexpressindia.com/en/surgeries/hernia-repair', 'IND', 'MOBILE'], clicks: 20, impressions: 400, ctr: 0.05, position: 8.9 },
        { keys: ['cataract surgery insurance cover', 'https://healthexpressindia.com/en/surgeries/cataract-surgery', 'IND', 'MOBILE'], clicks: 8, impressions: 150, ctr: 0.05, position: 15.2 },
        { keys: ['gallbladder stone removal cost', 'https://healthexpressindia.com/', 'IND', 'MOBILE'], clicks: 0, impressions: 400, ctr: 0, position: 45.3 },
        { keys: ['lasik eye surgery', 'https://healthexpressindia.com/en/surgeries/lasik-surgery', 'IND', 'MOBILE'], clicks: 30, impressions: 500, ctr: 0.06, position: 6.2 },
        { keys: ['lasik eye surgery', 'https://healthexpressindia.com/en/surgeries/smile-eye-surgery', 'IND', 'MOBILE'], clicks: 5, impressions: 200, ctr: 0.025, position: 14.5 },
    ];
}
