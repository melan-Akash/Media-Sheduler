import { PlusIcon, CheckCircleIcon, AlertCircleIcon, UnplugIcon } from 'lucide-react';
import { platforms } from '../assets/assets'; // Dummy static asset file 

interface AccountListProps {
  accounts: any[];
  onDisconnect: (accountId: string) => Promise<void>;
}

export default function AccountList({ accounts, onDisconnect }: AccountListProps) {
  
  const handleDisconnect = async (accountId: string) => {
    const confirm = window.confirm("Are you sure you want to disconnect this account?");
    if (!confirm) return;
    await onDisconnect(accountId);
  };

  if (accounts.length === 0) {
    return (
      <div className="...">
        <div className="...">
          <PlusIcon className="size-... text-... opacity-..." />
        </div>
        <p className="...">No accounts connected</p>
        <p className="text-sm text-color mt-... max-w-... text-center">
          Connect your social media accounts to start scheduling posts.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {accounts.map((account, index) => {
        const meta = platforms.find((p: any) => p.id === account.platform);
        if (!meta) return null;

        return (
          <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
            <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 border border-slate-100">
              <meta.icon className="size-6 text-slate-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-800 truncate">{account.handle}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">{meta.name}</div>
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0">
              {account.status === 'connected' ? (
                <>
                  <CheckCircleIcon className="size-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-500">Connected</span>
                </>
              ) : (
                <>
                  <AlertCircleIcon className="size-4 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-500">Disconnected</span>
                </>
              )}
            </div>

            <button 
              className="p-2 text-slate-300 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-all shrink-0 cursor-pointer" 
              title="Disconnect account"
              onClick={() => handleDisconnect(account.id)}
            >
              <UnplugIcon className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}