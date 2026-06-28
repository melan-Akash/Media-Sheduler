import { XIcon, CheckCircleIcon, ExternalLinkIcon } from 'lucide-react';
import { platforms } from '../assets/assets';

interface PlatformPickerModelProps {
  connectedIds: string[];
  connecting: string | null;
  onClose: () => void;
  onConnect: (platformId: string) => void;
}

export default function PlatformPickerModel({ connectedIds, connecting, onClose, onConnect }: PlatformPickerModelProps) {
  
  return (
    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">Choose a Platform</h3>
          <button className="p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-700 rounded-lg transition-all cursor-pointer" onClick={onClose}>
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Platform List */}
        <div className="p-6 space-y-3">
          {platforms.map((p: any) => {
            const isConnected = connectedIds.includes(p.id);
            const isConnecting = connecting === p.id;

            return (
              <button 
                key={p.id}
                disabled={isConnected || isConnecting}
                onClick={() => onConnect(p.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${isConnected ? 'bg-red-50/20 border-red-100 cursor-default' : 'bg-white border-slate-100 hover:bg-slate-50/80 hover:border-slate-200 cursor-pointer'} ${isConnecting ? 'opacity-60' : ''}`}
              >
                {/* Icon */}
                <div className={`size-10 rounded-lg border flex items-center justify-center shrink-0 bg-white ${isConnected ? 'border-red-100 text-red-500' : 'border-slate-100 text-slate-500'}`}>
                  <p.icon className="size-5" />
                </div>
                
                {/* Label */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className={`text-sm font-semibold ${isConnected ? 'text-red-500' : 'text-slate-800'}`}>
                    {p.name}
                  </div>
                  <div className={`text-xs font-medium mt-0.5 ${isConnected ? 'text-red-400' : 'text-slate-400'}`}>
                    {isConnected ? 'Already connected' : p.description}
                  </div>
                </div>

                {/* Status Indicator */}
                {isConnected && (
                  <CheckCircleIcon className="size-4.5 text-red-500 shrink-0" />
                )}
                {isConnecting && (
                  <div className="size-4.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin shrink-0" />
                )}
                {!isConnected && !isConnecting && (
                  <ExternalLinkIcon className="size-4 text-slate-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}