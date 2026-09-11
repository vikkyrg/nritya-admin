import React from 'react';
import { Upload, MoreVertical, Image as ImageIcon } from 'lucide-react';

const Gallery = () => {
  // Generate some mock images
  const images = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    url: `https://picsum.photos/seed/${i + 10}/800/600`,
    title: `Project Image ${i + 1}`,
    size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight mb-1">Media Gallery</h1>
          <p className="text-slate-400 text-sm">Manage your uploaded images and assets.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-purple-500/20 transition-all">
          <Upload size={18} />
          Upload Files
        </button>
      </div>

      {/* Filters/Tabs placeholder */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <button className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg text-sm font-medium border border-slate-700">All Media</button>
        <button className="px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-colors">Images</button>
        <button className="px-4 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg text-sm font-medium transition-colors">Documents</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group">
            <div className="aspect-video relative overflow-hidden bg-slate-800 flex items-center justify-center">
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors">
                  <ImageIcon size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 flex items-start justify-between">
              <div>
                <h4 className="text-sm font-medium text-slate-200 truncate pr-4">{image.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{image.size}</p>
              </div>
              <button className="text-slate-500 hover:text-slate-300 transition-colors p-1 -mr-1">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
