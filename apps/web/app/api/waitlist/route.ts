import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { email } = body;

    if (!email) {
        return NextResponse.json(
            { error: 'Email is required' },
            { status: 400 }
        );
    }

    // TODO: Connect to Supabase
    // await supabase.from('waitlist').insert({ email });
    console.log('Mock Waitlist Submission:', email);

    return NextResponse.json(
        { message: 'Success' },
        { status: 200 }
    );
}
