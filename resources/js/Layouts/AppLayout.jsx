import { Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: route('dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Projects', href: route('projects.index'), icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
];

function Sidebar({ collapsed }) {
  const page = usePage();
  const currentUrl = page.url;

  return (
    <aside className={cn(
      'fixed left-0 top-0 z-30 flex h-full flex-col border-r bg-sidebar transition-all duration-200',
      collapsed ? 'w-16' : 'w-60',
    )}>
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
          P
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold">Command Center</span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = currentUrl === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
              )}
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <button
          onClick={() => {/* toggle sidebar */}}
          className="flex w-full items-center justify-center rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

export default function AppLayout({ header, children }) {
  const { auth } = usePage().props;
  const user = auth?.user;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} />

      <div className={cn(
        'flex flex-1 flex-col transition-all duration-200',
        sidebarCollapsed ? 'ml-16' : 'ml-60',
      )}>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-6">
          {header && (
            <div className="flex-1">{header}</div>
          )}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                <div className="px-2 pb-1.5 text-xs text-muted-foreground">{user.email}</div>
                <DropdownMenuItem asChild>
                  <Link href={route('profile.edit')}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={route('logout')} method="post" as="button" className="w-full text-left">
                    Log out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  );
}
