import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function POST(request) {
    await dbConnect();

    try {
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
        }

        await Banner.deleteMany({ _id: { $in: ids } });

        return NextResponse.json({ message: 'Banners deleted successfully' });
    } catch (error) {
        console.error('Bulk delete error:', error);
        return NextResponse.json({ error: 'Failed to delete banners' }, { status: 500 });
    }
}
