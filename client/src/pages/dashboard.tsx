import { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon, UsersIcon, TrendingUpIcon, ActivityIcon, SendIcon } from 'lucide-react';
import { dummyPostsData, dummyAccountsData, dummyActivityData } from '../assets/assets';

export default function Dashboard() {
  const [stats, setStats] = useState({ scheduled: 0, published: 0, connectedAccounts: 0 });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const posts = dummyPostsData;
        const accounts = dummyAccountsData;
        const activityData = dummyActivityData;

        setStats({
          scheduled: posts.filter((p: any) => p.status === 'scheduled').length,
          published: posts.filter((p: any) => p.status === 'published').length,
          connectedAccounts: accounts.filter((a: any) => a.status === 'connected').length
        });
        setActivities(activityData);
      } catch (error: any) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Scheduled Posts', value: stats.scheduled, icon: ClockIcon, trend: '+2 today' },
    { label: 'Published Posts', value: stats.published, icon: CheckCircleIcon, trend: 'All time' },
    { label: 'Connected Accounts', value: stats.connectedAccounts, icon: UsersIcon, trend: 'Active' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="space-y-1">
        <h2 className="text-3xl font-semibold text-slate-800">Good morning! 👋</h2>
        <p className="text-sm text-slate-500">Here's what's happening with your social accounts today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card) => (
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

      {/* Activity Feed */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
          <span className="text-xs font-medium text-slate-400">{activities.length} events</span>
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
                     <span className="inline-flex items-center w-fit px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">Published</span>
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
  );
}