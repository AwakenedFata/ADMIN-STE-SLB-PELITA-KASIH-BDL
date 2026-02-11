import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const body = await request.json();
        const message = await Message.findByIdAndUpdate(id, body, { new: true });

        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        return NextResponse.json(message);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await dbConnect();
    const { id } = await params;

    try {
        const message = await Message.findByIdAndDelete(id);

        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Message deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
