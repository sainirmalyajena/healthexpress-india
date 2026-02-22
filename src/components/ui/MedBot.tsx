'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

export function MedBot({ lang }: { lang: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: lang === 'hi' ? 'नमस्ते! मैं मेडबॉट हूं। मैं आपकी सर्जरी और स्वास्थ्य संबंधी सवालों में कैसे मदद कर सकता हूं?' : "Hello! I'm MedBot. How can I help you with your surgery or health-related questions today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
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
                    history: messages.slice(1).map(m => ({
                        role: m.role === 'bot' ? 'assistant' : 'user',
                        content: m.content
                    }))
                })
            });

            const data = await response.json();
            if (data.text) {
                setMessages(prev => [...prev, { role: 'bot', content: data.text }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: "Oops! Something went wrong. Please check your connection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-44 right-6 md:bottom-6 md:right-24 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            height: isMinimized ? '60px' : '500px'
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={clsx(
                            "bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden flex flex-col transition-all duration-300 mb-4",
                            "w-[350px] md:w-[400px]"
                        )}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-4 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">MedBot Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                        <span className="text-[10px] text-teal-100 uppercase tracking-wider font-medium">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div
                                    ref={scrollRef}
                                    className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
                                >
                                    {messages.map((m, i) => (
                                        <div key={i} className={clsx(
                                            "flex flex-col",
                                            m.role === 'user' ? "items-end" : "items-start"
                                        )}>
                                            <div className={clsx(
                                                "max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed",
                                                m.role === 'user'
                                                    ? "bg-teal-600 text-white rounded-tr-none shadow-md"
                                                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm"
                                            )}>
                                                {m.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex items-start">
                                            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                                                <div className="flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce"></span>
                                                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input */}
                                <div className="p-4 bg-white border-t border-slate-100">
                                    <div className="relative flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder={lang === 'hi' ? "अपना सवाल यहाँ लिखें..." : "Ask me anything..."}
                                            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-teal-500/20 text-sm outline-none"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!input.trim() || isLoading}
                                            className="absolute right-1.5 p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all disabled:opacity-50 disabled:grayscale"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-400 text-center mt-3 px-2 italic">
                                        HealthExpress AI can make mistakes. For official advice, please consult our doctors.
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={clsx(
                    "w-16 h-16 rounded-full bg-teal-600 text-white shadow-2xl flex items-center justify-center relative overflow-hidden group",
                    isOpen && "hidden"
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <MessageCircle className="w-8 h-8 relative z-10" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
            </motion.button>
        </div>
    );
}
