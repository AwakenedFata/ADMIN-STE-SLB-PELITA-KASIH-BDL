import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import { getServerSession } from 'next-auth';

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    try {
        const query = {};
        if (published === 'true') query.published = true;

        // Sort by createdAt desc
        const news = await News.find(query).sort({ createdAt: -1 });
        return NextResponse.json(news);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const body = await request.json();

        // Auto-generate slug if not provided/modified
        let slug = body.slug || slugify(body.title);

        // Check for duplicate slug
        let existing = await News.findOne({ slug });
        let counter = 1;
        while (existing) {
            slug = `${slugify(body.title)}-${counter}`;
            existing = await News.findOne({ slug });
            counter++;
        }

        const newsItem = await News.create({ ...body, slug });
        return NextResponse.json(newsItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
    }
}
