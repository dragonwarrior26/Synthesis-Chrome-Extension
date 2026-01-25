import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // 1. Save to Supabase
        const { data, error } = await supabase
            .from('waitlist')
            .insert({ email, created_at: new Date().toISOString() })
            .select();

        if (error) {
            console.error('Supabase error:', error);
            // Even if Supabase fails (e.g. duplicate email), we might want to handle it gracefully
            // But usually we return error. For uniqueness constraint, we can return 409.
            if (error.code === '23505') { // Unique violation
                return NextResponse.json(
                    { message: 'You are already on the waitlist!' },
                    { status: 200 } // Treat as success for UX
                );
            }
            return NextResponse.json(
                { error: 'Failed to join waitlist' },
                { status: 500 }
            );
        }

        // 2. Send Welcome Email via Resend
        try {
            await resend.emails.send({
                from: 'Synthesis <support@synthesisext.com>',
                to: email,
                subject: 'Welcome to Synthesis Waitlist',
                react: WelcomeEmail({ email }),
            });
            console.log('Welcome email sent to:', email);
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // We don't fail the request if email fails, as the user is already in DB
        }

        return NextResponse.json(
            { message: 'Success', data },
            { status: 200 }
        );
    } catch (error) {
        console.error('Waitlist API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
