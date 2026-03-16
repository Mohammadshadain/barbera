import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ChevronLeft, Star } from 'lucide-react';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';

const BookingPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // Handle pre-selected service from URL
        const serviceId = searchParams.get('service');
        if (serviceId) {
          const service = servicesData.find(s => s.id.toString() === serviceId);
          if (service) {
            setSelectedService(service);
            setStep(2);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleBooking = async () => {
    if (!user || !selectedService || !selectedBarber || !selectedSlot) return;

    try {
      const bookingData = {
        userId: user.uid,
        userName: profile?.displayName || user.displayName,
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
      
      setStep(5); // Success step
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Login Required</h2>
        <p className="text-slate-400 mb-8">Please login to book an appointment.</p>
        <button onClick={() => navigate('/login')} className="bg-primary text-background-dark px-8 py-3 rounded-xl font-bold">
          Go to Login
        </button>
      </div>
    );
  }

  const slots = ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM"];

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-16 max-w-2xl mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                step >= i 
                  ? 'bg-primary text-background-dark shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                  : 'bg-white/5 text-slate-500 border border-white/10'
              }`}>
                {step > i ? <CheckCircle className="w-6 h-6" /> : i}
              </div>
              <span className={`absolute -bottom-8 text-[10px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors duration-500 ${
                step >= i ? 'text-primary' : 'text-slate-600'
              }`}>
                {i === 1 && "Service"}
                {i === 2 && "Date & Time"}
                {i === 3 && "Barber"}
                {i === 4 && "Confirm"}
              </span>
            </div>
            {i < 4 && (
              <div className="h-[2px] flex-1 mx-4 bg-white/5 relative overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: step > i ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-primary shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-gold-gradient drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  Select a Service
                </h2>
              </motion.div>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-primary/30" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Premium Grooming Experience</p>
                <div className="h-px w-12 bg-primary/30" />
              </div>
            </div>
            
            {services.length === 0 && !loading ? (
              <div className="text-center py-20 glass rounded-3xl border-dashed border-white/10">
                <p className="text-slate-500 italic">No services available at the moment. Please check back later.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {services.map((s) => (
                  <motion.button
                    key={s.id}
                    whileHover={{ y: -12, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedService(s); setStep(2); }}
                    className={`group relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 text-left flex flex-col h-full ${
                      selectedService?.id === s.id 
                        ? 'border-primary bg-primary/5 shadow-[0_0_50px_rgba(212,175,55,0.15)]' 
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img 
                        src={s.photoURL || `https://picsum.photos/seed/${s.name}/800/1000`} 
                        alt={s.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/20 to-transparent opacity-80" />
                      
                      <div className="absolute top-6 right-6">
                        <div className="bg-background-dark/80 backdrop-blur-md border border-white/10 text-primary px-4 py-2 rounded-2xl text-sm font-black italic shadow-2xl">
                          ${s.price}
                        </div>
                      </div>

                      <div className="absolute bottom-8 left-8 right-8 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-px w-6 bg-primary" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{s.duration} MIN</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase italic leading-none">{s.name}</h3>
                      </div>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
                        {s.description || "Experience the pinnacle of grooming with our master barbers. Precision, style, and luxury combined."}
                      </p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 group-hover:text-primary transition-colors">Book Treatment</span>
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${
                          selectedService?.id === s.id ? 'bg-primary border-primary rotate-0' : 'border-white/20 -rotate-45 group-hover:rotate-0 group-hover:border-primary/50'
                        }`}>
                          {selectedService?.id === s.id ? (
                            <CheckCircle className="w-5 h-5 text-background-dark" />
                          ) : (
                            <ChevronLeft className="w-5 h-5 text-white/20 group-hover:text-primary rotate-180" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative corner */}
                    <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-gold-gradient drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  Select Date & Time
                </h2>
              </motion.div>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-primary/30" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Your Time, Our Craft</p>
                <div className="h-px w-12 bg-primary/30" />
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black italic">01</div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Choose Your Date</h3>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                  {[...Array(14)].map((_, i) => {
                    const date = addDays(new Date(), i);
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(date)}
                        className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition-all duration-500 ${
                          isSelected 
                            ? 'bg-primary text-background-dark border-primary shadow-[0_0_30px_rgba(212,175,55,0.4)]' 
                            : 'bg-white/5 border-white/10 hover:border-white/30'
                        }`}
                      >
                        <span className={`text-[10px] uppercase font-black mb-1 ${isSelected ? 'text-background-dark/60' : 'text-slate-500'}`}>
                          {format(date, 'EEE')}
                        </span>
                        <span className="text-xl font-black italic">{format(date, 'd')}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black italic">02</div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Select Time Slot</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {slots.map((slot) => (
                    <motion.button
                      key={slot}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-5 rounded-2xl border font-black text-sm transition-all duration-500 ${
                        selectedSlot === slot 
                          ? 'bg-primary text-background-dark border-primary shadow-[0_0_30px_rgba(212,175,55,0.3)]' 
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {slot}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-black"
              >
                <ChevronLeft className="w-4 h-4" /> Change Service
              </button>
              <button
                disabled={!selectedSlot}
                onClick={() => setStep(3)}
                className="w-full sm:w-auto bg-primary text-background-dark px-16 py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
              >
                Select Barber
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-gold-gradient drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  Select a Barber
                </h2>
              </motion.div>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-primary/30" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Master Artisans of Style</p>
                <div className="h-px w-12 bg-primary/30" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {barbers.map((b) => (
                <motion.button
                  key={b.id}
                  whileHover={{ y: -12, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedBarber(b); setStep(4); }}
                  className={`group relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 text-left flex flex-col h-full ${
                    selectedBarber?.id === b.id 
                      ? 'border-primary bg-primary/5 shadow-[0_0_50px_rgba(212,175,55,0.15)]' 
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img 
                      src={b.photoURL || `https://picsum.photos/seed/${b.name}/800/1000`} 
                      alt={b.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/20 to-transparent opacity-80" />
                    
                    <div className="absolute top-6 right-6">
                      <div className="bg-background-dark/80 backdrop-blur-md border border-white/10 text-primary px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                        {b.experience || "5+ Years"}
                      </div>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-px w-6 bg-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{b.speciality || "Master Barber"}</span>
                      </div>
                      <h3 className="text-3xl font-black uppercase italic leading-none">{b.name}</h3>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
                      {b.bio || "Dedicated to the art of traditional barbering with a modern edge. Every cut is a masterpiece of precision."}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-500 group-hover:text-primary transition-colors">Select Artisan</span>
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 ${
                        selectedBarber?.id === b.id ? 'bg-primary border-primary rotate-0' : 'border-white/20 -rotate-45 group-hover:rotate-0 group-hover:border-primary/50'
                      }`}>
                        {selectedBarber?.id === b.id ? (
                          <CheckCircle className="w-5 h-5 text-background-dark" />
                        ) : (
                          <ChevronLeft className="w-5 h-5 text-white/20 group-hover:text-primary rotate-180" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="pt-12 border-t border-white/5 flex justify-center">
              <button 
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-black"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Time Selection
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto space-y-12"
          >
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-gold-gradient drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  Confirm Booking
                </h2>
              </motion.div>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-primary/30" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Review Your Appointment</p>
                <div className="h-px w-12 bg-primary/30" />
              </div>
            </div>

            <div className="glass p-12 rounded-[3.5rem] border border-white/10 space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <div className="grid md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Selected Service</p>
                    <p className="text-3xl font-black uppercase italic">{selectedService?.name}</p>
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="h-px w-4 bg-white/20" />
                      <p className="text-xs font-bold uppercase tracking-widest">{selectedService?.duration} MINS</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Date & Time</p>
                    <p className="text-2xl font-bold">{format(selectedDate, 'MMMM d, yyyy')}</p>
                    <p className="text-xl font-black italic text-white/60">{selectedSlot}</p>
                  </div>
                </div>

                <div className="space-y-6 md:text-right">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Master Artisan</p>
                    <p className="text-3xl font-black uppercase italic">{selectedBarber?.name}</p>
                    <div className="flex items-center md:justify-end gap-2 text-slate-400">
                      <p className="text-xs font-bold uppercase tracking-widest">{selectedBarber?.speciality}</p>
                      <div className="h-px w-4 bg-white/20" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Investment</p>
                    <p className="text-5xl font-black text-white italic drop-shadow-2xl">${selectedService?.price}</p>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-widest text-white">Guaranteed Quality</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Premium Barbera Standard</p>
                  </div>
                </div>
                
                <div className="flex gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => setStep(3)} 
                    className="flex-1 sm:flex-none glass px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <ChevronLeft className="w-4 h-4" /> Edit
                  </button>
                  <button 
                    onClick={handleBooking} 
                    className="flex-[2] sm:flex-none bg-primary text-background-dark px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:scale-[1.05] active:scale-95 transition-all text-xs"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="text-primary w-12 h-12" />
            </div>
            <h2 className="text-4xl font-black mb-4">Booking Confirmed!</h2>
            <p className="text-slate-400 mb-12 max-w-md mx-auto">
              Your appointment has been scheduled successfully. We've sent a confirmation email with all the details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/appointments')} className="bg-primary text-background-dark px-8 py-4 rounded-2xl font-bold">
                View My Appointments
              </button>
              <button onClick={() => navigate('/')} className="glass px-8 py-4 rounded-2xl font-bold">
                Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingPage;
