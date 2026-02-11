'use client';

import { useState } from 'react';
import { HiCloudUpload, HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function ImageUpload({ 
  onChange, 
  value, 
  label = "Upload Image",
  className
}) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      // 1. Get Signature
      const signRes = await fetch('/api/upload', { method: 'POST' });
      const { timestamp, signature, apiKey, cloudName } = await signRes.json();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', 'slb-pelita-kasih');

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await uploadRes.json();
      
      if (data.secure_url) {
        onChange(data.secure_url, data.public_id);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onChange('', '');
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      
      <div className="relative">
        {value ? (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-200">
            <Image 
              src={value} 
              alt="Uploaded" 
              fill 
              className="object-cover"
            />
            <button
              onClick={handleRemove}
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
            >
              <HiX className="text-lg" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors relative">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {loading ? (
                <div className="h-10 w-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              ) : (
                <>
                  <HiCloudUpload className="w-10 h-10 mb-3 text-slate-400" />
                  <p className="mb-2 text-sm text-slate-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG, WebP (MAX. 5MB)</p>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleUpload}
              disabled={loading}
            />
          </label>
        )}
      </div>
    </div>
  );
}
