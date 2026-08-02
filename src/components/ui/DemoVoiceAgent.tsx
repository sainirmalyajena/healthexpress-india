'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, PhoneCall, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DemoVoiceAgent() {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [history, setHistory] = useState<any[]>([]);
    
    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesis>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthesisRef.current = window.speechSynthesis;
            // @ts-ignore
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = true;
                
                recognitionRef.current.onresult = (event: any) => {
                    const current = event.resultIndex;
                    const result = event.results[current][0].transcript;
                    setTranscript(result);
                };

                recognitionRef.current.onend = async () => {
                    if (isListening && transcript.trim() !== '') {
                        setIsListening(false);
                        await handleSend(transcript);
                    } else if (isListening) {
                        recognitionRef.current?.start(); // Restart if no input
                    }
                };
            }
        }
    }, [isListening, transcript]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            setTranscript('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleSend = async (text: string) => {
        if (!text.trim()) return;
        
        setIsSpeaking(true);
        setHistory(prev => [...prev, { role: 'Patient', text }]);

        try {
            const res = await fetch('/api/ai/demo-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history })
            });
            const data = await res.json();
            
            setHistory(prev => [...prev, { role: 'Sarah', text: data.text }]);
            speakText(data.text);
            
            if (data.booked) {
                setTimeout(() => {
                    alert('🎉 Appointment successfully saved to Database!');
                }, 2000);
            }
        } catch (e) {
            console.error(e);
            setIsSpeaking(false);
        }
    };

    const speakText = (text: string) => {
        if (!synthesisRef.current) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = synthesisRef.current.getVoices().find(v => v.name.includes('Female') || v.name.includes('Google US English')) || null;
        utterance.rate = 1.0;
        
        utterance.onend = () => {
            setIsSpeaking(false);
            setTranscript('');
            // Auto start listening again for next response
            if (isOpen) {
                setIsListening(true);
                recognitionRef.current?.start();
            }
        };
        
        synthesisRef.current.speak(utterance);
    };

    const startConversation = () => {
        setIsOpen(true);
        const greeting = "Hello, this is Sarah from HealthExpress India. Are you looking to book an OPD appointment today?";
        setHistory([{ role: 'Sarah', text: greeting }]);
        setIsSpeaking(true);
        speakText(greeting);
    };

    const closeConversation = () => {
        setIsOpen(false);
        setIsListening(false);
        setIsSpeaking(false);
        recognitionRef.current?.stop();
        synthesisRef.current?.cancel();
    };

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-white rounded-2xl shadow-2xl w-[320px] overflow-hidden border border-gray-100"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <PhoneCall className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Sarah (AI)</h3>
                                    <p className="text-xs text-white/80">Voice Assistant</p>
                                </div>
                            </div>
                            <button onClick={closeConversation} className="p-1 hover:bg-white/20 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 flex flex-col items-center justify-center h-[200px] bg-gray-50">
                            {isSpeaking ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-2 h-12">
                                        {[1, 2, 3, 4].map(i => (
                                            <motion.div
                                                key={i}
                                                className="w-2 bg-blue-500 rounded-full"
                                                animate={{ height: ['20%', '100%', '20%'] }}
                                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">Sarah is speaking...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4 w-full">
                                    <button 
                                        onClick={toggleListening}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                        {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
                                    </button>
                                    <p className="text-sm text-center text-gray-600 h-10">
                                        {isListening ? (transcript || 'Listening...') : 'Tap mic to speak'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <button
                    onClick={startConversation}
                    className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all flex items-center gap-3 group"
                >
                    <div className="bg-white/20 p-2 rounded-full group-hover:animate-pulse">
                        <PhoneCall className="w-6 h-6" />
                    </div>
                    <span className="font-bold pr-2">Call AI Demo</span>
                </button>
            )}
        </div>
    );
}
