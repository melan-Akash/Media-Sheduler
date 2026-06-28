import { useState, useEffect } from 'react';
import { PlusIcon } from 'lucide-react';
import AccountList from '../components/accountlist';
import PlatformPickerModel from '../components/ppm';
import { dummyAccountsData, platforms } from '../assets/assets';

export default function Accounts() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      setAccounts(dummyAccountsData);
    };
    fetchAccounts();
  }, []);

  const handleDisconnect = async (accountId: string) => {
    setAccounts(accounts.filter((a) => a.id !== accountId));
  };

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    // Simulate API connection delay
    setTimeout(() => {
      setConnecting(null);
      setAccounts([...accounts, dummyAccountsData]);
      setShowPlatformPicker(false);
    }, 1000);
  };

  const connectedIds = accounts.map((a) => a.platform);

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