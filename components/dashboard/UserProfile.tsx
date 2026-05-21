'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Shield, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <Card className="border-sidebar-border bg-sidebar/30 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-sidebar-border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl border-2 border-primary/20 overflow-hidden bg-background">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <CardTitle className="text-xl font-black">{user.name}</CardTitle>
            <Badge variant="secondary" className="mt-1 font-bold tracking-wider">{user.role}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Email Address</p>
              <p className="text-sm font-bold">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Member Since</p>
              <p className="text-sm font-bold">{user.joinedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Access Level</p>
              <p className="text-sm font-bold text-primary">System Analyst • Tier 2</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-sidebar-border">
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start gap-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-bold">Terminate Session</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
