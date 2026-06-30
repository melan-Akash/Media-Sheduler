import { useState, useEffect } from 'react';
import { platforms } from '../assets/assets';
import { HistoryIcon, Loader2Icon, XIcon, CalendarDaysIcon, ClockIcon, TimerIcon, ArrowRightIcon, Trash2Icon } from 'lucide-react';
import { useApp } from '../context/appcontext';
import { toast } from 'react-hot-toast';

const tones = ['Professional', 'Creative', 'Funny', 'Sarcastic', 'Informative'];

export default function AIComposer() {
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Professional');
  const [generateImage, setGenerateImage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);
  const [latestGeneration, setLatestGeneration] = useState<any | null>(null);
  
  // Scheduling States
  const [activeScheduler, setActiveScheduler] = useState<any>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const { api } = useApp();

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const fetchGenerations = async () => {
    try {
      const res = await api.get('/posts/generations');
      setGenerations(res.data || []);
    } catch (error: any) {
      console.error("Failed to fetch generations", error);
    }
  };

  const handleDeleteGeneration = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this generation?");
    if (!confirm) return;
    try {
      await api.delete(`/posts/generations/${id}`);
      toast.success("Generation deleted successfully");
      fetchGenerations();
      if (latestGeneration && latestGeneration._id === id) {
        setLatestGeneration(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to delete generation");
    }
  };

  useEffect(() => {
    fetchGenerations();
    
    // Parse query parameters
    const params = new URLSearchParams(window.location.search);
    const promptParam = params.get('prompt');
    if (promptParam) {
      setPrompt(promptParam);
    }
  }, [api]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setLoading(true);
    toast.loading("Generating content...", { id: "generate" });
    try {
      const res = await api.post('/posts/generate', {
        prompt,
        tone,
        generateImage
      });
      toast.success("Content generated successfully!", { id: "generate" });
      setPrompt('');
      setLatestGeneration(res.data);
      fetchGenerations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to generate content", { id: "generate" });
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one social channel");
      return;
    }
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please select a date and time");
      return;
    }

    setScheduling(true);
    try {
      const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      
      await api.post('/posts', {
        content: activeScheduler.content,
        platforms: selectedPlatforms,
        scheduledFor,
        mediaUrl: activeScheduler.mediaUrl || undefined,
        mediaType: activeScheduler.mediaUrl ? 'image' : undefined
      });

      toast.success("Post scheduled successfully!");
      setActiveScheduler(null);
      setSelectedPlatforms([]);
      setScheduledDate('');
      setScheduledTime('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to schedule post");
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      
      {/* Input Section */}
      <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-slate-800">What should we create today?</h1>
        <div id="tour-composer-input" className="w-full bg-white border border-slate-200 rounded-2xl p-4 focus-within:border-slate-300 shadow-xs transition-all relative">
          <textarea 
            placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none pb-16"
          />
          
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between flex-wrap gap-3">
             <div className="flex items-center gap-3 flex-wrap">
                 <button onClick={() => setGenerateImage(!generateImage)} className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-55 hover:bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200 transition-all cursor-pointer shrink-0">
                    <span>AI Image</span>
                    <div className={`w-8 h-4.5 rounded-full relative transition-all ${generateImage ? 'bg-red-500' : 'bg-slate-200'}`}>
                       <span className={`absolute top-0.5 size-3.5 bg-white rounded-full transition-all ${generateImage ? 'left-4' : 'left-0.5'}`} />
                    </div>
                 </button>

                 <div className="h-4 w-[1px] bg-slate-200 hidden md:block shrink-0" />

                 {/* Tone Selector */}
                 <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-full border border-slate-200 overflow-x-auto">
                    {tones.map(t => (
                      <button 
                        key={t} onClick={() => setTone(t)}
                        className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer shrink-0 ${tone === t ? 'bg-red-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        {t}
                      </button>
                    ))}
                 </div>
             </div>

             <button onClick={handleGenerate} disabled={loading} className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer disabled:opacity-60 shrink-0">
                {loading ? (
                   <><Loader2Icon className="animate-spin size-4" /> Generating...</>
                ) : (
                   <>Generate <ArrowRightIcon className="size-4" /></>
                )}
             </button>
          </div>
        </div>
      </div>

      {/* Latest Generation Preview Section */}
      {latestGeneration && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-850 flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
              Latest Generation Preview
            </h2>
            <button 
              onClick={() => setLatestGeneration(null)}
              className="p-1 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            >
              <XIcon className="size-4.5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Content Text */}
            <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{latestGeneration.content}</p>

            {/* Separated Hashtags Box */}
            {latestGeneration.hashtags && latestGeneration.hashtags.length > 0 && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider block">AUTO-GENERATED HASHTAGS</span>
                <div className="flex flex-wrap gap-2">
                  {latestGeneration.hashtags.map((h: string) => (
                    <span 
                      key={h} 
                      onClick={() => {
                        navigator.clipboard.writeText(`#${h}`);
                        toast.success(`Copied: #${h}`);
                      }}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100/60 text-red-600 text-xs font-semibold rounded-full border border-red-100 transition-all cursor-pointer"
                      title="Click to copy hashtag"
                    >
                      #{h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* AI Image Generation Preview */}
            {latestGeneration.mediaUrl && (
              <div className="relative overflow-hidden rounded-xl border border-slate-100 aspect-video flex items-center justify-center bg-slate-50 max-h-80 group">
                <img 
                  src={latestGeneration.mediaUrl} 
                  alt="AI Generated Preview" 
                  className="max-h-full max-w-full object-contain group-hover:scale-[1.01] transition-all duration-300" 
                />
              </div>
            )}

            {/* Action Area */}
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => {
                  setActiveScheduler(latestGeneration);
                  setSelectedPlatforms([]);
                }}
                className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                <TimerIcon className="size-4" /> Schedule Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Generated Posts List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2 text-slate-800 font-semibold">
             <HistoryIcon className="size-5 text-slate-500" />
             <h2 className="text-sm font-bold">Recent Generations</h2>
           </div>
           <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{generations.length} total</span>
        </div>
        
        {generations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <HistoryIcon className="size-12 mb-2 text-slate-300" />
            <p className="font-medium">No content generated yet</p>
            <p className="text-sm text-slate-400">Try generating some content using the AI above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {generations.map(gen => (
               <div key={gen._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
                  <div className="flex flex-col h-full space-y-3">
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">{new Date(gen.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                           <span className="px-2 py-0.5 bg-red-55/10 text-red-500 rounded font-semibold text-[10px]">{gen.tone}</span>
                           <button 
                             onClick={() => handleDeleteGeneration(gen._id)}
                             className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                             title="Delete generation"
                           >
                             <Trash2Icon className="size-3.5" />
                           </button>
                        </div>
                     </div>
                     <p className="text-sm text-slate-600 font-medium line-clamp-4 leading-relaxed">{gen.content}</p>
                     
                     {gen.hashtags && gen.hashtags.length > 0 && (
                       <div className="flex flex-wrap gap-1.5 pt-0.5">
                         {gen.hashtags.map((h: string) => (
                           <span key={h} className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded font-medium">
                             #{h}
                           </span>
                         ))}
                       </div>
                     )}
                     
                     {gen.mediaUrl && (
                       <div className="overflow-hidden rounded-xl border border-slate-100 aspect-video bg-slate-50 shrink-0">
                         <img src={gen.mediaUrl} alt="gen" className="w-full h-full object-cover" />
                       </div>
                     )}

                     <button onClick={() => setActiveScheduler(gen)} className="w-full mt-auto flex items-center justify-center bg-slate-50 hover:bg-slate-100/80 text-slate-700 py-2 rounded-xl text-xs font-semibold border border-slate-100 transition-all cursor-pointer">
                        Schedule Post
                     </button>
                  </div>
               </div>
            ))}
          </div>
        )}
      </div>

      {/* Scheduler Modal */}
      {activeScheduler && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                 <h3 className="text-base font-semibold text-slate-800">Schedule Generation</h3>
                 <button className="p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-700 rounded-lg transition-all cursor-pointer" onClick={() => setActiveScheduler(null)}>
                    <XIcon className="size-4" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                 {/* Preview */}
                 <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                   <strong>Prompt:</strong> {activeScheduler.prompt}
                 </div>
                 <div className="text-sm text-slate-600 font-medium leading-relaxed">
                   {activeScheduler.content}
                 </div>
                 {activeScheduler.mediaUrl && (
                   <div className="overflow-hidden rounded-xl border border-slate-100 aspect-video bg-slate-50 shrink-0">
                     <img src={activeScheduler.mediaUrl} alt="preview" className="w-full h-full object-cover" />
                   </div>
                 )}

                 {/* Options */}
                 <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-400 tracking-wider">Select Channels</label>
                    <div className="flex gap-3">
                       {platforms.map(p => (
                         <button 
                           type="button" 
                           key={p.id} 
                           onClick={() => togglePlatform(p.id)}
                           className={`p-2.5 border rounded-xl transition-all cursor-pointer ${selectedPlatforms.includes(p.id) ? 'border-red-500 bg-red-50/50 text-red-500' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                         >
                           <p.icon className="size-5" />
                         </button>
                       ))}
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="relative flex items-center">
                      <CalendarDaysIcon className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
                      <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-300 text-slate-600" />
                    </div>
                    <div className="relative flex items-center">
                      <ClockIcon className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
                      <input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-300 text-slate-600" />
                    </div>
                 </div>

                 <button onClick={handleSchedule} className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl text-sm font-semibold shadow-xs hover:shadow-md hover:shadow-red-100 transition-all cursor-pointer disabled:opacity-60 shrink-0 mt-2">
                    {scheduling ? (
                      <><Loader2Icon className="animate-spin size-4" /> Scheduling...</>
                    ) : (
                      <><TimerIcon className="size-4" /> Schedule Post</>
                    )}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}