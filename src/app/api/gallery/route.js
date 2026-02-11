import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    try {
        const query = {};
        if (category && category !== 'All') query.category = category;

        const items = await Gallery.find(query).sort({ createdAt: -1 });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();
        const item = await Gallery.create(body);
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add gallery item' }, { status: 500 });
    }
}
