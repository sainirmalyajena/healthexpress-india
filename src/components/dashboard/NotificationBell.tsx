'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    link: string | null;
    createdAt: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasAudioPlayed, setHasAudioPlayed] = useState(false);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                if (data.notifications) {
                    if (data.notifications.length > notifications.length && notifications.length !== 0 && !hasAudioPlayed) {
                        playAudioAlert();
                    }
                    setNotifications(data.notifications);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const playAudioAlert = () => {
        try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play();
            setHasAudioPlayed(true);
            setTimeout(() => setHasAudioPlayed(false), 10000);
        } catch (e) {
            // Audio autoplay blocked
        }
    };

    const markAsRead = async (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        await fetch('/api/notifications', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
    };

    const markAllRead = async () => {
        setNotifications([]);
        setIsOpen(false);
        await fetch('/api/notifications', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ markAllRead: true })
        });
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md"
            >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                        {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                    <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                        {notifications.length > 0 && (
                            <button onClick={markAllRead} className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-400">
                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">You are all caught up!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {notifications.map(n => (
                                    <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-bold text-slate-800 text-sm">{n.title}</p>
                                            <span className="text-[10px] text-slate-400 font-medium">
                                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 mb-2 leading-relaxed">{n.message}</p>
                                        <div className="flex items-center gap-3">
                                            {n.link && (
                                                <Link href={n.link} onClick={() => markAsRead(n.id)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded">
                                                    View Action <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}
                                            <button onClick={() => markAsRead(n.id)} className="text-xs font-semibold text-slate-500 hover:text-slate-700">
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
