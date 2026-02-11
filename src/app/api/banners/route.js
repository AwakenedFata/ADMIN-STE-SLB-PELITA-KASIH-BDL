import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { getServerSession } from 'next-auth';
import { handler } from '../auth/[...nextauth]/route'; // Import auth options via handler (Workaround for internal use, usually separate authOptions)

// Note: To use getServerSession easily in App Router, we usually extract authOptions to a separate file (e.g. lib/auth.js). 
// For now, I'll rely on the handler if it exports authOptions or similar, BUT app/api route exports handler which is NextAuth() result.
// It's better to verify session on client side mostly or use a simple check here if needed.
// Middleware already protects this route if it matches /api/banners.

// Correction: Middleware matchers exclude /api/* by default logic in my config above?
// NO: "/((?!api/auth|_next/static|_next/image|favicon.ico).*)".
// This regex matches everything EXCEPT api/auth... meaning /api/banners IS protected by middleware.
// So I don't strictly need to check session inside here if middleware is working correctly.

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log('API /api/banners GET hit');
    await dbConnect();
    try {
        console.log('DB connected, finding banners...');
        const banners = await Banner.find({}).sort({ order: 1, createdAt: -1 });
        console.log(`Found ${banners.length} banners`);
        return NextResponse.json(banners);
    } catch (error) {
        console.error('Error in /api/banners:', error);
        return NextResponse.json({ error: 'Failed to fetch banners', details: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const banner = await Banner.create(body);
        return NextResponse.json(banner, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
    }
}
