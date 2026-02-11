import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import News from '@/models/News';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const news = await News.findById(id);
        if (!news) return NextResponse.json({ error: 'News not found' }, { status: 404 });
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const body = await request.json();

        // Allow slug update but ensure uniqueness if changed
        const news = await News.findByIdAndUpdate(id, body, { new: true });

        if (!news) {
            return NextResponse.json({ error: 'News not found' }, { status: 404 });
        }

        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const news = await News.findByIdAndDelete(id);

        if (!news) {
            return NextResponse.json({ error: 'News not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'News deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
    }
}
