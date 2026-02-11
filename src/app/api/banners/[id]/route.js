import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function PUT(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const body = await request.json();
        const banner = await Banner.findByIdAndUpdate(id, body, { new: true });

        if (!banner) {
            return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
        }

        return NextResponse.json(banner);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const banner = await Banner.findByIdAndDelete(id);

        if (!banner) {
            return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Banner deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
    }
}
