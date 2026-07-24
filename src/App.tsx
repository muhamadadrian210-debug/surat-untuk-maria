import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Heart, Battery, Wifi } from 'lucide-react';

const messageText = `Halo sayangku, Maria Yuniati Thersiana Adoe.

Aku cuma mau bilang... terima kasih banyak.
Terima kasih karena sudah menjadi wanita yang sangat baik buat aku.
Terima kasih mau nerima aku apa adanya, dengan segala kurang dan lebihku.
Terima kasih selalu support aku di setiap langkahku.
Terima kasih udah mencintai aku dengan sangat tulus.

Kamu memberikan cinta yang beda dari semua cewek yang pernah aku temuin.
Kamu itu spesial, dan aku beruntung banget punya kamu.

I love you, now and always. 💖

- Ocean`;

function App() {
  const [screen, setScreen] = useState<'lock' | 'home' | 'message'>('lock');
  const [time, setTime] = useState(new Date());
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (screen === 'message') {
      let i = 0;
      setDisplayedText('');
      const typeTimer = setInterval(() => {
        setDisplayedText(prev => prev + messageText.charAt(i));
        i++;
        if (i >= messageText.length) clearInterval(typeTimer);
      }, 50);
      return () => clearInterval(typeTimer);
    }
  }, [screen]);

  return (
    <div className="w-full h-full sm:w-[400px] sm:h-[800px] bg-slate-900 sm:rounded-[3rem] sm:border-[8px] border-slate-800 relative overflow-hidden shadow-2xl flex flex-col">
      {/* Status Bar */}
      <div className="h-8 w-full px-6 flex justify-between items-center text-xs text-white z-50 absolute top-0">
        <span>{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        <div className="w-32 h-6 bg-black absolute left-1/2 -translate-x-1/2 rounded-b-3xl"></div>
        <div className="flex items-center gap-2">
          <Wifi size={14} />
          <Battery size={16} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {screen === 'lock' && (
          <motion.div 
            key="lock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            className="flex-1 w-full flex flex-col items-center pt-24 bg-cover bg-center"
            style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=600&auto=format&fit=crop")' }}
            onClick={() => setScreen('home')}
          >
            <Lock className="text-white mb-4" size={24} />
            <h1 className="text-6xl font-bold text-white mb-2 tracking-tighter">
              {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </h1>
            <p className="text-slate-200 text-sm">
              {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>

            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-auto mb-12 text-white/70 text-sm"
            >
              Tap to unlock
            </motion.div>
          </motion.div>
        )}

        {screen === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 w-full bg-cover bg-center pt-20 px-4 relative"
            style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url("https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=600&auto=format&fit=crop")' }}
          >
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setScreen('message')}
              className="w-full bg-white/20 backdrop-blur-md rounded-2xl p-4 flex gap-4 cursor-pointer hover:bg-white/30 transition-colors border border-white/10 shadow-lg"
            >
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="text-white" size={24} />
              </div>
              <div className="flex-1 text-white">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold">Ocean 🌊</h3>
                  <span className="text-xs text-white/70">Now</span>
                </div>
                <p className="text-sm text-white/90 line-clamp-2">Ada pesan rahasia buat kamu sayang...</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {screen === 'message' && (
          <motion.div 
            key="message"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex-1 w-full bg-slate-900 pt-16 flex flex-col"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3 bg-slate-800/50">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">O</div>
              <div>
                <h2 className="text-white font-semibold leading-tight">Ocean 🌊</h2>
                <span className="text-blue-400 text-xs">Online</span>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-slate-800 rounded-2xl rounded-tl-none p-5 text-slate-200 text-[15px] leading-relaxed shadow-xl border border-white/5 whitespace-pre-wrap">
                {displayedText}
                {displayedText.length === messageText.length && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-6 flex justify-center"
                  >
                    <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={48} />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
