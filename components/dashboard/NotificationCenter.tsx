'use client';

import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function NotificationCenter() {
  const { data } = useSWR('/api/traffic/alerts', fetcher, {
    refreshInterval: 60000
  });

  const alerts = data?.alerts || [];
  const activeCount = data?.activeAlerts || 0;

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBgColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      case 'high': return 'bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 border-yellow-500/20';
      default: return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
          <Bell className="w-5 h-5" />
          {activeCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-sidebar rounded-full animate-pulse"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-sidebar border-sidebar-border shadow-2xl" align="end">
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h3 className="font-bold text-sm">Smart Notifications</h3>
          {activeCount > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
              {activeCount} Active
            </Badge>
          )}
        </div>
        <ScrollArea className="h-[350px]">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">All systems clear. No active alerts.</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {alerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getBgColor(alert.severity)} transition-colors`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(alert.severity)}</div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-bold leading-tight">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">
                          Junction {alert.junctionId} • {alert.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t border-sidebar-border">
          <Button variant="ghost" className="w-full text-xs h-8 text-muted-foreground">
            Clear all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
