"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Send, ShoppingBag, Loader2, LayoutDashboard, BarChart3, Building2, FileText, Monitor, Bell, Flame, Package, List, MessageCircle, ArrowLeft, History, Star, ExternalLink, ThumbsUp, Mic, MicOff, Moon, Sun } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../components/ThemeProvider';

export default function ChatInterface({ user, onLogout }) {
    const [messages, setMessages] = useState([
        {
            type: 'bot', text: `Hi ${user.name.split(' ')[0]}! I'm Mobo. Ready to loot some deals? Ask me for "New Deals" or "Review Deals".`, options: []
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const { theme } = useTheme();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text = input) => {
        if (!text.trim()) return;

        // Add User Message
        const newMessages = [...messages, { type: 'user', text }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await axios.post(`${API_URL}/api/chat/message`, {
                message: text,
                userId: user._id
            });

            const botResponse = res.data;

            // Add Bot Message
            setMessages(prev => [...prev, {
                type: 'bot',
                text: botResponse.text,
                data: botResponse.data,
                dataType: botResponse.type, // DEALS, ORDERS, PAYMENT, MENU
                options: botResponse.type === 'UNKNOWN' || botResponse.type === 'MENU' ? botResponse.data : null
            }]);

        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { type: 'bot', text: "Sorry, something went wrong. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const startVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(transcript); // Auto-send for smoother experience
            };

            recognition.start();
        } else {
            alert("Voice input is not supported in this browser.");
        }
    };

    const QuickActionChip = ({ icon: Icon, label, color, onClick }) => (
        <button
            onClick={onClick}
            className="group flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-zinc-900 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out transform hover:-translate-y-1 border border-transparent hover:border-lime-500/20 active:scale-95"
        >
            <div className={`p-1 rounded-full bg-gray-50 dark:bg-zinc-800 transition-colors group-hover:bg-${color.split('-')[1]}-50 dark:group-hover:bg-${color.split('-')[1]}-900/20`}>
                <Icon size={14} className={`${color} transition-transform group-hover:scale-110`} fill="currentColor" fillOpacity={0.2} />
            </div>
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-white dark:bg-zinc-950 text-foreground transition-colors duration-500 font-sans selection:bg-lime-500/30">
            {/* Main Content - Full Screen */}
            <div className="flex-1 flex flex-col h-full relative w-full overflow-hidden">

                {/* Header */}
                <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800/50 px-6 py-4 flex justify-between items-center z-10 sticky top-0 h-20 shadow-sm transition-all duration-300">
                    <button onClick={onLogout} className="p-3 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-300 hover:rotate-90 active:scale-90">
                        <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>

                    <div className="flex flex-col items-center cursor-default group">
                        <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-105">
                            <div className="relative">
                                <div className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-pulse relative z-10"></div>
                                <div className="absolute inset-0 bg-lime-500 rounded-full animate-ping opacity-20"></div>
                            </div>
                            <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Mobo Deal Bot</h1>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">Online</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-all duration-300 hover:rotate-12 active:scale-90 relative">
                            <History className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white font-bold text-xs border-[3px] border-white dark:border-zinc-900 shadow-md transform hover:scale-110 transition-transform duration-300 cursor-pointer">
                            {user.name[0]}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth bg-[#FAFAFA] dark:bg-zinc-950 scrollbar-hide">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-backwards`}>
                            {msg.type === 'bot' && (
                                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-500 flex items-center justify-center mr-3 mt-auto shadow-lg shadow-lime-500/20 transform hover:scale-110 transition-transform duration-300">
                                    <Monitor size={18} className="text-white mix-blend-hard-light" />
                                </div>
                            )}

                            <div className={`max-w-[85%] md:max-w-[70%] ${msg.type === 'user' ? 'bg-black dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-[28px] rounded-br-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)]' : 'bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 rounded-[28px] rounded-bl-sm border border-gray-100 dark:border-zinc-800 shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.08)]'} p-6 relative group transition-all duration-300`}>
                                <p className="leading-relaxed text-[15px] font-medium whitespace-pre-line tracking-wide">{msg.text}</p>

                                {/* Timestamp */}
                                <span className={`text-[10px] absolute bottom-3 right-5 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${msg.type === 'user' ? 'text-gray-400' : 'text-gray-400'}`}>
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>

                                {/* Render Rich Content */}
                                {msg.dataType === 'DEALS' && msg.data && (
                                    <div className="mt-6 flex gap-5 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2 snap-x py-2">
                                        {msg.data.map((deal, i) => (
                                            <div key={i} className="min-w-[280px] max-w-[280px] snap-center bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500 ease-out group/card relative">

                                                {/* Store Badge */}
                                                <div className="absolute top-4 right-4 z-10 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm border border-gray-100 dark:border-zinc-700 flex items-center gap-1.5 transform group-hover/card:scale-105 transition-transform">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                                                    {i % 2 === 0 ? 'Amazon' : 'Flipkart'}
                                                </div>

                                                <div className="h-52 bg-gradient-to-b from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 relative p-6 flex items-center justify-center overflow-hidden">
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/80 to-transparent dark:from-zinc-700/30 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"></div>
                                                    <img src={deal.imageURL} alt={deal.title} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover/card:scale-110 z-10 drop-shadow-xl" />

                                                    {/* Flash Sale Tag */}
                                                    {i === 1 && (
                                                        <div className="absolute bottom-4 left-4 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 animate-pulse">
                                                            <Flame size={12} fill="currentColor" /> Flash Sale!
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 text-[15px] group-hover/card:text-black dark:group-hover/card:text-white transition-colors">{deal.title}</h3>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 mb-4">
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <Star key={star} size={10} className={`${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-zinc-700'}`} />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1">4.{8 - i}</span>
                                                        <span className="text-[10px] text-gray-400">• 1.2k ratings</span>
                                                    </div>

                                                    <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-4 mb-5 border border-gray-100 dark:border-zinc-800/50">
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-xl font-black text-gray-900 dark:text-white">₹{parseInt(deal.price.replace(/\D/g, '')) || 999}</span>
                                                            <span className="text-xs text-gray-400 line-through decoration-red-400/50">₹{parseInt(deal.price.replace(/\D/g, '')) * 1.5 || 1499}</span>
                                                            <span className="text-[10px] font-bold text-green-600 ml-auto bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">50% OFF</span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-500 mt-2 line-clamp-1 font-medium">{deal.description}</p>
                                                    </div>

                                                    <button className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-xs tracking-wide hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                                                        <ExternalLink size={14} /> GET LINK / DM
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {msg.dataType === 'ORDERS' && msg.data && (
                                    <div className="mt-4 space-y-4">
                                        {msg.data.map((order, i) => (
                                            <div key={i} className="bg-white dark:bg-zinc-900 p-5 rounded-[24px] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group/order hover:-translate-y-1">
                                                {/* Status Badge */}
                                                <div className="absolute top-0 right-0 bg-lime-50 dark:bg-lime-900/20 text-lime-700 dark:text-lime-300 px-4 py-1.5 rounded-bl-2xl text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                                                    Review Submitted
                                                </div>

                                                <div className="flex gap-5 mt-2">
                                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center border border-gray-100 dark:border-zinc-700 shadow-inner">
                                                        <Package size={24} className="text-gray-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID #{order._id ? order._id.slice(-6) : '3513'}</span>
                                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm mt-1 line-clamp-1">{order.productName}</h4>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 flex justify-between items-end">
                                                            <div>
                                                                <p className="text-[10px] text-gray-400 font-medium">Qty 1</p>
                                                                <p className="font-black text-gray-900 dark:text-white mt-0.5">₹899.00</p>
                                                            </div>
                                                            <span className="px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold flex items-center gap-1">
                                                                <ThumbsUp size={10} /> Paid
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {msg.dataType === 'PAYMENT' && msg.data && (
                                    <div className="mt-4 bg-white dark:bg-zinc-900 rounded-[24px] border border-gray-100 dark:border-zinc-800 p-2 shadow-sm">
                                        <table className="w-full text-sm">
                                            <thead className="text-[10px] text-gray-400 uppercase bg-gray-50 dark:bg-zinc-800/50">
                                                <tr>
                                                    <th className="px-4 py-3 font-bold text-left rounded-tl-xl rounded-bl-xl">Order</th>
                                                    <th className="px-4 py-3 font-bold text-right rounded-tr-xl rounded-br-xl">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {msg.data.map((pay, i) => (
                                                    <tr key={i} className="group/row transition-colors hover:bg-gray-50/50 dark:hover:bg-zinc-800/30">
                                                        <td className="px-4 py-3 border-b border-gray-50 dark:border-zinc-800 group-last/row:border-0 transition-colors">
                                                            <div className="font-bold text-gray-900 dark:text-white group-hover/row:text-black dark:group-hover/row:text-white">{pay.orderId}</div>
                                                            <div className="text-[10px] text-gray-400 mt-0.5">Amount: ₹{pay.amountPaid}</div>
                                                        </td>
                                                        <td className="px-4 py-3 text-right border-b border-gray-50 dark:border-zinc-800 group-last/row:border-0 transition-colors">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-transform group-hover/row:scale-105 ${pay.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${pay.status === 'Paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                                {pay.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-lime-400 to-lime-500 flex items-center justify-center mr-3 mt-auto shadow-lg shadow-lime-500/20">
                                <Monitor size={18} className="text-white mix-blend-hard-light animate-pulse" />
                            </div>
                            <div className="bg-white dark:bg-zinc-900 p-6 rounded-[28px] rounded-bl-sm shadow-md border border-gray-100 dark:border-zinc-800 flex items-center gap-3">
                                <span className="flex gap-1.5">
                                    <span className="w-2 h-2 bg-lime-500 rounded-full animate-bounce delay-0"></span>
                                    <span className="w-2 h-2 bg-lime-500 rounded-full animate-bounce delay-150"></span>
                                    <span className="w-2 h-2 bg-lime-500 rounded-full animate-bounce delay-300"></span>
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Floating Action Chips & Input */}
                {/* Floating Action Chips & Input */}
                <div className="bg-[#FAFAFA]/90 dark:bg-zinc-950/90 backdrop-blur-xl p-3 sticky bottom-0 z-20 border-t border-transparent dark:border-zinc-800/30">
                    {/* Floating Chips */}
                    <div className="flex justify-center gap-3 mb-3 overflow-x-auto py-1 scrollbar-hide px-2">
                        <QuickActionChip icon={Flame} label="New Deals" color="text-orange-500" onClick={() => handleSend("Show me new deals")} />
                        <QuickActionChip icon={Package} label="Orders" color="text-amber-600" onClick={() => handleSend("Order history")} />
                        <QuickActionChip icon={List} label="Status" color="text-blue-500" onClick={() => handleSend("Payment status")} />
                        <QuickActionChip icon={MessageCircle} label="Other" color="text-purple-500" onClick={() => handleSend("Help")} />
                    </div>

                    <div className={`relative max-w-2xl mx-auto rounded-[28px] transition-all duration-300 ${isListening ? 'ring-4 ring-red-500/20 shadow-[0_10px_40px_rgba(239,68,68,0.2)]' : 'shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_15px_40px_rgb(0,0,0,0.12)] focus-within:ring-4 focus-within:ring-lime-500/10 focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.12)]'} bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800`}>
                        <div className="flex items-center pr-2">
                            <div className="pl-5 py-3 flex-1 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={isListening ? "Listening..." : "Ask for 'Review Deals'..."}
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none text-gray-900 dark:text-white placeholder:text-gray-400 text-base font-medium"
                                />
                            </div>

                            {/* Voice Button */}
                            <button
                                onClick={startVoiceSearch}
                                className={`p-2.5 rounded-full transition-all duration-300 mr-1 ${isListening ? 'bg-red-500 text-white animate-pulse scale-110' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800'}`}
                            >
                                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>

                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || loading}
                                className="bg-black dark:bg-white text-white dark:text-black p-2.5 rounded-full hover:scale-110 active:scale-90 transition-all duration-300 disabled:opacity-50 disabled:scale-100 shadow-lg hover:shadow-xl"
                            >
                                <Send size={18} className={loading ? 'opacity-0' : 'opacity-100 transition-opacity'} />
                                {loading && <Loader2 size={18} className="absolute inset-0 m-auto animate-spin" />}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition shadow-sm">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
}
