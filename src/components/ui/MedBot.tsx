'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, Minimize2, Maximize2 } from 'lucide-react';

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

    // CSS-only reveal — no framer-motion SSR flash
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

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
        <div className="fixed bottom-44 right-6 md:bottom-6 md:right-24 z-50 flex flex-col items-end">

            {/* Chat window — CSS transitions only */}
            {isOpen && (
                <div
                    className="bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden flex flex-col mb-4 w-[350px] md:w-[400px]"
                    style={{
                        height: isMinimized ? '64px' : '500px',
                        transition: 'height 0.25s ease',
                    }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-4 text-white flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">MedBot Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[10px] text-teal-100 uppercase tracking-wider font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                aria-label={isMinimized ? 'Expand' : 'Minimise'}
                            >
                                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Surgery context banner */}
                            {surgeryContext && (
                                <div className="px-4 py-2 bg-teal-50 border-b border-teal-100 text-xs text-teal-700 font-medium">
                                    Asking about: {surgeryContext.surgeryName}
                                </div>
                            )}

                            {/* Messages */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                                            m.role === 'user'
                                                ? 'bg-teal-600 text-white rounded-tr-none shadow-md'
                                                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                                        }`}>
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex items-start">
                                        <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" />
                                                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quick replies */}
                            <div className="px-4 pt-2 pb-1 flex gap-2 overflow-x-auto scrollbar-hide">
                                {['What is the cost?', 'Is insurance covered?', 'Which hospitals?'].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => setInput(q)}
                                        className="flex-shrink-0 text-xs px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-full hover:bg-teal-100 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-white border-t border-slate-100">
                                <div className="relative flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                                        placeholder={lang === 'hi' ? 'अपना सवाल यहाँ लिखें...' : 'Ask me anything...'}
                                        className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-teal-500/20 text-sm outline-none"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        className="absolute right-1.5 p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all disabled:opacity-50"
                                        aria-label="Send"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-400 text-center mt-2 italic">
                                    AI assistant — not a substitute for medical advice.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Trigger button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 rounded-full bg-teal-600 text-white shadow-2xl flex items-center justify-center relative hover:bg-teal-700 transition-colors"
                    aria-label="Open MedBot"
                >
                    <MessageCircle className="w-8 h-8" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
                </button>
            )}
        </div>
    );
}
