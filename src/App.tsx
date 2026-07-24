import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Heart, Battery, Wifi, Send } from 'lucide-react';

type Sender = 'ocean' | 'mia';
type Message = { id: string; sender: Sender; text: string; time: Date };
type Option = { id: string; text: string; nextNode: string; affectionChange?: number };
type StoryNode = {
  id: string;
  oceanText: string[];
  options?: Option[];
};

const storyNodes: Record<string, StoryNode> = {
  start: {
    id: 'start',
    oceanText: ["Halo sayangku, Mia."],
    options: [
      { id: 'opt1', text: "Iyaaa bey ❤️", nextNode: 'node_thanks', affectionChange: 15 },
      { id: 'opt2', text: "Apasih tumben 😒", nextNode: 'node_tsundere_1', affectionChange: -10 }
    ]
  },
  node_tsundere_1: {
    id: 'node_tsundere_1',
    oceanText: ["Dih jutek amat ayangku wkwk.", "Aku serius nih, cuma mau bilang... terima kasih banyak."],
    options: [
      { id: 'opt3', text: "Terima kasih buat apa? 🤔", nextNode: 'node_good', affectionChange: 5 }
    ]
  },
  node_thanks: {
    id: 'node_thanks',
    oceanText: ["Aku cuma mau bilang... terima kasih banyak."],
    options: [
      { id: 'opt4', text: "Terima kasih buat apa sayang? 🤔", nextNode: 'node_good', affectionChange: 10 }
    ]
  },
  node_good: {
    id: 'node_good',
    oceanText: [
      "Terima kasih karena sudah menjadi wanita yang sangat baik buat aku.",
      "Terima kasih mau nerima aku apa adanya, dengan segala kurang dan lebihku."
    ],
    options: [
      { id: 'opt5', text: "Aaaa kamu juga baik banget 🥺", nextNode: 'node_support', affectionChange: 20 },
      { id: 'opt6', text: "Tumben sadar kalau banyak kurangnya? Wkwk 😜", nextNode: 'node_tsundere_2', affectionChange: -5 }
    ]
  },
  node_tsundere_2: {
    id: 'node_tsundere_2',
    oceanText: [
      "Hahaha iya dong, aku kan sadar diri 🤣",
      "Makanya aku makasih banget kamu selalu support aku di setiap langkahku.",
      "Dan terima kasih udah mencintai aku dengan sangat tulus."
    ],
    options: [
      { id: 'opt7', text: "Iya bey, aku bakal selalu dukung kamu ❤️", nextNode: 'node_special', affectionChange: 25 }
    ]
  },
  node_support: {
    id: 'node_support',
    oceanText: [
      "Terima kasih selalu support aku di setiap langkahku.",
      "Dan terima kasih udah mencintai aku dengan sangat tulus."
    ],
    options: [
      { id: 'opt8', text: "Iya sayang, always ❤️", nextNode: 'node_special', affectionChange: 25 }
    ]
  },
  node_special: {
    id: 'node_special',
    oceanText: [
      "Kamu memberikan cinta yang beda dari semua cewek yang pernah aku temuin.",
      "Kamu itu spesial, dan aku beruntung banget punya kamu."
    ],
    options: [
      { id: 'opt9', text: "I love you too bey 🥺❤️", nextNode: 'node_end', affectionChange: 30 },
      { id: 'opt10', text: "Ah masa sih? Gombal! 🫣", nextNode: 'node_end_tsundere', affectionChange: 5 }
    ]
  },
  node_end_tsundere: {
    id: 'node_end_tsundere',
    oceanText: [
      "Serius sayang, aku nggak gombal.",
      "I love you, now and always. 💖\n\n- Ocean"
    ]
  },
  node_end: {
    id: 'node_end',
    oceanText: [
      "I love you, now and always. 💖\n\n- Ocean"
    ]
  }
};

