'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { User, Mail, Shield, ArrowRight, X } from 'lucide-react';

export function SignInModal({ isOpen, onClose, onAuthSuccess }: { isOpen: boolean; onClose: () => void; onAuthSuccess: (role: string) => void }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Traffic Analyst'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin Credential Check
    const isAdmin = formData.name.toLowerCase() === 'admin' && formData.email.toLowerCase() === 'admin@citypulse.gov';
    const role = isAdmin ? 'Root Administrator' : 'Traffic Analyst';

    login({
      ...formData,
      role,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`
    });
    
    onAuthSuccess(role);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <Card className="w-full max-w-md border-sidebar-border bg-sidebar shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <CardHeader className="text-center pt-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-black">Identity Access</CardTitle>
          <CardDescription>Enter your credentials to access the traffic console.</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  required
                  placeholder="John Doe" 
                  className="pl-10 bg-background border-sidebar-border focus:border-primary transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  required
                  type="email"
                  placeholder="john@city.gov" 
                  className="pl-10 bg-background border-sidebar-border focus:border-primary transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                Grant Access
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="bg-primary/5 border-t border-sidebar-border py-4 justify-center">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
            Secure Neural Link Encrypted • RSA-4096
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
