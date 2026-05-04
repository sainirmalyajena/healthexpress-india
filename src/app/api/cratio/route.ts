import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Category } from '@/generated/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, mobile, service } = body;

    // Validate required fields
    if (!name || !mobile || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // --- Redundancy: Save to Local Database (Prisma) ---
    try {
      // Find a matching surgery or default to Ophthalmology
      let surgery = await prisma.surgery.findFirst({
        where: {
          OR: [
            { name: { contains: service, mode: 'insensitive' } },
            { category: Category.OPHTHALMOLOGY }
          ]
        }
      });

      // If no surgery exists at all, we might need a fallback logic
      // For now, we only create lead if surgery exists to satisfy schema
      if (surgery) {
        await prisma.lead.create({
          data: {
            fullName: name,
            phone: mobile,
            description: `Prism Appointment: ${service}`,
            city: 'Unknown', // From Prism form, city is not currently captured
            surgeryId: surgery.id,
            sourcePage: 'Prism Landing Page',
            referenceId: `PRISM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            status: 'NEW'
          }
        });
      }
    } catch (dbError) {
      console.error('Failed to save Prism lead to local DB:', dbError);
      // We don't block the CRM submission if local DB fails
    }

    // --- CRM Integration: Cratio ---
    const API_KEY = process.env.CRATIO_API_KEY;
    const API_URL = process.env.CRATIO_API_URL;

    if (!API_KEY || !API_URL) {
      console.warn('CRATIO_API_KEY or CRATIO_API_URL is missing. Simulating success.');
      return NextResponse.json({ 
        success: true, 
        message: 'Simulated CRM submission (Redundant DB save attempted)' 
      }, { status: 200 });
    }

    const payload = {
      formName: "Leads",
      overwrite: true,
      data: {
        Name: name,
        Mobile: mobile,
        LeadSource: "Prism Healthcure Website",
        Requirements: service,
      }
    };

    const response = await fetch(`${API_URL}?apikey=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
