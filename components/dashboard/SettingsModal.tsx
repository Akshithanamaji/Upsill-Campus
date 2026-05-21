'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Settings,
  Moon,
  Sun,
  Palette,
  Bell,
  AlertTriangle,
  Zap,
  Check,
  RotateCcw,
  MapPin,
  Activity,
  Clock,
  ChevronRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { theme, setTheme } = useTheme();
  const [accentColor, setAccentColor] = useState('blue');
  const [notifications, setNotifications] = useState({
    all: true,
    congestion: true,
    peak: false,
    system: true
  });

  const [junctions, setJunctions] = useState([
    { id: 1, name: 'Silk Board Junction', enabled: true },
    { id: 2, name: 'Hebbal Flyover', enabled: true },
    { id: 3, name: 'Electronic City', enabled: false },
    { id: 4, name: 'MG Road', enabled: true },
    { id: 5, name: 'Indiranagar', enabled: true },
  ]);

  const [thresholds, setThresholds] = useState({
    low: 30,
    medium: 60,
    high: 85
  });

  const [predictionWindow, setPredictionWindow] = useState('24h');

  const [refreshSettings, setRefreshSettings] = useState({
    auto: true,
    interval: '60s'
  });

  const colors = [
    { name: 'blue', oklch: 'oklch(0.50 0.24 265.77)', class: 'bg-blue-500' },
    { name: 'purple', oklch: 'oklch(0.50 0.24 300.00)', class: 'bg-purple-500' },
    { name: 'green', oklch: 'oklch(0.50 0.24 150.00)', class: 'bg-green-500' },
    { name: 'orange', oklch: 'oklch(0.50 0.24 40.00)', class: 'bg-orange-500' },
    { name: 'rose', oklch: 'oklch(0.50 0.24 0.00)', class: 'bg-rose-500' },
  ];

  const handleSave = () => {
    const selectedColor = colors.find(c => c.name === accentColor);
    if (selectedColor) {
      document.documentElement.style.setProperty('--primary', selectedColor.oklch);
      document.documentElement.style.setProperty('--sidebar-primary', selectedColor.oklch);
      document.documentElement.style.setProperty('--ring', selectedColor.oklch);
    }

    toast.success("System Protocols Updated", {
      description: "Junction matrices, thresholds, and neural forecasting windows synchronized.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col bg-sidebar border-sidebar-border shadow-2xl rounded-3xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent p-6 border-b border-sidebar-border">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black tracking-tight">Advanced System Console</DialogTitle>
                <DialogDescription className="text-xs font-medium">Fine-tune edge junctions, neural limits, and global forecasting.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column: Visuals & Notifications */}
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Interface Aesthetics</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-sidebar-border hover:border-muted-foreground/30'}`}
                  >
                    <Sun className={`w-6 h-6 mb-2 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-bold">Light Protocol</span>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-sidebar-border hover:border-muted-foreground/30'}`}
                  >
                    <Moon className={`w-6 h-6 mb-2 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-xs font-bold">Dark Protocol</span>
                  </button>
                </div>

                <div className="space-y-4 pt-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accent Signature</Label>
                  <div className="flex items-center gap-3">
                    {colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setAccentColor(c.name)}
                        className={`w-9 h-9 rounded-full ${c.class} flex items-center justify-center transition-transform active:scale-90 relative`}
                      >
                        {accentColor === c.name && <Check className="w-5 h-5 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-accent" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Alert Protocols</h3>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'all', label: 'Global Traffic Alerts', sub: 'Enable/Disable all edge notifications', icon: <Zap className="w-3.5 h-3.5 text-yellow-500" /> },
                    { key: 'congestion', label: 'Congestion Warning', sub: 'Notify on "Heavy" traffic levels', icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-500" /> },
                    { key: 'peak', label: 'Peak Hour Alerts', sub: 'Alert during forecasted peaks', icon: <Clock className="w-3.5 h-3.5 text-primary" /> }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3.5 rounded-2xl bg-sidebar-accent/30 border border-sidebar-border/50">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <Label className="text-xs font-bold">{item.label}</Label>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium">{item.sub}</p>
                      </div>
                      <Switch
                        checked={(notifications as any)[item.key]}
                        onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Junctions & Forecasts */}
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Junction Monitoring</h3>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {junctions.map((j) => (
                    <div key={j.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-sidebar-border hover:border-primary/30 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${j.enabled ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`} />
                        <span className="text-xs font-bold">{j.name}</span>
                      </div>
                      <Switch
                        checked={j.enabled}
                        onCheckedChange={(v) => {
                          setJunctions(junctions.map(item => item.id === j.id ? { ...item, enabled: v } : item));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Neural Thresholds</h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-green-500/80 uppercase">Low Limit</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={thresholds.low}
                        onChange={(e) => setThresholds({ ...thresholds, low: parseInt(e.target.value) })}
                        className="bg-background border-sidebar-border font-bold text-xs"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-yellow-500/80 uppercase">Med Limit</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={thresholds.medium}
                        onChange={(e) => setThresholds({ ...thresholds, medium: parseInt(e.target.value) })}
                        className="bg-background border-sidebar-border font-bold text-xs"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-red-500/80 uppercase">High Limit</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={thresholds.high}
                        onChange={(e) => setThresholds({ ...thresholds, high: parseInt(e.target.value) })}
                        className="bg-background border-sidebar-border font-bold text-xs"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Forecasting Window</h3>
                </div>

                <Select value={predictionWindow} onValueChange={setPredictionWindow}>
                  <SelectTrigger className="w-full h-12 rounded-2xl bg-background border-sidebar-border font-bold">
                    <SelectValue placeholder="Select Duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-sidebar border-sidebar-border rounded-2xl">
                    <SelectItem value="1h" className="font-bold">Next 1 Hour (Real-time)</SelectItem>
                    <SelectItem value="24h" className="font-bold">Next 24 Hours (Daily Trend)</SelectItem>
                    <SelectItem value="weekly" className="font-bold">Weekly Prediction (Long-term)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground font-medium italic">
                  * Neural engine retraining required for windows exceeding 24 hours.
                </p>
              </div>

              <div className="space-y-6 pt-4 border-t border-sidebar-border/30">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-blue-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Data Refresh Protocols</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-sidebar-accent/30 border border-sidebar-border/50">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-bold">Auto-Refresh Engine</Label>
                      <p className="text-[10px] text-muted-foreground font-medium">Continuously update traffic matrix</p>
                    </div>
                    <Switch
                      checked={refreshSettings.auto}
                      onCheckedChange={(v) => setRefreshSettings({ ...refreshSettings, auto: v })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Interval</Label>
                      <Select
                        disabled={!refreshSettings.auto}
                        value={refreshSettings.interval}
                        onValueChange={(v) => setRefreshSettings({ ...refreshSettings, interval: v })}
                      >
                        <SelectTrigger className="h-10 bg-background border-sidebar-border font-bold text-xs">
                          <SelectValue placeholder="Interval" />
                        </SelectTrigger>
                        <SelectContent className="bg-sidebar border-sidebar-border">
                          <SelectItem value="30s">30 Seconds</SelectItem>
                          <SelectItem value="60s">1 Minute</SelectItem>
                          <SelectItem value="300s">5 Minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={() => {
                          toast.info("Manual Synchronization", {
                            description: "Triggering edge node refresh...",
                          });
                          setTimeout(() => toast.success("Data Synchronized"), 1500);
                        }}
                        variant="outline"
                        className="w-full h-10 rounded-xl border-sidebar-border font-bold text-xs gap-2"
                      >
                        <Activity className="w-3.5 h-3.5" />
                        Sync Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-sidebar-accent/50 p-6 border-t border-sidebar-border flex items-center justify-between sm:justify-between shrink-0">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <RotateCcw className="w-4 h-4" />
            Restore System Defaults
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} className="rounded-xl border-sidebar-border">Discard</Button>
            <Button onClick={handleSave} className="rounded-xl bg-primary hover:bg-primary/90 px-8 font-black">Apply Protocols</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