function App() {
  const [screen, setScreen] = useState<'lock' | 'home' | 'message'>('lock');
  const [time, setTime] = useState(new Date());
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [isOceanTyping, setIsOceanTyping] = useState(false);
  const [activeOptions, setActiveOptions] = useState<Option[]>([]);
  const [showHeart, setShowHeart] = useState(false);
  const [affection, setAffection] = useState(50); // Start at 50%
  const [floatingHearts, setFloatingHearts] = useState<{id:string, points:number}[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Time updater
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOceanTyping, activeOptions]);

  // Story Node Engine
  useEffect(() => {
    if (screen !== 'message') return;

    let isCancelled = false;
    const node = storyNodes[currentNodeId];
    if (!node) return;

    const processOceanMessages = async () => {
      // Clear options while Ocean is typing/sending
      setActiveOptions([]);
      
      for (const text of node.oceanText) {
        if (isCancelled) return;
        
        // Show typing indicator
        setIsOceanTyping(true);
        
        // Delay to simulate typing (longer text = slightly longer delay, between 1.5s - 2.5s)
        const delay = Math.max(1500, Math.min(2500, text.length * 50));
        await new Promise(r => setTimeout(r, delay));
        
        if (isCancelled) return;
        
        // Hide typing and add message
        setIsOceanTyping(false);
        setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'ocean', text, time: new Date() }]);
        
        // Small pause between messages
        await new Promise(r => setTimeout(r, 500));
      }
      
      if (isCancelled) return;
      
      // After all messages from Ocean are sent, show Mia's options or end
      if (node.options && node.options.length > 0) {
        setActiveOptions(node.options);
      } else {
        // Story ends here
        setTimeout(() => setShowHeart(true), 1000);
      }
    };

    processOceanMessages();

    return () => {
      isCancelled = true;
    };
  }, [currentNodeId, screen]);

  const handleOptionClick = (option: Option) => {
    // Update affection
    if (option.affectionChange) {
      setAffection(prev => Math.min(100, Math.max(0, prev + (option.affectionChange || 0))));
      setFloatingHearts(prev => [...prev, { id: Math.random().toString(), points: option.affectionChange || 0 }]);
    }
    
    // Add Mia's choice as a message
    setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'mia', text: option.text, time: new Date() }]);
    // Move to next node
    setCurrentNodeId(option.nextNode);
    setActiveOptions([]); // hide options immediately
  };

  return (
    <div className="w-full h-full sm:w-[400px] sm:h-[800px] bg-slate-900 sm:rounded-[3rem] sm:border-[8px] border-slate-800 relative overflow-hidden shadow-2xl flex flex-col">
      {/* Status Bar */}
      <div className="h-8 w-full px-6 flex justify-between items-center text-xs text-white z-50 absolute top-0 pointer-events-none drop-shadow-md">
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
              className="w-full bg-white/20 backdrop-blur-md rounded-2xl p-4 flex gap-4 cursor-pointer hover:bg-white/30 transition-colors border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
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
            className="absolute inset-0 z-10 bg-cover bg-center flex flex-col"
            style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(88, 28, 135, 0.9)), url("https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?q=80&w=800&auto=format&fit=crop")' }}
          >
            {/* Header with Baper Meter */}
            <div className="px-6 py-3 pt-10 border-b border-white/10 flex flex-col gap-2 bg-slate-900/50 backdrop-blur-md w-full z-20 shadow-md shrink-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-lg relative">
                    O
                    {/* Floating affection points */}
                    <AnimatePresence>
                      {floatingHearts.map(fh => (
                        <motion.div
                          key={fh.id}
                          initial={{ opacity: 1, y: 0, scale: 0.5 }}
                          animate={{ opacity: 0, y: -40, scale: 1.2 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1 }}
                          className={`absolute -top-4 font-bold text-sm ${fh.points > 0 ? 'text-green-400' : 'text-red-400'} drop-shadow-md`}
                          onAnimationComplete={() => setFloatingHearts(prev => prev.filter(p => p.id !== fh.id))}
                        >
                          {fh.points > 0 ? '+' : ''}{fh.points}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div>
                    <h2 className="text-white font-semibold leading-tight">Ocean 🌊</h2>
                    <span className="text-blue-300/80 text-xs">{isOceanTyping ? 'Mengetik pesan...' : 'Online'}</span>
                  </div>
                </div>
                
                {/* Baper Meter */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">Baper Meter</span>
                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
                      initial={{ width: '50%' }}
                      animate={{ width: `${affection}%` }}
                      transition={{ type: 'spring', bounce: 0.3 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chat History Container */}
            <div className="flex-1 w-full overflow-y-auto scroll-smooth scrollbar-hide p-4 pt-6 flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`flex w-full ${msg.sender === 'ocean' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`
                      max-w-[85%] p-4 shadow-xl relative
                      ${msg.sender === 'ocean' 
                        ? 'bg-slate-800/80 backdrop-blur-md border border-white/10 rounded-2xl rounded-tl-sm text-pink-50' 
                        : 'bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl rounded-tr-sm text-white'}
                    `}>
                      <p className="text-[15px] leading-relaxed">
                        {msg.text.split('\n').map((line, i) => (
                          <span key={i}>
                            {line}
                            <br/>
                          </span>
                        ))}
                      </p>
                      <div className={`text-[10px] mt-2 text-right ${msg.sender === 'ocean' ? 'text-white/40' : 'text-pink-100/70'}`}>
                        {msg.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isOceanTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex w-full justify-start"
                  >
                    <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl rounded-tl-sm shadow-md flex gap-1.5 items-center">
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-2 h-2 bg-pink-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-pink-400 rounded-full" />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-pink-400 rounded-full" />
                    </div>
                  </motion.div>
                )}

                {showHeart && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.5 }}
                    className="w-full flex justify-center py-12"
                  >
                    <Heart className="text-pink-500 fill-pink-500 animate-pulse drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]" size={80} />
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} className="h-2 w-full shrink-0" />
            </div>

            {/* Options Panel */}
            <AnimatePresence>
              {activeOptions.length > 0 && (
                <motion.div
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '100%', opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="w-full p-4 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] shrink-0 rounded-t-3xl"
                >
                  <p className="text-center text-xs text-pink-300/60 mb-3 font-medium uppercase tracking-wider">Pilih Balasan Kamu</p>
                  <div className="flex flex-col gap-3">
                    {activeOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleOptionClick(opt)}
                        className="w-full bg-white/5 hover:bg-white/10 active:bg-white/20 border border-white/10 rounded-xl p-4 text-left text-pink-50 font-medium transition-all flex items-center justify-between group"
                      >
                        <span>{opt.text}</span>
                        <Send size={16} className="text-pink-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
