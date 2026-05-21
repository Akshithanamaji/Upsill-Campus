'use client';

import { useState } from 'react';
import { Header } from '@/components/navigation/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  BarChart, 
  ShieldCheck, 
  Database, 
  History, 
  AlertCircle,
  CheckCircle2,
  Download,
  Settings,
  RefreshCw,
  Trash2,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setUploading(false);
        setProgress(0);
        toast.success("Dataset Integrated", {
          description: "Neural weights have been updated with 14.5k new traffic samples.",
        });
      }
    }, 100);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.info("Model Synchronized", {
        description: "All edge nodes are now running the latest prediction baseline.",
      });
    }, 1500);
  };

  const reports = [
    { id: 'REP-001', name: 'Global Traffic Growth Analysis', date: 'May 10, 2026', status: 'Completed', size: '2.4 MB', type: 'PDF' },
    { id: 'REP-002', name: 'Peak Hour Congestion Audit', date: 'May 12, 2026', status: 'Completed', size: '1.8 MB', type: 'CSV' },
    { id: 'REP-003', name: 'Weather Impact Correlation', date: 'May 13, 2026', status: 'Processing', size: '--', type: 'JSON' },
    { id: 'REP-004', name: 'Emergency Route Efficiency', date: 'May 13, 2026', status: 'Completed', size: '0.9 MB', type: 'PDF' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Header />
      
      <main className="max-w-[1600px] mx-auto p-6 space-y-8 pb-20">
        {/* Admin Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sidebar-border pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1 font-bold">
                <ShieldCheck className="w-3 h-3" />
                Root Administrator
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-green-500 uppercase tracking-wider">Secure Session</span>
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              System Control Panel
            </h1>
            <p className="text-muted-foreground font-medium">Manage edge data, audit reports, and AI model orchestration.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-2 border-sidebar-border bg-sidebar/50 hover:bg-sidebar transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-primary' : ''}`} />
              {refreshing ? 'Syncing...' : 'Sync Models'}
            </Button>
            <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-95">
              <Download className="w-4 h-4" />
              Master System Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 1. Upload Section */}
          <Card className="border-sidebar-border bg-sidebar/30 backdrop-blur-sm lg:col-span-1 border-t-4 border-t-primary shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Edge Dataset Upload
              </CardTitle>
              <CardDescription>Inject new historical records into the neural engine.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed border-sidebar-border rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group relative overflow-hidden"
                onClick={() => !uploading && handleUpload()}
              >
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <Database className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-lg">Drop Data Stream</p>
                  <p className="text-xs text-muted-foreground font-medium">Supports .csv, .json, .parq</p>
                </div>
                <div className="pt-2">
                  <Badge variant="secondary" className="px-4 py-1">Select File</Badge>
                </div>
                
                {uploading && (
                  <div className="absolute inset-0 bg-sidebar/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-4 animate-in fade-in duration-300">
                    <Activity className="w-8 h-8 text-primary animate-pulse" />
                    <div className="w-full space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                        <span>Ingesting Neural Data</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 flex gap-3 shadow-inner">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  <span className="text-foreground font-black uppercase">Critical:</span> Large datasets ( {'>'}100k rows) will trigger an automatic model retraining cycle. System forecasting may be throttled for 3-5 minutes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Traffic Reports Monitor */}
          <Card className="border-sidebar-border bg-sidebar/30 backdrop-blur-sm lg:col-span-2 shadow-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-sidebar/50 border-b border-sidebar-border py-4">
              <div className="space-y-0.5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Traffic Audit Reports
                </CardTitle>
                <CardDescription className="text-[11px]">System-generated analytical breakdowns for urban planning.</CardDescription>
              </div>
              <Button size="sm" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold active:scale-95">
                <BarChart className="w-4 h-4" />
                Generate Audit
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-sidebar-border">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-5 hover:bg-sidebar/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-background border border-sidebar-border flex items-center justify-center shadow-inner group-hover:border-primary/30 transition-all group-hover:scale-105">
                        <FileText className={`w-6 h-6 transition-colors ${report.type === 'PDF' ? 'text-red-400' : report.type === 'CSV' ? 'text-green-400' : 'text-blue-400'}`} />
                      </div>
                      <div>
                        <p className="font-black text-sm tracking-tight">{report.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="outline" className="text-[9px] font-black px-1.5 h-4 border-sidebar-border">{report.id}</Badge>
                          <span className="text-[11px] text-muted-foreground font-bold uppercase">{report.date}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                          <span className="text-[11px] text-muted-foreground font-bold">{report.type} File</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="hidden md:block text-right">
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1 tracking-widest">Process</p>
                        <Badge variant="outline" className={`h-6 gap-1 font-bold ${report.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse'}`}>
                          {report.status === 'Completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                          {report.status}
                        </Badge>
                      </div>
                      <div className="hidden md:block text-right min-w-[70px]">
                        <p className="text-[9px] font-black text-muted-foreground uppercase mb-1 tracking-widest">Size</p>
                        <p className="text-xs font-black">{report.size}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary active:scale-90 transition-all">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-red-500/10 hover:text-red-500 active:scale-90 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Log & Model Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="border-sidebar-border bg-sidebar/30 backdrop-blur-sm lg:col-span-2 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Recent System Activity Log
                </CardTitle>
                <CardDescription className="text-[11px]">Real-time immutable ledger of administrative actions.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest">View Full Logs</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { user: 'Admin-7', action: 'Synchronized Holiday Dataset', target: 'Global Edge Nodes', time: '2h ago' },
                  { user: 'Sys-Bot', action: 'Auto-retrained LSTM Baseline', target: 'Neural Engine V2', time: '5h ago' },
                  { user: 'Admin-2', action: 'Purged Temporary Cache', target: 'Edge Storage', time: '12h ago' },
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-4 pb-4 border-b border-sidebar-border last:border-0 last:pb-0">
                    <div className="w-9 h-9 rounded-xl bg-background border border-sidebar-border flex items-center justify-center shrink-0 shadow-inner mt-0.5">
                      <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-[13px] font-medium leading-none">
                        <span className="font-black text-foreground">{log.user}</span> {log.action} on <span className="text-primary font-black">{log.target}</span>.
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-tight">{log.time}</p>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        <span className="text-[11px] text-green-500 font-bold uppercase tracking-widest">Verified Hash</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-sidebar-border bg-sidebar/30 backdrop-blur-sm lg:col-span-1 shadow-xl border-l-4 border-l-accent">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" />
                Model Health Status
              </CardTitle>
              <CardDescription className="text-[11px]">Performance of active neural prediction layers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-muted-foreground">LSTM Consistency</span>
                  <span className="text-accent">98.2%</span>
                </div>
                <Progress value={98} className="h-1 bg-sidebar-border" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-muted-foreground">Latency (Edge Hub)</span>
                  <span className="text-green-500">24ms</span>
                </div>
                <Progress value={15} className="h-1 bg-sidebar-border" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-muted-foreground">Retraining Buffer</span>
                  <span className="text-primary">82% Full</span>
                </div>
                <Progress value={82} className="h-1 bg-sidebar-border" />
              </div>
              
              <div className="mt-4 p-3 rounded-xl bg-accent/5 border border-accent/10">
                <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                  "System is currently operating within optimal parameters. Next scheduled baseline calibration in 4 hours."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
