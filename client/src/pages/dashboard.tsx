import { useState, useEffect } from 'react';
import { 
  ClockIcon, CheckCircleIcon, UsersIcon, TrendingUpIcon, ActivityIcon, SendIcon, 
  PlusIcon, UserPlusIcon, SparklesIcon, ThumbsUpIcon, MessageCircleIcon, 
  Share2Icon 
} from 'lucide-react';
import { useApp } from '../context/appcontext';
import { platforms } from '../assets/assets';

export default function Dashboard() {
  const [stats, setStats] = useState({ scheduled: 0, published: 0, connectedAccounts: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [upcomingPosts, setUpcomingPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState<'likes' | 'comments' | 'shares'>('likes');
  const { api, user } = useApp();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [postsRes, accountsRes, activityRes] = await Promise.all([
          api.get('/posts'),
          api.get('/accounts'),
          api.get('/activity')
        ]);

        const posts = postsRes.data || [];
        const accountsData = accountsRes.data || [];
        const activityData = activityRes.data || [];

        setStats({
          scheduled: posts.filter((p: any) => p.status === 'scheduled').length,
          published: posts.filter((p: any) => p.status === 'published').length,
          connectedAccounts: accountsData.length
        });
        
        setAccounts(accountsData);
        setActivities(activityData);

        // Sort and slice top 4 upcoming posts
        const scheduledPosts = posts
          .filter((p: any) => p.status === 'scheduled')
          .sort((a: any, b: any) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
          .slice(0, 4);
        setUpcomingPosts(scheduledPosts);
      } catch (error: any) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [api]);

  // Mock analytics data for the custom SVG chart
  const chartData = {
    likes: [18, 35, 24, 52, 41, 68, 85],
    comments: [4, 12, 8, 19, 15, 28, 32],
    shares: [2, 7, 5, 11, 9, 14, 21],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  const activeData = chartData[chartMetric];
  const maxVal = Math.max(...activeData) * 1.2 || 100;

  // Convert data points to SVG path coordinates (Width: 500, Height: 150)
  const points = activeData.map((val, i) => {
    const x = (i / (activeData.length - 1)) * 500;
    const y = 150 - (val / maxVal) * 130;
    return { x, y };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1]!.x} 150 L 0 150 Z` 
    : '';

  const aiSuggestions = [
    {
      topic: "🚀 Product Launch Announcement",
      prompt: "Write a high-energy post announcing the launch of our new software dashboard, highlighting its speed and beautiful UI. Include excited tone."
    },
    {
      topic: "💡 Monday Motivation for Developers",
      prompt: "Share a motivational quote and tip for developers starting their week, focusing on debugging and persistence. Informative tone."
    },
    {
      topic: "🌱 Sustainable Eco-Friendly Branding",
      prompt: "Discuss the importance of eco-friendly practices in modern business branding and how companies can start small. Creative tone."
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-semibold text-slate-850">Good morning, {user?.name || 'User'}! 👋</h2>
          <p className="text-sm text-slate-500">Here's what's happening with your social accounts today.</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-3 shrink-0">
          <a 
            href="/scheduler" 
            className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <PlusIcon className="size-4" /> Create Post
          </a>
          <a 
            href="/accounts" 
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-xs transition-all cursor-pointer"
          >
            <UserPlusIcon className="size-4 text-slate-505" /> Connect Account
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Scheduled Posts', value: stats.scheduled, icon: ClockIcon, trend: 'Active' },
          { label: 'Published Posts', value: stats.published, icon: CheckCircleIcon, trend: 'All time' },
          { label: 'Connected Accounts', value: stats.connectedAccounts, icon: UsersIcon, trend: 'Linked' }
        ].map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between h-32">
            <div className="flex items-baseline justify-between">
              <div className="text-4xl font-semibold text-slate-800">{card.value}</div>
              <div className="flex items-center gap-1 text-xs font-medium text-red-500">
                <TrendingUpIcon className="size-4" /> {card.trend}
              </div>
            </div>
            <p className="text-sm font-medium text-slate-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Left Widgets & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (Wide) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Post Performance Analytics Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Post Performance</h3>
                <p className="text-xs text-slate-400 mt-0.5">Track engagement trends over the last 7 days</p>
              </div>
              
              {/* Metric Selector Tabs */}
              <div className="flex bg-slate-50 p-0.5 rounded-lg border border-slate-200 self-start">
                {[
                  { id: 'likes', label: 'Likes', icon: ThumbsUpIcon },
                  { id: 'comments', label: 'Comments', icon: MessageCircleIcon },
                  { id: 'shares', label: 'Shares', icon: Share2Icon }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setChartMetric(m.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${chartMetric === m.id ? 'bg-white text-red-500 shadow-xs' : 'text-slate-450 hover:text-slate-650'}`}
                  >
                    <m.icon className="size-3.5" />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Area */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {/* Stats values */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Weekly Total</span>
                  <span className="text-3xl font-bold text-slate-800">
                    {activeData.reduce((a, b) => a + b, 0)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-600 font-semibold">+14.2%</span>
                  <span className="text-slate-400">vs last week</span>
                </div>
              </div>

              {/* Custom SVG Line Chart */}
              <div className="md:col-span-3 h-40 relative">
                <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  {Array.from({ length: 4 }).map((_, idx) => {
                    const y = 10 + idx * 43;
                    return (
                      <line 
                        key={idx} x1="0" y1={y} x2="500" y2={y} 
                        stroke="#F1F5F9" strokeDasharray="4 4" strokeWidth="1" 
                      />
                    );
                  })}

                  {/* Area Under the Line */}
                  <path d={areaPath} fill="url(#chart-area-grad)" />

                  {/* Line */}
                  <path d={linePath} fill="none" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Data Points */}
                  {points.map((p, idx) => (
                    <g key={idx} className="group/point">
                      <circle 
                        cx={p.x} cy={p.y} r="4" 
                        fill="#white" stroke="#EF4444" strokeWidth="2" 
                        className="transition-all duration-200 group-hover/point:r-6 cursor-pointer"
                      />
                      <circle 
                        cx={p.x} cy={p.y} r="10" 
                        fill="transparent" 
                        className="cursor-pointer"
                      />
                    </g>
                  ))}
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 px-1">
                  {chartData.labels.map(l => <span key={l}>{l}</span>)}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-slate-800">Recent Activity</h2>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{activities.length} events</span>
            </div>
            
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <ActivityIcon className="size-12 mb-2 text-slate-300" />
                <p className="font-medium">No activity yet</p>
                <p className="text-sm text-slate-400">Connect accounts and schedule posts to see events here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activities.map((activity) => (
                  <div key={activity._id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="size-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                      <SendIcon className="size-4" />
                    </div>
                    <div className="flex-1 flex items-center justify-between min-w-0">
                      <div className="flex flex-col gap-1">
                         <span className="inline-flex items-center w-fit px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-600">Published</span>
                         <p className="text-sm text-slate-700 font-medium truncate">{activity.description}</p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{new Date(activity.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Sidebar Widgets) */}
        <div className="space-y-8">
          
          {/* Connected Profiles List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Connected Profiles</h3>
              <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{accounts.length} linked</span>
            </div>
            
            {accounts.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-xl">
                No accounts connected. <a href="/accounts" className="text-red-500 font-semibold hover:underline">Link one now</a>
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map(acc => {
                  const platformName = acc.platform ? acc.platform.toLowerCase().replace(/\s+page|\s+business/g, '') : '';
                  const platformMeta = platforms.find(p => p.id === platformName);
                  return (
                    <div key={acc._id} className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar / Placeholder */}
                        <div className="relative">
                          <div className="size-9 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {(acc.name || 'Account').charAt(0).toUpperCase()}
                          </div>
                          {/* Pulsing Active Dot */}
                          <span className="absolute bottom-0 right-0 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-800 truncate">{acc.name || 'Connected Account'}</div>
                          <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1 mt-0.5">
                            {platformMeta && <platformMeta.icon className="size-3 text-slate-400 shrink-0" />}
                            {acc.platform || 'Social Profile'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Posts Queue Preview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Upcoming Queue</h3>
              <a href="/scheduler" className="text-[10px] font-bold text-red-500 hover:underline">View All</a>
            </div>

            {upcomingPosts.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6 border border-dashed border-slate-200 rounded-xl">
                No upcoming scheduled posts.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingPosts.map(post => {
                  const platformId = post.platforms && post.platforms[0] ? post.platforms[0] : '';
                  const platformMeta = platforms.find(p => p.id === platformId);
                  return (
                    <div key={post._id} className="p-3 border border-slate-100 rounded-xl space-y-2 hover:border-slate-200 transition-all">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {platformMeta && <platformMeta.icon className="size-3.5 text-slate-400 shrink-0" />}
                          <span className="text-[9px] font-bold text-slate-400 truncate">
                            {new Date(post.scheduledFor).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-normal break-words">
                        {post.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Content Suggestions Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-4 text-red-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-800">AI Suggestions</h3>
            </div>
            <p className="text-xs text-slate-400">Select a trending topic to draft it instantly in the AI Composer</p>
            
            <div className="space-y-2.5">
              {aiSuggestions.map((s, idx) => (
                <a 
                  key={idx}
                  href={`/ai-composer?prompt=${encodeURIComponent(s.prompt)}`}
                  className="block p-3 bg-slate-50/50 border border-slate-100 hover:border-red-200 hover:bg-red-50/5 rounded-xl text-left transition-all cursor-pointer group"
                >
                  <span className="text-xs font-bold text-slate-700 block group-hover:text-red-500 transition-all">{s.topic}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mt-1 block">{s.prompt}</span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}