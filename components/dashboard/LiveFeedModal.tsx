'use client';

import { useState, useEffect } from 'react';
import { FreeMap } from '@/components/dashboard/FreeMap';
import { junctions } from '@/lib/mockData';
import { X, Activity, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';

export function LiveFeedModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 ${isFullScreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-[#020617] border border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-500 ${isFullScreen ? 'w-full h-full rounded-0' : 'w-full max-w-6xl h-[85vh] rounded-[32px]'}`}>
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-[1100] p-6 flex items-center justify-between bg-gradient-to-b from-slate-950/80 to-transparent backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center">
              <Logo className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase">Live Intelligence Feed</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time sync active • 50+ Global Junctions</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full h-full pt-20">
          <FreeMap junctions={junctions} />
        </div>

        {/* Footer Overlay */}
        {!isFullScreen && (
          <div className="absolute bottom-6 left-6 right-6 z-[1100] flex justify-center pointer-events-none">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 px-6 py-3 rounded-2xl pointer-events-auto flex items-center gap-8 shadow-2xl">
              <div className="text-center">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</div>
                <div className="text-sm font-black text-green-400">Live</div>
              </div>
              <div className="w-[1px] h-8 bg-slate-800" />
              <div className="text-center">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Latency</div>
                <div className="text-sm font-black text-primary">&lt;200ms</div>
              </div>
              <div className="w-[1px] h-8 bg-slate-800" />
              <div className="text-center">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Locations</div>
                <div className="text-sm font-black text-white">Global</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
