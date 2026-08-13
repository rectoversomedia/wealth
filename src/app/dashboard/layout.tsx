'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  GitBranch,
  BarChart3,
  FileText,
  Megaphone,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Bell,
  User,
  CheckCheck,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdvisorNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  leadId?: string;
  leadName?: string;
  opportunityScore?: number;
  opportunityTier?: 'hot' | 'warm' | 'nurture';
  read: boolean;
  createdAt: string;
}

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/dashboard/leads', icon: Users, label: 'Leads' },
  { href: '/dashboard/pipeline', icon: GitBranch, label: 'Pipeline' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/campaigns', icon: Megaphone, label: 'Campaigns' },
  { href: '/dashboard/content', icon: FileText, label: 'Content Studio' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState<AdvisorNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const notifIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auth check
  useEffect(() => {
    const loggedIn = sessionStorage.getItem('advisor_logged_in') === 'true';
    if (!loggedIn) {
      router.push('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  // Fetch notifications
  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch { /* silently fail in demo */ }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifs();
      // Poll every 20 seconds for new notifications
      notifIntervalRef.current = setInterval(fetchNotifs, 20_000);
    }
    return () => {
      if (notifIntervalRef.current) clearInterval(notifIntervalRef.current);
    };
  }, [isLoggedIn]);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'mark_all_read' }),
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('advisor_logged_in');
    sessionStorage.removeItem('advisor_email');
    router.push('/login');
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-screen bg-white border-r border-[var(--border)] flex flex-col transition-transform duration-300',
        'w-60',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--border)]">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Logo />
            <div>
              <p className="font-bold text-sm text-[var(--slate-800)] leading-none">Wealth Lead Engine</p>
              <p className="text-[10px] text-[var(--muted)] mt-0.5">Advisor Portal</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[var(--muted)] hover:text-[var(--slate-700)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-[var(--slate-900)] text-white shadow-sm'
                    : 'text-[var(--slate-500)] hover:text-[var(--slate-800)] hover:bg-[var(--slate-50)]'
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--gold-100)] text-[var(--gold-700)] flex items-center justify-center text-xs font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--slate-800)] truncate">Advisor</p>
              <p className="text-xs text-[var(--muted)] truncate">advisor@demo.com</p>
            </div>
          </div>
          <div className="space-y-1">
            <Link href="/dashboard/settings" className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--slate-500)] hover:text-[var(--slate-700)] hover:bg-[var(--slate-50)] rounded-lg transition-colors">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--slate-500)] hover:text-[var(--danger)] hover:bg-[var(--danger-bg)] rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-60 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-[var(--border)] px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[var(--slate-500)] hover:text-[var(--slate-800)]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden lg:block text-sm text-[var(--muted)]">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifs(v => !v)}
                className="relative text-[var(--slate-500)] hover:text-[var(--slate-800)] transition-colors p-1.5 rounded-lg hover:bg-[var(--slate-50)]"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[var(--gold-500)] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification panel */}
              {showNotifs && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[var(--border)] rounded-xl shadow-xl z-50 animate-scale-in overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--slate-50)]">
                    <p className="text-sm font-bold text-[var(--slate-800)]">Notifications</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-[var(--gold-600)] hover:text-[var(--gold-700)] flex items-center gap-1 font-medium"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-10 text-center">
                        <Bell className="w-8 h-8 text-[var(--slate-300)] mx-auto mb-2" />
                        <p className="text-sm text-[var(--muted)]">No notifications yet</p>
                        <p className="text-xs text-[var(--slate-400)] mt-1">New leads will appear here</p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map(notif => (
                        <Link
                          key={notif.id}
                          href={notif.leadId ? `/dashboard/leads/${notif.leadId}` : '/dashboard/leads'}
                          onClick={() => setShowNotifs(false)}
                          className={cn(
                            'flex items-start gap-3 px-4 py-3 hover:bg-[var(--slate-50)] border-b border-[var(--border-subtle)] last:border-0 transition-colors',
                            !notif.read && 'bg-[var(--gold-50)]'
                          )}
                        >
                          <div className={cn(
                            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5',
                            notif.opportunityTier === 'hot' ? 'bg-[var(--danger-bg)] text-[var(--danger)]' :
                            notif.opportunityTier === 'warm' ? 'bg-[var(--warning-bg)] text-[var(--warning)]' :
                            'bg-[var(--slate-100)] text-[var(--slate-500)]'
                          )}>
                            {notif.type === 'new_lead' ? (
                              <User className="w-4 h-4" />
                            ) : notif.type === 'hot_lead' ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <Bell className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn('text-xs font-semibold', notif.read ? 'text-[var(--slate-500)]' : 'text-[var(--slate-800)]')}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-[var(--muted)] mt-0.5 leading-relaxed">{notif.message}</p>
                            <p className="text-[10px] text-[var(--slate-400)] mt-1">
                              {new Date(notif.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          {!notif.read && <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--gold-500)] mt-2" />}
                        </Link>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <Link
                      href="/dashboard/leads"
                      onClick={() => setShowNotifs(false)}
                      className="block text-center text-xs font-semibold text-[var(--gold-600)] hover:text-[var(--gold-700)] py-3 border-t border-[var(--border)] bg-[var(--slate-50)] hover:bg-[var(--gold-50)] transition-colors"
                    >
                      View all leads →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#b8892a" />
      <path d="M16 6L24 10V18L16 22L8 18V10L16 6Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <circle cx="16" cy="14" r="3" fill="white" />
      <path d="M16 17V22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
