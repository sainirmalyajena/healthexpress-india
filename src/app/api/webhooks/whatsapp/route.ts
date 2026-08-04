import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateReferenceId } from '@/lib/utils';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'healthexpress_wa_token_2026';

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WhatsApp Webhook Verified!');
        return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Ensure this is a WhatsApp API event
        if (body.object !== 'whatsapp_business_account') {
            return new NextResponse('Not a WhatsApp Event', { status: 404 });
        }

        // Parse the message
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0]?.value;

        if (changes?.messages && changes.messages.length > 0) {
            const message = changes.messages[0];
            const contact = changes.contacts?.[0];
            
            const phoneNumber = message.from; // Sender's phone number
            const patientName = contact?.profile?.name || 'WhatsApp Patient';
            
            let messageText = '';
            if (message.type === 'text') {
                messageText = message.text.body;
            } else {
                messageText = `[Sent a ${message.type} message]`;
            }

            // Check if we already have a lead for this phone number today to prevent spam
            // But for simplicity in this implementation, we will just log it or append it.
            // A better way is to see if a Lead with this phone is NEW/CONTACTED.
            const existingLead = await prisma.lead.findFirst({
                where: {
                    phone: phoneNumber,
                    status: { in: ['NEW', 'CONTACTED'] }
                },
                orderBy: { createdAt: 'desc' }
            });

            if (existingLead) {
                // Append message to notes
                await prisma.lead.update({
                    where: { id: existingLead.id },
                    data: {
                        notes: existingLead.notes 
                            ? `${existingLead.notes}\n[WhatsApp Update]: ${messageText}`
                            : `[WhatsApp Update]: ${messageText}`
                    }
                });
                console.log(`Updated existing WhatsApp Lead: ${phoneNumber}`);
            } else {
                // Create a completely new lead in the CRM
                await prisma.lead.create({
                    data: {
                        fullName: patientName,
                        phone: phoneNumber,
                        city: 'WhatsApp',
                        description: messageText,
                        sourcePage: 'WhatsApp Cloud API',
                        status: 'NEW',
                        referenceId: generateReferenceId(),
                    }
                });
                console.log(`Created new WhatsApp Lead: ${phoneNumber}`);
            }
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        console.error('WhatsApp Webhook Error:', error);
        // Meta expects a 200 OK even if we fail, otherwise they will keep retrying and eventually disable the webhook
        return new NextResponse('Error but acknowledged', { status: 200 });
    }
}
