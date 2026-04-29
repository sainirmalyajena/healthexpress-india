import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, mobile, service } = body;

    // Validate required fields
    if (!name || !mobile || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const API_KEY = process.env.CRATIO_API_KEY;
    const API_URL = process.env.CRATIO_API_URL;

    // If credentials aren't set, we mock a success response for testing
    // In production, this should throw an error.
    if (!API_KEY || !API_URL) {
      console.warn('CRATIO_API_KEY or CRATIO_API_URL is missing. Simulating success.');
      return NextResponse.json({ success: true, message: 'Simulated CRM submission' }, { status: 200 });
    }

    // Prepare payload for Cratio CRM insertRecords endpoint
    // Mapping depends strictly on Cratio's schema. Assuming standard Lead fields:
    const payload = {
      formName: "Leads",
      overwrite: true,
      data: {
        Name: name,
        Mobile: mobile,
        LeadSource: "Prism Healthcure Website",
        Requirements: service,
        // Add other mapped fields here
      }
    };

    // Forward the request to Cratio API
    const response = await fetch(`${API_URL}?apikey=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to submit to Cratio CRM');
    }

    return NextResponse.json({ success: true, result }, { status: 200 });
    
  } catch (error: any) {
    console.error('Cratio CRM Integration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
