import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

        // Save to Supabase waitlist table
        const { data, error } = await supabase
            .from('waitlist')
            .insert({ email, created_at: new Date().toISOString() })
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: 'Failed to join waitlist' },
                { status: 500 }
            );
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
