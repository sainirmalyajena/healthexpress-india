'use client';

import React from 'react';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
      <div className="relative">
        {/* Animated outer ring */}
        <div className="w-24 h-24 rounded-full border-4 border-teal-500/10 border-t-teal-600 animate-spin" />
        
        {/* Logo in center with pulse */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="HealthExpress Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center">
        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-teal-600/60 mb-2">HealthExpress India</p>
        <div className="h-0.5 w-32 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-teal-600 animate-progress origin-left" />
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
