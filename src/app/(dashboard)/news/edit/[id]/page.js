import NewsForm from '@/components/news/NewsForm';
import dbConnect from '@/lib/mongodb';
import News from '@/models/News';
import { notFound } from 'next/navigation';

async function getNews(id) {
    try {
        await dbConnect();
        const news = await News.findById(id).lean();
        if (!news) return null;
        return JSON.parse(JSON.stringify(news)); // Serialize for client component
    } catch (error) {
        return null;
    }
}

export default async function EditNewsPage({ params }) {
    const { id } = await params;
    const news = await getNews(id);

    if (!news) {
        notFound();
    }

    return <NewsForm initialData={news} />;
}
