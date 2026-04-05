import { UserCircle, Settings, Shield, Eye, LogOut, RefreshCcw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFinanceStore } from '@/store/useFinanceStore';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
  DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function ProfileDropdown() {
  const { user, signOut } = useAuth();
  const { role, setRole, setUserId, clearStore } = useFinanceStore();

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    await signOut();
    setUserId(null);
    toast.success('Signed out');
  };

  const handleRoleSwitch = (newRole: 'admin' | 'viewer') => {
    setRole(newRole);
    toast.success(`Switched to ${newRole === 'admin' ? 'Admin' : 'User'} view`);
  };
  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all app data? This will clear your local transactions.')) {
      clearStore();
      toast.info('Dashboard reset to factory settings');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="relative">
            <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-slate-50 text-xs font-bold overflow-hidden ring-2 ring-border hover:ring-primary/30 transition-all">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="h-full w-full object-cover rounded-full" />
              ) : (
                userInitials
              )}
            </div>
            <span className={cn(
              'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card',
              role === 'admin' ? 'bg-primary' : 'bg-muted-foreground'
            )} />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 rounded-xl">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <span className={cn(
              'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider w-fit',
              role === 'admin' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {role === 'admin' ? 'Admin' : 'User'}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
            <UserCircle className="h-4 w-4" />
            View Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Switch Role
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="rounded-xl">
            <DropdownMenuItem
              onClick={() => handleRoleSwitch('admin')}
              className={cn('flex items-center gap-2', role === 'admin' && 'bg-accent')}
            >
              <Shield className="h-4 w-4" />
              Admin
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRoleSwitch('viewer')}
              className={cn('flex items-center gap-2', role === 'viewer' && 'bg-accent')}
            >
              <Eye className="h-4 w-4" />
              User
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

       

        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
