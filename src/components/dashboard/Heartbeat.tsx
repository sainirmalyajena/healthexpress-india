'use client';

import { useEffect } from 'react';

export default function Heartbeat() {
    useEffect(() => {
        const ping = () => {
            fetch('/api/heartbeat', { method: 'POST' }).catch(() => {});
        };

        // Ping immediately on load
        ping();

        // Then every 2 minutes
        const interval = setInterval(ping, 2 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return null;
}
