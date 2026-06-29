import { useState, useEffect } from 'react';
import { PlusIcon } from 'lucide-react';
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
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Connected Accounts</h2>
          <p className="text-sm text-slate-400 font-medium">{accounts.length} of {platforms.length} platforms connected</p>
        </div>
        <button 
          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-xs transition-all cursor-pointer"
          onClick={() => setShowPlatformPicker(true)}
        >
          <PlusIcon className="size-4" /> Connect Account
        </button>
      </div>

      {/* Connected Accounts List Component */}
      <AccountList accounts={accounts} onDisconnect={handleDisconnect} />

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