import React from 'react';

export default function TimelineFormatter({ details }: { details: string }) {
    if (!details) return <span>Action performed</span>;
    try {
        const d = JSON.parse(details);
        if (d.note) return <div className="italic whitespace-pre-wrap text-slate-700 mt-1 p-3 bg-amber-50/50 rounded-lg border border-amber-100">{d.note}</div>;
        if (d.noteSnippet) return <div className="italic whitespace-pre-wrap text-slate-700 mt-1 p-3 bg-amber-50/50 rounded-lg border border-amber-100">{d.noteSnippet}</div>;
        if (d.from && d.to) return <span className="font-medium">Changed from <span className="text-slate-400 line-through px-1">{d.from}</span> to <span className="text-teal-600 font-bold px-1">{d.to}</span></span>;
        if (d.to) return <span className="font-medium">Assigned to: {d.to}</span>;
        return <span className="italic text-slate-400">{details}</span>;
    } catch(e) {
        return <span className="italic">{details.replace(/\"/g, '')}</span>;
    }
}
