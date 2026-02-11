import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SchoolProfile from '@/models/SchoolProfile';

export async function GET(request) {
    await dbConnect();
    try {
        let profile = await SchoolProfile.findOne({});
        if (!profile) {
            // Create default if not exists
            profile = await SchoolProfile.create({
                name: 'SLB Pelita Kasih',
                vision: 'Menjadi sekolah luar biasa yang unggul...',
            });
        }
        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();

        // Upsert: update the first document found, or create new if empty
        // But since GET creates default, we likely have one.

        // We can use findOneAndUpdate with upsert
        const profile = await SchoolProfile.findOneAndUpdate({}, body, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        });

        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
