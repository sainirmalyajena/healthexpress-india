'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, Minimize2, Maximize2, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

interface MedBotProps {
    lang: string;
    surgeryContext?: { surgeryName: string; surgerySlug: string };
}

export function MedBot({ lang, surgeryContext }: MedBotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'bot',
            content: lang === 'hi'
                ? 'नमस्ते! मैं मेडबॉट हूं। सर्जरी की जानकारी, लागत, या अस्पताल खोजने में मदद करूंगा। क्या पूछना चाहेंगे?'
                : surgeryContext
                    ? `Hi! I'm MedBot. I can see you're looking at ${surgeryContext.surgeryName}. Want to know about costs, recovery, or find a hospital near you?`
                    : "Hi! I'm MedBot. I can help you find the right surgery, understand costs, or connect you with a hospital. What would you like to know?"
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, isMinimized]);

    const handleSend = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    context: surgeryContext || null,
                    history: messages.slice(1).map(m => ({
                        role: m.role === 'bot' ? 'assistant' : 'user',
                        content: m.content,
                    })),
                }),
            });

            const data = await response.json();
            setMessages(prev => [
                ...prev,
                {
                    role: 'bot',
                    content: data.text || "I'm having trouble connecting. Please call us at 93078-61041.",
                },
            ]);
        } catch {
            setMessages(prev => [
                ...prev,
                { role: 'bot', content: 'Oops! Something went wrong. Please try again or call 93078-61041.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages, surgeryContext]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-36 right-6 md:bottom-10 md:right-10 z-[60] flex flex-col items-end">

            {/* Chat window - Elite Glassmorphism */}
            {isOpen && (
                <div
                    className={cn(
                        "bg-white rounded-[2.5rem] shadow-premium border border-teal-100/50 overflow-hidden flex flex-col mb-6 w-[350px] md:w-[420px] transition-all duration-500 origin-bottom-right",
                        isMinimized ? "h-[80px]" : "h-[550px] md:h-[650px]"
                    )}
                >
                    {/* Header - Luxury Gradient */}
                    <div className="bg-gradient-to-br from-[#054a44] via-[#0d9488] to-[#054a44] p-6 text-white flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                                <Bot className="w-7 h-7 text-teal-100" />
                            </div>
                            <div>
                                <h3 className="font-outfit font-black text-sm tracking-tight">MedBot Assistant</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[10px] text-teal-100 uppercase tracking-[0.2em] font-black">AI Specialist</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Surgery context banner */}
                            {surgeryContext && (
                                <div className="px-6 py-2.5 bg-teal-50/50 border-b border-teal-100 text-[10px] text-teal-800 font-black uppercase tracking-[0.1em] flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-teal-500" />
                                    Asking about: {surgeryContext.surgeryName}
                                </div>
                            )}

                            {/* Messages */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scrollbar-hide">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={cn(
                                            "max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm font-medium",
                                            m.role === 'user'
                                                ? "bg-slate-900 text-white rounded-tr-none"
                                                : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                                        )}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex items-start">
                                        <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm">
                                            <div className="flex gap-1.5">
                                                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" />
                                                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick replies */}
                            <div className="px-6 pt-3 pb-1 flex gap-2 overflow-x-auto scrollbar-hide">
                                {['Cost Estimate', 'Top Hospitals', 'Recovery Time'].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => setInput(q)}
                                        className="flex-shrink-0 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white text-teal-800 border border-teal-100 rounded-full hover:border-teal-400 hover:bg-teal-50 transition-all shadow-sm"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-6 bg-white border-t border-slate-100">
                                <div className="relative flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                                        placeholder={lang === 'hi' ? 'अपना सवाल यहाँ लिखें...' : 'Ask your concierge...'}
                                        className="w-full pl-6 pr-14 py-4 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-teal-500/20 text-sm font-medium outline-none transition-all placeholder:text-slate-300"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        className="absolute right-2 p-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-800 transition-all disabled:opacity-50 shadow-lg shadow-teal-600/20 active:scale-95"
                                        aria-label="Send"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
                                    <ShieldCheck className="w-3 h-3 text-slate-400" />
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Secure Concierge Protocol</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Trigger Button - Million Dollar Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#054a44] to-[#0d9488] text-white shadow-premium flex items-center justify-center transition-all duration-500 hover:scale-110 hover:-rotate-3 active:scale-95 animate-reveal"
                    aria-label="Open Concierge Assistant"
                >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-[2rem]" />
                    <MessageCircle className="w-10 h-10 transition-transform group-hover:scale-110" />
                    
                    {/* Visual Pulse for Trust */}
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-teal-400 border-4 border-[#fdfdfd] rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-3 h-3 text-white animate-pulse" />
                    </span>

                    {/* Text Label on Hover */}
                    <div className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 hidden md:block whitespace-nowrap border border-white/10 shadow-premium pointer-events-none">
                        Concierge AI
                    </div>
                </button>
            )}
        </div>
    );
}

