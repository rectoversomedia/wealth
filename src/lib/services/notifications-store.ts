/**
 * In-memory notifications store for advisor alerts.
 * Replace with Supabase in production.
 */

import { generateId } from '@/lib/utils';

export type NotificationType = 'new_lead' | 'hot_lead' | 'email_sent' | 'meeting_booked' | 'stage_change';

export interface AdvisorNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  leadId?: string;
  leadName?: string;
  opportunityScore?: number;
  opportunityTier?: 'hot' | 'warm' | 'nurture';
  read: boolean;
  createdAt: string;
}

const notifications: AdvisorNotification[] = [];

export function addNotification(notification: Omit<AdvisorNotification, 'id' | 'read' | 'createdAt'>): AdvisorNotification {
  const n: AdvisorNotification = {
    ...notification,
    id: generateId(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  notifications.unshift(n); // newest first
  // Keep last 50 notifications
  if (notifications.length > 50) notifications.pop();
  return n;
}

export function getNotifications(): AdvisorNotification[] {
  return [...notifications];
}

export function getUnreadCount(): number {
  return notifications.filter(n => !n.read).length;
}

export function markAllRead(): void {
  notifications.forEach(n => { n.read = true; });
}

export function markRead(id: string): void {
  const n = notifications.find(n => n.id === id);
  if (n) n.read = true;
}

export function clearAll(): void {
  notifications.length = 0;
}
