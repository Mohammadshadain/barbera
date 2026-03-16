import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Scissors, Calendar, Clock, User, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useAuth } from '../context/AuthContext';
import { format, addDays, isSameDay, startOfDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, addMonths } from 'date-fns';

const AIChatConcierge = () => {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm Barbera, your digital concierge. How can I help you look your best today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Booking State
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [bookingStep, setBookingStep] = useState(0); // 0: none, 1: service, 2: barber, 3: date/slot, 4: confirm
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await fetch('/api/services');
        if (!servicesRes.ok) throw new Error('Failed to fetch services');
        const servicesDataRaw = await servicesRes.json();
        let servicesData = Array.isArray(servicesDataRaw) ? servicesDataRaw : [];
        
        const barbersRes = await fetch('/api/barbers');
        if (!barbersRes.ok) throw new Error('Failed to fetch barbers');
        const barbersDataRaw = await barbersRes.json();
        let barbersData = Array.isArray(barbersDataRaw) ? barbersDataRaw : [];

        // Fallback data if DB is empty
        if (servicesData.length === 0) {
          servicesData = [
            { id: 's1', name: 'Signature Haircut', price: 45, duration: 45, description: 'Our master barbers provide a precision cut tailored to your head shape and style.', photoURL: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800' },
            { id: 's2', name: 'Beard Sculpting', price: 30, duration: 30, description: 'Complete beard grooming including shaping, trimming, and hot towel finish.', photoURL: 'https://images.unsplash.com/photo-1621605815841-aa88c82b0248?auto=format&fit=crop&q=80&w=800' },
            { id: 's3', name: 'Premium Headwash', price: 25, duration: 20, description: 'Relaxing scalp massage and deep cleansing with premium organic products.', photoURL: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800' },
            { id: 's4', name: 'Hair Coloring', price: 55, duration: 60, description: 'Professional hair coloring with premium products.', photoURL: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800' },
            { id: 's5', name: 'Kids Haircut', price: 20, duration: 25, description: 'Stylish and comfortable haircuts for kids.', photoURL: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800' },
            { id: 's6', name: 'Hair & Beard Combo', price: 60, duration: 60, description: 'Complete grooming package including haircut and beard styling.', photoURL: 'https://images.unsplash.com/photo-1593702295094-ada74bc4a149?auto=format&fit=crop&q=80&w=800' },
            { id: 's7', name: 'Luxury Shave', price: 35, duration: 30, description: 'Traditional hot towel shave with premium grooming products.', photoURL: 'https://images.unsplash.com/photo-1503951458645-643d53efd90f?auto=format&fit=crop&q=80&w=800' },
            { id: 's8', name: 'Scalp Treatment', price: 40, duration: 35, description: 'Deep scalp treatment for healthy hair and relaxation.', photoURL: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800' }
          ];
        }

        if (barbersData.length === 0) {
          barbersData = [
            { id: 'b1', name: 'Alex', speciality: 'Fade Specialist', experience: '8+ Years', photoURL: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800' },
            { id: 'b2', name: 'David', speciality: 'Classic Cuts', experience: '12+ Years', photoURL: 'https://images.unsplash.com/photo-1512690196252-741d2fd36ad0?auto=format&fit=crop&q=80&w=800' },
            { id: 'b3', name: 'Marcus', speciality: 'Beard Styling', experience: '6+ Years', photoURL: 'https://images.unsplash.com/photo-1622286332618-f2802b9c74bc?auto=format&fit=crop&q=80&w=800' }
          ];
        }

        setServices(servicesData);
        setBarbers(barbersData);
      } catch (error) {
        console.error("Error fetching chat data:", error);
        // Fallback mock data on error
        setServices([
          { id: 's1', name: 'Signature Haircut', price: 45, duration: 45, description: 'Our master barbers provide a precision cut tailored to your head shape and style.', photoURL: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800' },
          { id: 's2', name: 'Beard Sculpting', price: 30, duration: 30, description: 'Complete beard grooming including shaping, trimming, and hot towel finish.', photoURL: 'https://images.unsplash.com/photo-1621605815841-aa88c82b0248?auto=format&fit=crop&q=80&w=800' },
          { id: 's3', name: 'Premium Headwash', price: 25, duration: 20, description: 'Relaxing scalp massage and deep cleansing with premium organic products.', photoURL: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800' }
        ]);
        setBarbers([
          { id: 'b1', name: 'Alex', speciality: 'Fade Specialist', experience: '8+ Years', photoURL: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800' },
          { id: 'b2', name: 'David', speciality: 'Classic Cuts', experience: '12+ Years', photoURL: 'https://images.unsplash.com/photo-1512690196252-741d2fd36ad0?auto=format&fit=crop&q=80&w=800' },
          { id: 'b3', name: 'Marcus', speciality: 'Beard Styling', experience: '6+ Years', photoURL: 'https://images.unsplash.com/photo-1622286332618-f2802b9c74bc?auto=format&fit=crop&q=80&w=800' }
        ]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };

    const handleStartBooking = (e) => {
      const { service } = e.detail || {};
      
      // Reset booking state for new flow
      setBookingStep(0);
      setSelectedService(null);
      setSelectedBarber(null);
      setSelectedSlot(null);

      setIsOpen(true);

      if (service) {
        handleServiceSelect(service, true);
      } else {
        startBookingFlow();
      }
    };
    
    window.addEventListener('open-concierge', handleOpen);
    window.addEventListener('start-booking', handleStartBooking);
    
    return () => {
      window.removeEventListener('open-concierge', handleOpen);
      window.removeEventListener('start-booking', handleStartBooking);
    };
  }, [services, barbers]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startBookingFlow = () => {
    setBookingStep(1);
    setMessages(prev => [...prev, { 
      role: 'ai', 
      text: "Great! Let's get you booked. First, which service would you like?",
      type: 'service'
    }]);
  };

  const handleServiceSelect = (service, isInitial = false) => {
    setSelectedService(service);
    setBookingStep(2);
    const userText = isInitial ? `Hi, I want to book a ${service.name}.` : `I'd like the ${service.name}`;
    setMessages(prev => [...prev, 
      { role: 'user', text: userText },
      { role: 'ai', text: `Excellent choice. Who would you like to handle your ${service.name}?`, type: 'barber' }
    ]);
  };

  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
    setBookingStep(3);
    setMessages(prev => [...prev, 
      { role: 'user', text: `I'd like to book with ${barber.name}` },
      { role: 'ai', text: `Perfect. ${barber.name} is a master. When would you like to come in?`, type: 'date' }
    ]);
  };

  const [viewDate, setViewDate] = useState(new Date());

  const handleDateSelect = (date) => {
    setSelectedDate(startOfDay(date));
    setSelectedSlot(null);
  };

  const renderCalendar = () => {
    const start = startOfMonth(viewDate);
    const end = endOfMonth(viewDate);
    const days = eachDayOfInterval({ start: startOfWeek(start), end: endOfWeek(end) });
    const today = startOfDay(new Date());

    return (
      <div className="space-y-3 bg-white/5 p-3 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <button 
            onClick={() => setViewDate(addMonths(viewDate, -1))}
            disabled={isSameMonth(viewDate, today)}
            className="p-1 hover:bg-white/10 rounded-lg disabled:opacity-20"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold uppercase tracking-widest">{format(viewDate, 'MMMM yyyy')}</span>
          <button 
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            className="p-1 hover:bg-white/10 rounded-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <span key={d} className="text-[10px] font-bold text-slate-500">{d}</span>
          ))}
          {days.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const isPast = day < today;
            const isCurrentMonth = isSameMonth(day, viewDate);
            
            return (
              <button
                key={i}
                disabled={isPast || !isCurrentMonth}
                onClick={() => handleDateSelect(day)}
                className={`aspect-square flex items-center justify-center text-xs rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-primary text-background-dark font-bold' 
                    : isPast || !isCurrentMonth
                      ? 'opacity-10 cursor-not-allowed'
                      : 'hover:bg-white/10'
                }`}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setBookingStep(4);
    setMessages(prev => [...prev, 
      { role: 'user', text: `How about ${format(selectedDate, 'MMMM do')} at ${slot}?` },
      { role: 'ai', text: "Almost there! Please review your booking details below:", type: 'confirm' }
    ]);
  };

  const finalizeBooking = async () => {
    if (!user || !selectedService || !selectedBarber || !selectedSlot) return;

    try {
      setIsTyping(true);
      const bookingData = {
        userId: user.uid,
        userName: profile?.displayName || user.displayName || 'Guest',
        barberId: selectedBarber.id,
        barberName: selectedBarber.name,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: format(selectedDate, 'yyyy-MM-dd'),
        slot: selectedSlot,
        price: selectedService.price
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) throw new Error('Booking failed');
      
      setBookingStep(5);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "Your booking is confirmed! We've sent you a confirmation. See you soon!",
        type: 'success'
      }]);
    } catch (error) {
      console.error("Booking error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm sorry, there was an error processing your booking. Please try again or visit our booking page." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Simple intent detection for booking
    const bookingIntents = ['book', 'appointment', 'schedule', 'haircut', 'trim', 'shave'];
    const isBookingIntent = bookingIntents.some(intent => userMessage.toLowerCase().includes(intent));

    if (isBookingIntent && bookingStep === 0) {
      setIsTyping(false);
      startBookingFlow();
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({ 
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are Barbera, the digital concierge for BARBERA barber shop. 
          You help users book appointments, check services, and answer questions about the shop.
          Be professional, stylish, and helpful.
          
          Current Services: ${services.map(s => `${s.name} ($${s.price})`).join(', ')}.
          Barbers: ${barbers.map(b => `${b.name} (${b.speciality})`).join(', ')}.
          
          If a user wants to book, you should encourage them to use the interactive booking flow.
          Today is ${format(new Date(), 'EEEE, MMMM do, yyyy')}.
          `
        },
        contents: userMessage
      });
      const aiText = response.text;
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having a bit of trouble connecting right now. Feel free to use our booking page!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass w-[calc(100vw-3rem)] sm:w-[400px] md:w-[450px] h-[min(600px,calc(100vh-8rem))] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden backdrop-blur-md bg-white/5 mb-4 pointer-events-auto"
          >
            {/* Header */}
            <div className="p-4 bg-primary/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Barbera Concierge</h3>
                  <span className="text-[10px] text-primary uppercase font-bold tracking-widest">Online</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className="space-y-3">
                  <div className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-4 max-w-[85%] text-sm rounded-2xl ${
                      m.role === 'ai' 
                        ? 'bg-white/5 rounded-tl-none border border-white/5' 
                        : 'bg-primary text-background-dark rounded-tr-none font-medium'
                    }`}>
                      {m.text}
                    </div>
                  </div>

                  {/* Interactive Elements */}
                  {m.role === 'ai' && m.type && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pl-4 pr-4 pb-2"
                    >
                      {m.type === 'service' && (
                        <div className="grid grid-cols-1 gap-2">
                          {services.map(s => (
                            <button 
                              key={s.id}
                              onClick={() => handleServiceSelect(s)}
                              className="text-left p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm"
                            >
                              <div className="font-bold">{s.name}</div>
                              <div className="text-xs text-slate-500">${s.price} • {s.duration} min</div>
                            </button>
                          ))}
                        </div>
                      )}

                      {m.type === 'barber' && (
                        <div className="grid grid-cols-1 gap-2">
                          {barbers.map(b => (
                            <button 
                              key={b.id}
                              onClick={() => handleBarberSelect(b)}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all text-sm"
                            >
                              <img src={b.photoURL} alt={b.name} className="w-10 h-10 rounded-full object-cover" />
                              <div className="text-left">
                                <div className="font-bold">{b.name}</div>
                                <div className="text-xs text-slate-500">{b.speciality}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {m.type === 'date' && (
                        <div className="space-y-4">
                          {renderCalendar()}
                          <div className="grid grid-cols-3 gap-2">
                            {["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"].map(slot => (
                              <button
                                key={slot}
                                onClick={() => handleSlotSelect(slot)}
                                className="py-2 rounded-lg border border-white/10 bg-white/5 text-xs font-bold hover:border-primary/50 transition-all"
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {m.type === 'confirm' && (
                        <div className="glass p-4 rounded-2xl border border-white/10 space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Service</span>
                            <span className="font-bold">{selectedService?.name}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Barber</span>
                            <span className="font-bold">{selectedBarber?.name}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Time</span>
                            <span className="font-bold">{format(selectedDate, 'MMM d')} @ {selectedSlot}</span>
                          </div>
                          <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                            <span className="font-bold">Total</span>
                            <span className="font-black text-primary">${selectedService?.price}</span>
                          </div>
                          <button 
                            onClick={finalizeBooking}
                            className="w-full bg-primary text-background-dark py-3 rounded-xl font-bold text-sm mt-2 shadow-lg shadow-primary/20"
                          >
                            Confirm Booking
                          </button>
                        </div>
                      )}

                      {m.type === 'success' && (
                        <div className="flex flex-col items-center text-center p-4 bg-primary/10 rounded-2xl border border-primary/20">
                          <CheckCircle className="text-primary w-10 h-10 mb-2" />
                          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Success</div>
                          <p className="text-[10px] text-slate-400">Your appointment is locked in.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-white/5">
              <div className="flex items-center gap-2 bg-background-dark rounded-xl px-3 py-2 border border-white/10">
                <input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  className="bg-transparent border-none focus:outline-none text-sm flex-1 placeholder:text-slate-600" 
                  placeholder="Ask about services or booking..." 
                  type="text"
                />
                <button 
                  onClick={handleSend}
                  className="bg-primary text-background-dark p-2 rounded-lg hover:scale-110 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 pointer-events-auto ${
          isOpen ? 'bg-white text-black' : 'bg-primary text-background-dark'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Scissors className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default AIChatConcierge;
