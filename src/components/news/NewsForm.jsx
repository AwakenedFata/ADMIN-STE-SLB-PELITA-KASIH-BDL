'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HiSave, HiArrowLeft } from 'react-icons/hi';
import ImageUpload from '@/components/ui/ImageUpload';
import RichTextEditor from '@/components/ui/RichTextEditor';
import Switch from '@/components/ui/Switch';
import Link from 'next/link';

export default function NewsForm({ initialData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    thumbnail: initialData?.thumbnail || '',
    thumbnailPublicId: initialData?.thumbnailPublicId || '',
    category: initialData?.category || 'Berita',
    author: initialData?.author || 'Admin',
    published: initialData?.published ?? true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData ? `/api/news/${initialData._id}` : '/api/news';
      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/news');
        router.refresh();
      } else {
        alert('Failed to save news');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/news" className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <HiArrowLeft className="text-xl text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">
            {initialData ? 'Edit Berita' : 'Tambah Berita Baru'}
          </h1>
        </div>
        <button
          type="submit"
          disabled={loading || !formData.title || !formData.content}
          className="glass-button flex items-center gap-2 disabled:opacity-50"
        >
          <HiSave className="text-lg" />
          <span>{loading ? 'Menyimpan...' : 'Simpan Berita'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Judul Berita</label>
            <input
              type="text"
              required
              className="w-full glass-input text-lg font-semibold"
              placeholder="Masukkan judul berita..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Kutipan Singkat (Excerpt)</label>
            <textarea
              className="w-full glass-input h-24 resize-none"
              placeholder="Ringkasan singkat untuk tampilan kartu..."
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Konten Berita</label>
            <RichTextEditor
              value={formData.content}
              onChange={(val) => setFormData({ ...formData, content: val })}
              placeholder="Tulis konten berita di sini..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold text-slate-800 border-b pb-2">Pengaturan Publikasi</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Status Publikasi</span>
              <Switch
                checked={formData.published}
                onChange={(v) => setFormData({ ...formData, published: v })}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Kategori</label>
              <select
                className="w-full glass-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Berita">Berita</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Pengumuman">Pengumuman</option>
                <option value="Prestasi">Prestasi</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Penulis</label>
              <input
                type="text"
                className="w-full glass-input"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
          </div>

          <div className="glass-card p-6 space-y-4">
             <h3 className="font-semibold text-slate-800 border-b pb-2">Gambar Utama</h3>
             <ImageUpload
               label=""
               value={formData.thumbnail}
               onChange={(url, publicId) => setFormData({ ...formData, thumbnail: url, thumbnailPublicId: publicId })}
             />
          </div>
        </div>
      </div>
    </form>
  );
}
