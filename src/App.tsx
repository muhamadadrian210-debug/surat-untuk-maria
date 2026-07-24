import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Heart, Battery, Wifi, ChevronDown } from 'lucide-react';

const sentences = [
  "Halo sayangku, Maria Yuniati Thersiana Adoe.",
  "Aku cuma mau bilang... terima kasih banyak.",
  "Terima kasih karena sudah menjadi wanita yang sangat baik buat aku.",
  "Terima kasih mau nerima aku apa adanya, dengan segala kurang dan lebihku.",
  "Terima kasih selalu support aku di setiap langkahku.",
  "Terima kasih udah mencintai aku dengan sangat tulus.",
  "Kamu memberikan cinta yang beda dari semua cewek yang pernah aku temuin.",
  "Kamu itu spesial, dan aku beruntung banget punya kamu.",
  "I love you, now and always. 💖\n\n- Ocean"
];

const animations = [
  { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 } },
  { initial: { opacity: 0, scale: 0.5 }, whileInView: { opacity: 1, scale: 1 } },
  { initial: { opacity: 0, x: -100 }, whileInView: { opacity: 1, x: 0 } },
  { initial: { opacity: 0, x: 100 }, whileInView: { opacity: 1, x: 0 } },
  { initial: { opacity: 0, rotate: -10 }, whileInView: { opacity: 1, rotate: 0 } },
  { initial: { opacity: 0, rotate: 10 }, whileInView: { opacity: 1, rotate: 0 } },
  { initial: { opacity: 0, scale: 1.2 }, whileInView: { opacity: 1, scale: 1 } },
  { initial: { opacity: 0, y: -50 }, whileInView: { opacity: 1, y: 0 } },
  { initial: { opacity: 0, scale: 0.8 }, whileInView: { opacity: 1, scale: 1 } },
];

function App() {
  const [screen, setScreen] = useState<'lock' | 'home' | 'message'>('lock');
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full sm:w-[400px] sm:h-[800px] bg-slate-900 sm:rounded-[3rem] sm:border-[8px] border-slate-800 relative overflow-hidden shadow-2xl flex flex-col">
      {/* Status Bar */}
      <div className="h-8 w-full px-6 flex justify-between items-center text-xs text-white z-50 absolute top-0 pointer-events-none">
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
            className="flex-1 w-full flex flex-col items-center pt-24 bg-cover bg-center cursor-pointer"
            style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=600&auto=format&fit=crop")' }}
            onClick={() => setScreen('home')}
          >
            <Lock className="text-white mb-4" size={24} />
            <h1 className="text-6xl font-bold text-white mb-2 tracking-tighter drop-shadow-lg">
              {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </h1>
            <p className="text-slate-200 text-sm drop-shadow-md">
              {time.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>

            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-auto mb-12 text-white/90 text-sm font-medium tracking-wide bg-black/30 px-6 py-2 rounded-full backdrop-blur-sm"
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
              className="w-full bg-white/20 backdrop-blur-md rounded-2xl p-4 flex gap-4 cursor-pointer hover:bg-white/30 transition-colors border border-white/10 shadow-2xl"
            >
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <Mail className="text-white" size={24} />
              </div>
              <div className="flex-1 text-white">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-pink-100">Ocean 🌊</h3>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 bg-cover bg-center"
            style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.6), rgba(88, 28, 135, 0.8)), url("https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?q=80&w=800&auto=format&fit=crop")' }}
          >
            {/* Header */}
            <div className="px-6 py-4 pt-12 border-b border-white/10 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md absolute top-0 w-full z-20 shadow-md">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">O</div>
              <div>
                <h2 className="text-white font-semibold leading-tight">Ocean 🌊</h2>
                <span className="text-blue-400 text-xs">Mengetik pesan...</span>
              </div>
            </div>
            
            {/* Scrollable Story Container */}
            <div className="h-full w-full overflow-y-auto scroll-smooth snap-y snap-mandatory scrollbar-hide">
              {sentences.map((text, index) => {
                const anim = animations[index % animations.length];
                
                return (
                  <div key={index} className="h-full w-full shrink-0 snap-start snap-always flex flex-col items-center justify-center p-8 pt-24 relative">
                    <motion.div 
                      initial={anim.initial}
                      whileInView={anim.whileInView}
                      viewport={{ once: false, margin: "-50px" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="w-full flex justify-start"
                    >
                      <div className="bg-slate-800/70 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] rounded-tl-sm shadow-2xl max-w-[90%] text-left">
                        <h2 className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                          {text.split('\n').map((line, i) => (
                            <span key={i}>
                              {line}
                              <br/>
                            </span>
                          ))}
                        </h2>
                        <div className="text-xs text-white/50 text-right mt-3 font-mono tracking-wider">
                          {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Scroll Indicator (Only on first screen) */}
                    {index === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute bottom-12 flex flex-col items-center text-pink-300/60"
                      >
                        <span className="text-xs tracking-widest uppercase mb-2">Scroll ke bawah</span>
                        <motion.div
                          animate={{ y: [0, 10, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <ChevronDown size={24} />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Final Heart (Only on last screen) */}
                    {index === sentences.length - 1 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.5, type: 'spring', bounce: 0.5 }}
                        className="mt-12"
                      >
                        <Heart className="text-pink-500 fill-pink-500 animate-pulse drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" size={64} />
                      </motion.div>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
