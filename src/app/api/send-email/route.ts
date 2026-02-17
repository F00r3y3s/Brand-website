import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Email service is not configured (missing RESEND_API_KEY).' },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { type, data } = body;

        let subject = 'New Website Inquiry';
        let html = '';

        if (type === 'inquiry') {
            subject = `Service Inquiry: ${data.selectedService}`;
            html = `
        <h2>New Service Inquiry</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Organization:</strong> ${data.organization}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.contactNumber || 'N/A'}</p>
        <p><strong>LinkedIn:</strong> ${data.linkedin || 'N/A'}</p>
        <p><strong>Service:</strong> ${data.selectedService}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `;
        } else if (type === 'newsletter') {
            subject = 'New Newsletter Subscription';
            html = `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${data.email}</p>
      `;
        } else if (type === 'contact') {
            subject = 'General Contact Form Submission';
            html = `
        <h2>General Contact Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `;
        }

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Ainar Web <onboarding@resend.dev>',
                to: ['saqib.sahili@gmail.com'],
                subject: subject,
                html: html,
            }),
        });

        if (!resendResponse.ok) {
            let errorPayload: unknown = 'Failed to send email.';
            try {
                errorPayload = await resendResponse.json();
            } catch {
                errorPayload = await resendResponse.text();
            }
            return NextResponse.json({ error: errorPayload }, { status: resendResponse.status });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
