import { useState, useEffect } from 'react';
import { platforms } from '../assets/assets';
import { 
  CalendarDaysIcon, ClockIcon, XIcon, ArrowRightIcon, Loader2Icon, SendIcon, Trash2Icon,
  CloudUploadIcon, HeartIcon, MessageCircleIcon, Share2Icon, BookmarkIcon, ThumbsUpIcon, 
  GlobeIcon, MoreHorizontalIcon, ListIcon, CalendarIcon 
} from 'lucide-react';
import { useApp } from '../context/appcontext';
import { toast } from 'react-hot-toast';

export default function Scheduler() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState<'twitter' | 'facebook' | 'instagram'>('twitter');
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const { api } = useApp();

  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const getPostsForDay = (date: Date) => {
    return scheduled.filter(post => {
      const postDate = new Date(post.scheduledFor);
      return postDate.getDate() === date.getDate() &&
             postDate.getMonth() === date.getMonth() &&
             postDate.getFullYear() === date.getFullYear();
    });
  };

  const getCharacterLimit = () => {
    if (selectedPlatforms.includes('twitter')) return 280;
    if (selectedPlatforms.includes('instagram')) return 2200;
    if (selectedPlatforms.includes('linkedin')) return 3000;
    return 5000;
  };

  const charLimit = getCharacterLimit();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setMediaFile(e.dataTransfer.files[0]);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const confirm = window.confirm("Are you sure you want to delete this scheduled post?");
    if (!confirm) return;
    try {
      await api.delete(`/posts/${postId}`);
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to delete post");
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data || []);
    } catch (error: any) {
      console.error("Failed to fetch posts", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(() => { fetchPosts(); }, 10000);
    return () => clearInterval(interval);
  }, [api]);

  const scheduled = posts.filter(p => p.status === 'scheduled');
  const published = posts.filter(p => p.status === 'published');

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one social channel");
      return;
    }

    setLoading(true);
    try {
      const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      
      const formData = new FormData();
      formData.append('content', content);
      formData.append('platforms', JSON.stringify(selectedPlatforms));
      formData.append('scheduledFor', scheduledFor);
      if (mediaFile) {
        formData.append('media', mediaFile);
      }

      await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Post scheduled successfully!");
      setContent('');
      setSelectedPlatforms([]);
      setScheduledDate('');
      setScheduledTime('');
      setMediaFile(null);
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to schedule post");
    } finally {
      setLoading(false);
    }
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
                 className={`w-full p-4 border rounded-xl focus:outline-none text-sm text-slate-800 placeholder-slate-400 resize-none ${content.length > charLimit ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-slate-300'}`}
               />
               <div className={`text-right text-xs mt-1 font-semibold ${content.length > charLimit ? 'text-red-500' : 'text-slate-400'}`}>
                 {content.length} / {charLimit}
               </div>
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
                <label 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center cursor-pointer border-2 border-dashed rounded-xl py-6 px-4 text-center transition-all text-slate-400 text-xs gap-1.5 h-32 hover:bg-slate-50/50 ${isDragging ? 'border-red-500 bg-red-50/10' : 'border-slate-200'}`}
                >
                  <CloudUploadIcon className={`size-7 transition-all ${isDragging ? 'text-red-500 animate-bounce' : 'text-slate-300'}`} />
                  <span>Drag & drop media here, or <span className="text-red-500 font-medium">browse</span></span>
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
        
        {/* Social Media Live Preview Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-5">
           <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <GlobeIcon className="size-4 text-slate-550" />
                Social Media Live Preview
              </h3>
              
              {/* Tabs */}
              <div className="flex bg-slate-50 p-0.5 rounded-lg border border-slate-200">
                {(['twitter', 'facebook', 'instagram'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPreviewPlatform(p)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-md capitalize transition-all cursor-pointer ${previewPlatform === p ? 'bg-white text-red-500 shadow-xs' : 'text-slate-450 hover:text-slate-650'}`}
                  >
                    {p === 'twitter' ? 'X / Twitter' : p}
                  </button>
                ))}
              </div>
           </div>

           {/* Mockup Container */}
           <div className="bg-slate-50/30 p-4 rounded-xl border border-slate-100 flex justify-center">
              {previewPlatform === 'twitter' && (
                <div className="bg-white border border-slate-200 rounded-xl p-4 w-full max-w-md text-slate-850 text-sm font-sans shadow-xs">
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="size-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold shrink-0">
                      U
                    </div>
                    {/* Tweet Body */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 truncate">Your Name</span>
                        <span className="text-slate-400 text-xs truncate">@yourhandle · 1m</span>
                      </div>
                      <p className="text-slate-800 whitespace-pre-wrap leading-normal break-words">{content || "What's happening? (Type in the compose box to preview)"}</p>
                      
                      {mediaFile && (
                        <div className="overflow-hidden rounded-xl border border-slate-200 aspect-video bg-slate-55 flex items-center justify-center">
                          {mediaFile.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(mediaFile)} alt="preview" className="max-h-full max-w-full object-contain" />
                          ) : (
                            <video src={URL.createObjectURL(mediaFile)} className="max-h-full" />
                          )}
                        </div>
                      )}
                      
                      {/* Twitter Action Icons */}
                      <div className="flex justify-between text-slate-400 pt-1.5 max-w-md">
                        <MessageCircleIcon className="size-4 hover:text-sky-500 cursor-pointer" />
                        <Share2Icon className="size-4 hover:text-emerald-500 cursor-pointer" />
                        <HeartIcon className="size-4 hover:text-pink-500 cursor-pointer" />
                        <BookmarkIcon className="size-4 hover:text-sky-500 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewPlatform === 'facebook' && (
                <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md text-slate-850 text-sm font-sans shadow-xs overflow-hidden">
                  {/* Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="size-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                        U
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Your Page</div>
                        <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                          1m · <GlobeIcon className="size-3" />
                        </div>
                      </div>
                    </div>
                    <button type="button" className="text-slate-400 hover:text-slate-600"><MoreHorizontalIcon className="size-5" /></button>
                  </div>

                  {/* Body */}
                  <div className="px-4 pb-3 space-y-3">
                    <p className="text-slate-800 whitespace-pre-wrap leading-normal break-words">{content || "Write something to preview your Facebook post..."}</p>
                  </div>

                  {/* Media */}
                  {mediaFile && (
                    <div className="border-t border-b border-slate-100 bg-slate-55 flex items-center justify-center aspect-video max-h-80 overflow-hidden">
                      {mediaFile.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(mediaFile)} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <video src={URL.createObjectURL(mediaFile)} controls className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}

                  {/* Facebook Actions */}
                  <div className="px-4 py-2 border-t border-slate-100 flex justify-between text-slate-500 font-semibold text-xs">
                    <button type="button" className="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded-md cursor-pointer"><ThumbsUpIcon className="size-4 text-slate-450" /> Like</button>
                    <button type="button" className="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded-md cursor-pointer"><MessageCircleIcon className="size-4 text-slate-450" /> Comment</button>
                    <button type="button" className="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded-md cursor-pointer"><Share2Icon className="size-4 text-slate-450" /> Share</button>
                  </div>
                </div>
              )}

              {previewPlatform === 'instagram' && (
                <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md text-slate-850 text-sm font-sans shadow-xs overflow-hidden">
                  {/* Header */}
                  <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
                    <div className="flex gap-3 items-center">
                      <div className="size-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">
                        U
                      </div>
                      <span className="font-bold text-slate-900 text-xs">your_username</span>
                    </div>
                    <button type="button" className="text-slate-400 hover:text-slate-600"><MoreHorizontalIcon className="size-4" /></button>
                  </div>

                  {/* Media */}
                  <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                    {mediaFile ? (
                      mediaFile.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(mediaFile)} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <video src={URL.createObjectURL(mediaFile)} controls className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="text-slate-400 text-xs text-center p-6 flex flex-col items-center gap-2">
                        <CloudUploadIcon className="size-8 text-slate-300" />
                        <span>Upload an image or video to preview on Instagram</span>
                      </div>
                    )}
                  </div>

                  {/* Instagram Actions */}
                  <div className="p-3.5 space-y-2.5">
                    <div className="flex justify-between items-center text-slate-800">
                      <div className="flex gap-4">
                        <HeartIcon className="size-5 hover:text-red-500 cursor-pointer" />
                        <MessageCircleIcon className="size-5 hover:scale-105 cursor-pointer" />
                        <Share2Icon className="size-5 hover:scale-105 cursor-pointer" />
                      </div>
                      <BookmarkIcon className="size-5 hover:scale-105 cursor-pointer" />
                    </div>
                    
                    {/* Caption */}
                    <p className="text-xs leading-normal break-words">
                      <span className="font-bold text-slate-900 mr-1.5">your_username</span>
                      <span className="text-slate-600 whitespace-pre-wrap">{content || "Your caption here..."}</span>
                    </p>
                  </div>
                </div>
              )}
           </div>
        </div>

        {/* Upcoming Posts */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
           <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-2 text-slate-800 font-semibold">
                <CalendarDaysIcon className="size-5 text-slate-500" />
                <h3 className="text-sm font-bold">Upcoming</h3>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{scheduled.length}</span>
              </div>
              
              {/* View Toggle */}
              <div className="flex bg-slate-50 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white text-red-500 shadow-xs' : 'text-slate-400 hover:text-slate-650'}`}
                  title="List View"
                >
                  <ListIcon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('calendar')}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${viewMode === 'calendar' ? 'bg-white text-red-500 shadow-xs' : 'text-slate-400 hover:text-slate-650'}`}
                  title="Calendar Grid View"
                >
                  <CalendarIcon className="size-4" />
                </button>
              </div>
           </div>

           {scheduled.length === 0 ? (
             <div className="text-sm text-slate-400 py-4 text-center">No posts scheduled yet</div>
           ) : viewMode === 'list' ? (
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
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400">{new Date(post.scheduledFor).toLocaleString()}</span>
                          <button 
                            onClick={() => handleDeletePost(post._id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                            title="Delete post"
                          >
                            <Trash2Icon className="size-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 font-medium line-clamp-2">{post.content}</p>
                    </div>
                  </div>
               ))}
             </div>
           ) : (
             /* Calendar View - 7 Day Grid */
             <div className="grid grid-cols-1 md:grid-cols-7 gap-3 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/20 p-2">
               {getNext7Days().map((day, i) => {
                 const dayPosts = getPostsForDay(day);
                 const isToday = i === 0;
                 return (
                   <div key={i} className={`flex flex-col min-w-0 bg-white border rounded-xl p-2.5 min-h-[180px] transition-all ${isToday ? 'border-red-200 ring-1 ring-red-100/50' : 'border-slate-100'}`}>
                     {/* Day Header */}
                     <div className="text-center pb-2 border-b border-slate-100/60 mb-2 shrink-0">
                       <span className={`text-[10px] font-bold tracking-wider block ${isToday ? 'text-red-500' : 'text-slate-400'}`}>
                         {day.toLocaleDateString('en-US', { weekday: 'short' })}
                       </span>
                       <span className={`inline-flex items-center justify-center size-5 text-xs font-bold rounded-full ${isToday ? 'bg-red-500 text-white' : 'text-slate-700'}`}>
                         {day.getDate()}
                       </span>
                     </div>
                     
                     {/* Day Posts */}
                     <div className="flex-1 overflow-y-auto space-y-2 max-h-[250px] scrollbar-none">
                       {dayPosts.length === 0 ? (
                         <span className="text-[10px] text-slate-300 text-center block pt-4">No posts</span>
                       ) : (
                         dayPosts.map(post => (
                           <div key={post._id} className="bg-slate-55 hover:bg-slate-100/70 border border-slate-100/50 rounded-lg p-2 space-y-1.5 relative group transition-all">
                             <div className="flex items-center justify-between gap-1.5">
                               {/* Platform & Time */}
                               <div className="flex items-center gap-1 min-w-0">
                                 {(() => {
                                   const platformId = post.platforms[0];
                                   const meta = platforms.find(p => p.id === platformId);
                                   return meta ? <meta.icon className="size-3 text-slate-500 shrink-0" /> : null;
                                 })()}
                                 <span className="text-[9px] font-bold text-slate-500 truncate">
                                   {new Date(post.scheduledFor).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                 </span>
                               </div>
                               
                               {/* Delete Button */}
                               <button
                                 type="button"
                                 onClick={() => handleDeletePost(post._id)}
                                 className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-500 rounded transition-all cursor-pointer shrink-0"
                                 title="Delete"
                               >
                                 <Trash2Icon className="size-3" />
                               </button>
                             </div>
                             
                             {/* Content Snippet */}
                             <p className="text-[10px] text-slate-600 font-medium line-clamp-2 leading-tight break-words">
                               {post.content}
                             </p>
                             
                             {/* Thumbnail */}
                             {post.mediaUrl && (
                               <div className="relative rounded overflow-hidden aspect-video bg-slate-200 max-h-12 border border-slate-100 flex items-center justify-center shrink-0">
                                 <img src={post.mediaUrl} alt="thumbnail" className="w-full h-full object-cover" />
                               </div>
                             )}
                           </div>
                         ))
                       )}
                     </div>
                   </div>
                 );
               })}
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