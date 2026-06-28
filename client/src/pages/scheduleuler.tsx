import { useState, useEffect } from 'react';
import { dummyPostsData, platforms } from '../assets/assets';
import { CalendarDaysIcon, ClockIcon, XIcon, ArrowRightIcon, Loader2Icon, SendIcon } from 'lucide-react';

export default function Scheduler() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setPosts(dummyPostsData);
    };
    fetchPosts();
    const interval = setInterval(() => { fetchPosts(); }, 10000);
    return () => clearInterval(interval);
  }, []);

  const scheduled = posts.filter(p => p.status === 'scheduled');
  const published = posts.filter(p => p.status === 'published');

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      setPosts([dummyPostsData, ...posts]);
      setContent('');
      setSelectedPlatforms([]);
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl">
      
      {/* Compose Panel */}
      <div className="w-full lg:w-[380px] shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">Compose Post</h2>
          <form onSubmit={handleSchedule} className="space-y-5">
            
            {/* Platforms */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 tracking-wider mb-2.5">PLATFORMS</label>
              <div className="flex flex-wrap gap-3">
                {platforms.map(p => (
                  <button 
                    type="button" 
                    key={p.id} 
                    onClick={() => togglePlatform(p.id)}
                    className={`size-10 flex items-center justify-center border rounded-xl transition-all cursor-pointer ${selectedPlatforms.includes(p.id) ? 'border-red-500 bg-red-50/50 text-red-500' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                  >
                    <p.icon className="size-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <div>
               <label className="block text-xs font-semibold text-slate-400 tracking-wider mb-2.5">CONTENT</label>
               <textarea 
                 required rows={5} 
                 placeholder="What do you want to share today?"
                 value={content}
                 onChange={(e) => setContent(e.target.value)}
                 className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-300 text-sm text-slate-800 placeholder-slate-400 resize-none"
               />
               <div className="text-right text-xs text-slate-400 mt-1">{content.length} / 280</div>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 tracking-wider mb-2.5">MEDIA (OPTIONAL)</label>
              {mediaFile ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 aspect-video flex items-center justify-center bg-slate-50">
                  {mediaFile.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(mediaFile)} alt="preview" className="max-h-full object-contain" />
                  ) : (
                    <video src={URL.createObjectURL(mediaFile)} controls className="max-h-full" />
                  )}
                  <button type="button" onClick={() => setMediaFile(null)} className="absolute top-2 right-2 p-1 bg-slate-900/65 hover:bg-slate-900/80 text-white rounded-full transition-all cursor-pointer"><XIcon className="size-4" /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer border border-dashed border-slate-200 rounded-xl py-8 px-4 text-center hover:bg-slate-50/50 transition-all text-slate-400 text-xs gap-1 h-32">
                  <span>Click to upload image or video</span>
                  <input 
                    type="file" accept="image/*,video/*" className="hidden"
                    onChange={(e) => e.target.files && setMediaFile(e.target.files[0])}
                  />
                </label>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
               <div className="relative flex items-center">
                 <CalendarDaysIcon className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
                 <input type="date" required value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-300 text-slate-600" />
               </div>
               <div className="relative flex items-center">
                 <ClockIcon className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
                 <input type="time" required value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-300 text-slate-600" />
               </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl text-sm font-semibold shadow-xs hover:shadow-md hover:shadow-red-100 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
               {loading ? (
                 <><Loader2Icon className="animate-spin size-4" /> Scheduling...</>
               ) : (
                 <>Schedule Post <ArrowRightIcon className="size-4" /></>
               )}
            </button>
          </form>
        </div>
      </div>

      {/* Queue Panels */}
      <div className="flex-1 w-full space-y-6">
        
        {/* Upcoming Posts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
           <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <CalendarDaysIcon className="size-5 text-slate-500" />
                <h3 className="text-sm font-bold">Upcoming</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{scheduled.length}</span>
           </div>
           {scheduled.length === 0 ? (
             <div className="text-sm text-slate-400 py-4 text-center">No posts scheduled yet</div>
           ) : (
             <div className="divide-y divide-slate-100">
               {scheduled.map(post => (
                  <div key={post._id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="text-slate-400 shrink-0 mt-1">
                      {(() => {
                        const platformId = post.platforms[0];
                        const meta = platforms.find(p => p.id === platformId);
                        return meta ? <meta.icon className="size-5 text-slate-400" /> : null;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {post.mediaUrl && (
                            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded">Image</span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{new Date(post.scheduledFor).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium line-clamp-2">{post.content}</p>
                    </div>
                  </div>
               ))}
             </div>
           )}
        </div>

        {/* Published Posts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
           <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <SendIcon className="size-4 text-slate-500" />
                <h3 className="text-sm font-bold">Published</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{published.length}</span>
           </div>
           {published.length === 0 ? (
             <div className="text-sm text-slate-400 py-4 text-center">No posts published yet</div>
           ) : (
             <div className="divide-y divide-slate-100">
               {published.map(post => (
                  <div key={post._id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="text-slate-400 shrink-0 mt-1">
                      {(() => {
                        const platformId = post.platforms[0];
                        const meta = platforms.find(p => p.id === platformId);
                        return meta ? <meta.icon className="size-5 text-slate-400" /> : null;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-400">{new Date(post.createdAt || post.scheduledFor).toLocaleString()}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded">Published</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium line-clamp-2">{post.content}</p>
                    </div>
                  </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}