'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { SignInModal } from '@/components/auth/SignInModal';
import { Button } from '@/components/ui/button';
import { Activity, ShieldCheck, Zap, Globe, BarChart3, TrendingUp, Navigation, HeartPulse, Radio } from 'lucide-react';
import { LiveFeedModal } from '@/components/dashboard/LiveFeedModal';
import { Logo } from '@/components/ui/Logo';

export default function LandingPage() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLiveFeedOpen, setIsLiveFeedOpen] = useState(false);

  const handleGetStarted = () => {
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (role: string) => {
    setIsAuthModalOpen(false);
    if (role === 'Root Administrator') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 selection:text-primary-foreground overflow-hidden">
      {/* Background Glow */}
      
      {/* Navbar */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 flex items-center justify-center transition-transform hover:rotate-12 duration-500">
            <Logo className="w-14 h-14 shadow-lg shadow-primary/10" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">CityPulse</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#solutions" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Solutions</a>
          <button 
            onClick={() => setIsLiveFeedOpen(true)}
            className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Radio className="w-4 h-4 text-primary animate-pulse" />
            View Live Feed
          </button>
        </div>
        <Button 
          onClick={handleGetStarted}
          className="bg-white text-black hover:bg-slate-200 font-black px-6 rounded-full shadow-xl shadow-white/5 transition-all active:scale-95"
        >
          Launch Console
        </Button>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8 animate-in slide-in-from-bottom-4 duration-700">
          <Zap className="w-3 h-3 fill-current" />
          Next-Gen Traffic Intelligence
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8 animate-in slide-in-from-bottom-8 duration-700 delay-100">
          The Future of <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">Urban Mobility</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-slate-400 font-medium mb-12 animate-in slide-in-from-bottom-12 duration-700 delay-200">
          Harnessing LSTM Neural Networks and real-time edge computing to eliminate congestion and prioritize emergency services across the globe.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-16 duration-700 delay-300">
          <Button 
            onClick={handleGetStarted}
            size="lg" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-black shadow-2xl shadow-primary/30 transition-all active:scale-95 group"
          >
            Get Started
            <Navigation className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Button>
          <Button 
            onClick={() => setIsLiveFeedOpen(true)}
            size="lg" 
            variant="outline" 
            className="h-16 px-10 rounded-2xl border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:text-white text-lg font-black transition-all active:scale-95"
          >
            View Live Feed
          </Button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-20 mt-24 animate-in fade-in duration-1000 delay-500">
          <div className="text-left">
            <div className="text-3xl font-black text-white">50+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Global Junctions</div>
          </div>
          <div className="text-left border-l border-slate-800 pl-8">
            <div className="text-3xl font-black text-white">94.8%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">AI Accuracy</div>
          </div>
          <div className="text-left border-l border-slate-800 pl-8">
            <div className="text-3xl font-black text-white">1.2M</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Data Points</div>
          </div>
          <div className="text-left border-l border-slate-800 pl-8">
            <div className="text-3xl font-black text-white">&lt;200ms</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Sync Latency</div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-primary/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-4">Neural Forecasting</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              Proprietary LSTM models analyze 30-day historical windows to predict congestion with up to 98% precision.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-accent/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HeartPulse className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-4">Emergency SOS</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              Real-time route optimization for ambulances, bypassing heavy traffic zones via a dedicated SOS priority layer.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-4">Global Reach</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              Monitor and manage junctions across India, USA, UK, Europe, and Asia from a single centralized console.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions / Map Preview Area */}
      <section id="solutions" className="relative z-10 py-32 bg-slate-900/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
              Engineered for <br />
              <span className="text-primary">Urban Excellence</span>
            </h2>
            <div className="space-y-6">
              {[
                { icon: <BarChart3 />, title: 'Deep Analytics', desc: 'Detailed growth metrics and holiday impact studies.' },
                { icon: <Globe />, title: 'Zero Latency Map', desc: 'Google-grade map engine with high-fidelity traffic layers.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleGetStarted}
              className="mt-8 bg-white text-black font-black px-8 h-12 rounded-full hover:bg-slate-200 transition-all active:scale-95"
            >
              Explore the Console
            </Button>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative bg-slate-950 rounded-[40px] border border-slate-800 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.5)] transform lg:rotate-6 hover:rotate-0 transition-transform duration-700">
               <div className="w-full aspect-[4/3] bg-slate-900 rounded-[30px] overflow-hidden flex items-center justify-center relative">
                  <Activity className="w-20 h-20 text-primary/20 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent flex items-end p-8">
                     <div>
                       <div className="text-xs font-black text-primary uppercase tracking-widest mb-2">Live Interface</div>
                       <div className="text-xl font-bold">99.9% System Uptime</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-slate-500 text-sm font-medium">
          © 2026 CityPulse Intelligence. All rights reserved.
        </div>
        <div className="flex items-center gap-10">
          <a href="#" className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest">Privacy</a>
          <a href="#" className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest">Security</a>
          <a href="#" className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest">Documentation</a>
        </div>
      </footer>

      <SignInModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuthSuccess={handleAuthSuccess}
      />
      
      <LiveFeedModal 
        isOpen={isLiveFeedOpen}
        onClose={() => setIsLiveFeedOpen(false)}
      />
    </div>
  );
}
