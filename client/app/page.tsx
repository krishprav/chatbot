"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Phone, User, MapPin, Mail, ArrowRight, Loader2, Bot, ChevronRight, Lock, Moon, Sun } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';
import { useTheme } from '../components/ThemeProvider';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-accent transition shadow-sm">
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
export default function Home() {
  const [step, setStep] = useState('LANDING'); // LANDING, PHONE, REGISTER, CHAT
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    email: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/auth/check-user`, { phone: formData.phone });
      if (res.data.exists) {
        setUser(res.data.user);
        setStep('CHAT');
      } else {
        setStep('REGISTER');
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/auth/register`, formData);
      setUser(res.data.user);
      setStep('CHAT');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setStep('LANDING'); // Go back to landing on logout
    setFormData({ phone: '', name: '', email: '', address: '' });
  };

  if (step === 'CHAT') {
    return <ChatInterface user={user} onLogout={handleLogout} />;
  }

  // Mobo Bot Landing Screen
  if (step === 'LANDING') {
      return (
          <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-black text-white relative overflow-hidden">
              {/* Green Glow Effects */}
              <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-lime-400/20 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-lime-500/10 rounded-full blur-[100px]"></div>

              <div className="z-10 flex flex-col items-center text-center space-y-8 max-w-lg w-full">
                  <div className="w-20 h-20 bg-lime-400 rounded-[28px] flex items-center justify-center shadow-[0_0_40px_rgba(163,230,53,0.5)] mb-4">
                      <Bot size={40} className="text-black" strokeWidth={2.5} />
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
                      Best <span className="text-lime-400 bg-white/5 px-2 rounded-lg inline-block transform -rotate-1">Personal</span><br />
                      <span className="text-lime-400">AI Assistant</span>
                  </h1>
                  
                  <p className="text-gray-400 text-lg md:text-xl font-medium max-w-sm mx-auto leading-relaxed">
                      Experience the future of shopping with your own intelligent companion.
                  </p>

                  <div className="w-full pt-10">
                      <button 
                          onClick={() => setStep('PHONE')}
                          className="group w-full bg-white text-black py-5 rounded-full font-bold text-xl hover:bg-lime-400 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-2xl"
                      >
                          Start a new chat
                          <div className="bg-black text-white p-1 rounded-full group-hover:bg-black/20 group-hover:text-black transition-colors">
                            <ArrowRight size={20} />
                          </div>
                      </button>
                      <p className="text-gray-600 text-xs mt-6 font-medium tracking-widest uppercase">v1.2.0 • Powered by Mobo Logic</p>
                  </div>
              </div>
          </main>
      );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground transition-colors duration-300 theme-transition">
      <div className="absolute top-4 right-4">
         <ThemeToggle />
      </div>
      
      {/* Login / Register Container */}
      <div className="w-full max-w-[420px]">
        
        {step === 'PHONE' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="space-y-2">
                    <button onClick={() => setStep('LANDING')} className="bg-secondary/50 p-2 rounded-full hover:bg-secondary transition mb-4">
                        <ArrowRight className="rotate-180 w-5 h-5" />
                    </button>
                    <h1 className="text-4xl font-black tracking-tight">Welcome Back</h1>
                    <p className="text-muted-foreground text-lg">Let's get you signed in.</p>
                </div>

                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <div className="absolute left-4 top-4 text-muted-foreground group-focus-within:text-foreground transition-colors">
                                <Mail className="w-6 h-6" />
                            </div>
                            <input
                                type="text"
                                disabled
                                value="demo@mobo.bot"
                                className="w-full pl-14 pr-4 py-4 bg-secondary/30 border-none rounded-2xl text-lg font-medium text-muted-foreground cursor-not-allowed"
                            />
                        </div>
                        <div className="bg-lime-500/10 border border-lime-500/20 p-3 rounded-xl flex items-center justify-center gap-2 mb-2">
                             <p className="text-lime-700 dark:text-lime-400 text-xs font-bold uppercase tracking-wider">Demo Number: 9999999999</p>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-4 top-4 text-muted-foreground group-focus-within:text-primary transition-colors">
                                <Lock className="w-6 h-6" />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                required
                                autoFocus
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full pl-14 pr-4 py-4 bg-secondary/30 hover:bg-secondary/50 focus:bg-background border-2 border-transparent focus:border-black/5 dark:focus:border-white/10 rounded-2xl outline-none transition-all font-bold text-xl placeholder:text-muted-foreground/40 tracking-widest text-center"
                                placeholder="• • • • • • • • • •"
                            />
                            <p className="text-xs text-center text-muted-foreground mt-2">Enter phone (e.g. 9999)</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#161C24] dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-muted-foreground font-medium">Don't have an account? <span className="text-lime-600 dark:text-lime-400 font-bold cursor-pointer hover:underline">Register</span></p>
                </div>
            </div>
        )}

        {step === 'REGISTER' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="space-y-2">
                 <button onClick={() => setStep('PHONE')} className="bg-secondary/50 p-2 rounded-full hover:bg-secondary transition mb-4">
                     <ArrowRight className="rotate-180 w-5 h-5" />
                 </button>
                 <h1 className="text-3xl font-black">Create Account</h1>
                 <p className="text-muted-foreground">New number detected. Join us!</p>
             </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-secondary/30 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-lime-500/20 focus:bg-background transition-all"
                  placeholder="Full Name"
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-secondary/30 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-lime-500/20 focus:bg-background transition-all"
                  placeholder="Email Address"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-secondary/30 rounded-2xl font-medium outline-none focus:ring-2 focus:ring-lime-500/20 focus:bg-background transition-all"
                  placeholder="Delivery Address"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-lime-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-lime-600 transition-all shadow-lg mt-4"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Complete Registration"}
              </button>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}


