import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'LASIK Eye Surgery - Free Consultation | HealthExpress India',
  description: 'Get 6/6 vision in 15 minutes. Check if your insurance covers LASIK. Free consultation and cab provided on surgery day. Book now with HealthExpress India.',
};

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '';

  return (
    <>
      {/* Facebook Pixel Code */}
      {pixelId && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      {/* Minimal campaign header — no navigation links */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex justify-between items-center z-50 sticky top-0">
        <div className="font-outfit font-black text-2xl text-teal-800 tracking-tight">
          HealthExpress <span className="text-teal-500 text-3xl leading-none">.</span>
        </div>
        <div className="text-sm font-bold text-slate-500 hidden md:block">
          Questions? Call <a href="tel:9307861041" className="text-teal-600">93078-61041</a>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      {/* Simple footer */}
      <footer className="bg-slate-900 py-8 px-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} HealthExpress India. All rights reserved.</p>
        <p className="mt-2 text-xs">By submitting your details, you agree to our Privacy Policy and Terms of Service.</p>
      </footer>
    </>
  );
}
