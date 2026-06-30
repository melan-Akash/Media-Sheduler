import { useState, useEffect } from 'react';
import { PlusIcon, SparklesIcon, HelpCircleIcon } from 'lucide-react';
import AccountList from '../components/accountlist';
import PlatformPickerModel from '../components/ppm';
import { platforms } from '../assets/assets';
import { useApp } from '../context/appcontext';
import { toast } from 'react-hot-toast';

export default function Accounts() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const { api } = useApp();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hasOAuthCallback = searchParams.has('connected') || searchParams.has('accountId');

    const fetchAccounts = async () => {
      setLoading(true);
      try {
        if (hasOAuthCallback) {
          toast.loading("Syncing connected account...", { id: "sync" });
          await api.get('/auth/sync');
          toast.success("Account connected successfully!", { id: "sync" });
          // Clean the URL query params
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        const res = await api.get('/accounts');
        const mapped = (res.data || []).map((acc: any) => ({
          id: acc._id,
          platform: acc.platform.toLowerCase().replace(/\s+page|\s+business/g, ''),
          handle: acc.handle,
          status: acc.status || 'connected'
        }));
        setAccounts(mapped);
      } catch (error: any) {
        toast.error(error.message || "Failed to load accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [api]);

  const handleDisconnect = async (accountId: string) => {
    try {
      await api.delete(`/accounts/${accountId}`);
      setAccounts(accounts.filter((a) => a.id !== accountId));
      toast.success("Account disconnected successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to disconnect account");
    }
  };

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    try {
      const res = await api.get(`/auth/${platformId}/url`);
      const { authUrl } = res.data;
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error("Could not retrieve connection URL");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate connection");
      setConnecting(null);
    }
  };

  const connectedIds = accounts.map((a) => a.platform);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Connected Accounts</h2>
          <p className="text-sm text-slate-400 font-medium">{accounts.length} of {platforms.length} platforms connected</p>
        </div>
        <button 
          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-xs transition-all cursor-pointer"
          onClick={() => setShowPlatformPicker(true)}
        >
          <PlusIcon className="size-4" /> Connect Account
        </button>
      </div>

      {/* Benefits Banner */}
      <div className="bg-red-50/60 border border-red-100/80 rounded-2xl p-5 flex items-start gap-4">
        <div className="size-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <SparklesIcon className="size-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 text-sm">Automate Your Social Presence</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
            Connect your accounts to manage, track analytics, and automate your posts from one single dashboard. 
            Once connected, you can publish to multiple networks at the same time and leverage our AI Composer to write custom copy.
          </p>
        </div>
      </div>

      {/* Onboarding Stepper */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">How to get started</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="flex gap-3.5 items-start">
            <div className="size-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">1</div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-800">Choose Platform</h4>
              <p className="text-xs text-slate-400 leading-normal">Pick any of the supported social networks below.</p>
            </div>
          </div>
          {/* Step 2 */}
          <div className="flex gap-3.5 items-start">
            <div className="size-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">2</div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-800">Log In & Authorize</h4>
              <p className="text-xs text-slate-400 leading-normal">Log in to your profile and grant the required permissions.</p>
            </div>
          </div>
          {/* Step 3 */}
          <div className="flex gap-3.5 items-start">
            <div className="size-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-sm shrink-0 border border-red-100">3</div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-bold text-slate-800">Start Scheduling</h4>
              <p className="text-xs text-slate-400 leading-normal">Create and schedule posts to go live automatically!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Accounts List */}
      {accounts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Connected Profiles</h3>
          <AccountList accounts={accounts} onDisconnect={handleDisconnect} />
        </div>
      )}

      {/* Available Platforms (Cards Grid) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Available Platforms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platforms.map((platform) => {
            const isConnected = connectedIds.includes(platform.id);
            const isConnecting = connecting === platform.id;
            const Icon = platform.icon;
            
            return (
              <div 
                key={platform.id} 
                className={`bg-white border rounded-2xl p-5 flex flex-col justify-between h-48 transition-all ${
                  isConnected 
                    ? 'border-emerald-100 shadow-xs ring-1 ring-emerald-50/50' 
                    : 'border-slate-100 hover:border-slate-200/80 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${
                      isConnected ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'
                    }`}>
                      <Icon className="size-5" />
                    </div>
                    {isConnected ? (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Connected
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                        Available
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{platform.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-normal mt-1">{platform.description}</p>
                  </div>
                </div>

                {isConnected ? (
                  <button 
                    disabled
                    className="w-full text-center py-2 bg-slate-50 border border-slate-100 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed"
                  >
                    Linked
                  </button>
                ) : (
                  <button 
                    onClick={() => handleConnect(platform.id)}
                    disabled={connecting !== null}
                    className={`w-full text-center py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      connecting !== null ? 'opacity-50 cursor-wait' : ''
                    }`}
                  >
                    {isConnecting ? (
                      <>
                        <span className="animate-spin size-3 border-2 border-white border-t-transparent rounded-full" />
                        Connecting...
                      </>
                    ) : (
                      'Connect'
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Help Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <HelpCircleIcon className="size-4 text-slate-450 shrink-0" />
          <span><strong>Need help connecting?</strong> Make sure you are logged in to your social accounts in this browser.</span>
        </div>
        <a href="mailto:support@mediascheduler.com" className="text-red-500 font-bold hover:underline shrink-0">Contact Support</a>
      </div>

      {/* Platform Picker Modal */}
      {showPlatformPicker && (
        <PlatformPickerModel 
          connectedIds={connectedIds}
          connecting={connecting}
          onClose={() => setShowPlatformPicker(false)}
          onConnect={handleConnect}
        />
      )}
    </div>
  );
}