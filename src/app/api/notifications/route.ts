import { NextResponse } from 'next/server';
import { getNotifications, getUnreadCount, markAllRead, markRead } from '@/lib/services/notifications-store';

export async function GET() {
  return NextResponse.json({
    notifications: getNotifications(),
    unreadCount: getUnreadCount(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, notificationId } = body;

    if (action === 'mark_all_read') {
      markAllRead();
    } else if (action === 'mark_read' && notificationId) {
      markRead(notificationId);
    }

    return NextResponse.json({ success: true, unreadCount: getUnreadCount() });
  } catch {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
