'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { NotificationCenter } from '@/components/dashboard/NotificationCenter';
import { Button } from '@/components/ui/button';
import { Activity, Settings, ShieldCheck, User as UserIcon, LogOut, Mail, Calendar, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SettingsModal } from '@/components/dashboard/SettingsModal';
import { Logo } from '@/components/ui/Logo';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="border-b border-sidebar-border bg-sidebar sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-14 h-14 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
              <Logo className="w-12 h-12 shadow-lg shadow-primary/10" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CityPulse</h1>
              <p className="text-xs text-muted-foreground font-medium">Real-time Traffic Intelligence</p>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
              Live Dashboard
            </Link>
            {user?.role === 'Root Administrator' && (
              <Link href="/admin" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                Control Panel
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <NotificationCenter />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-3 border-l border-sidebar-border focus:outline-none group">
                  <div className="hidden md:block text-right">
                    <p className="text-xs font-black leading-none group-hover:text-primary transition-colors">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mt-1">Authorized Personnel</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl border border-primary/20 overflow-hidden bg-background ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-sidebar border-sidebar-border shadow-2xl p-2 rounded-2xl">
                <DropdownMenuLabel className="p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground font-medium truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-sidebar-border" />
                <div className="p-2 space-y-1">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                    <Shield className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none mb-0.5">Role</p>
                      <p className="text-[11px] font-bold">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-0.5">Joined</p>
                      <p className="text-[11px] font-bold">{user.joinedDate}</p>
                    </div>
                  </div>
                </div>
                {user.role === 'Root Administrator' && (
                  <>
                    <DropdownMenuSeparator className="bg-sidebar-border" />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-sidebar-accent">
                        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-bold">Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-sidebar-accent">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold">Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-sidebar-border" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-2 rounded-lg cursor-pointer text-red-400 hover:text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-bold">Terminate Session</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                onClick={() => setIsSettingsOpen(true)}
                variant="ghost" 
                size="sm"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </header>
  );
}
