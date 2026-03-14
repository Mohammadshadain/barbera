import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Clock, ShieldCheck, DollarSign, Sparkles, CalendarCheck, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const salonImages = [
    "https://images.unsplash.com/photo-1593702295094-28258349365f?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1512690196252-7516b7d58f26?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1532710093739-9470acff878f?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1521444470829-0c3b03769a5b?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1621605815841-2dddb7a69e3d?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1592647425447-18109934e233?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1590540179852-2110a54f813a?auto=format&fit=crop&q=80&w=1200"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % salonImages.length);
      setHeroImageIndex((prev) => (prev + 1) % salonImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const servicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (servicesData.length === 0) {
          setServices([
            { id: '1', name: 'Signature Haircut', description: 'Precise fading and styling tailored to your face shape.', price: 45, duration: 45, photoURL: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800' },
            { id: '2', name: 'Beard Sculpting', description: 'Line-up, trim, and hot towel treatment for the modern beard.', price: 30, duration: 30, photoURL: 'https://images.unsplash.com/photo-1599351431247-f10b21ce49b3?auto=format&fit=crop&q=80&w=800' },
            { id: '3', name: 'Premium Headwash', description: 'Relaxing scalp massage and premium deep conditioning treatment.', price: 25, duration: 20, photoURL: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800' },
            { id: '4', name: 'Hair Coloring', description: 'Professional hair coloring with premium products.', price: 55, duration: 60, photoURL: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800' },
            { id: '5', name: 'Kids Haircut', description: 'Stylish and comfortable haircuts for kids.', price: 20, duration: 25, photoURL: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800' },
            { id: '6', name: 'Hair & Beard Combo', description: 'Complete grooming package including haircut and beard styling.', price: 60, duration: 60, photoURL: 'https://images.unsplash.com/photo-1593702295094-ada74bc4a149?auto=format&fit=crop&q=80&w=800' }
          ]);
        } else {
          setServices(servicesData);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const openChat = (e, service = null) => {
    window.dispatchEvent(new CustomEvent('start-booking', { 
      detail: { 
        service, 
        x: e?.clientX, 
        y: e?.clientY 
      } 
    }));
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Slider */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${salonImages[currentSlide]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-background-dark via-background-dark/80 to-background-dark"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Premium Grooming
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6 text-gradient">
              Precision Meets <br/> Modern Luxury
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed">
              Experience the future of barbering. Book your signature look with our elite stylists through our seamless digital concierge.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={(e) => openChat(e)}
                className="bg-primary text-background-dark px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link to="/services" className="glass px-8 py-4 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all">
                View Services
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex justify-center lg:justify-end relative"
          >
            <div className="relative w-full max-w-md aspect-square group">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all"></div>
              <AnimatePresence mode="wait">
                <motion.img
                  key={heroImageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.8 }}
                  src={salonImages[heroImageIndex]}
                  alt="Barber Shop"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10 relative z-10"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-full border border-white/10 z-20 whitespace-nowrap">
                <p className="text-xs font-bold tracking-widest text-primary uppercase">
                  Ready to serve you!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">Our Menu</h2>
            <h1 className="text-4xl md:text-5xl font-black text-gradient">Premium Services</h1>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-3xl overflow-hidden group border border-white/5 hover:border-primary/30 transition-all"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.photoURL} 
                    alt={service.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1 text-primary font-bold">
                      <DollarSign className="w-4 h-4" />
                      <span>{service.price}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => openChat(e, service)}
                    className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-background-dark py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/services" className="text-primary font-bold hover:underline flex items-center justify-center gap-2">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background-dark/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">Why Choose Us</h2>
            <h1 className="text-4xl md:text-5xl font-black text-gradient">The Barbera Standard</h1>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Star, title: "Elite Barbers", desc: "Hand-picked masters of the craft with years of precision experience.", back: "Top-rated grooming experience" },
              { icon: Clock, title: "Smart Scheduling", desc: "Live availability and instant confirmation. No more waiting lines.", back: "Instant booking confirmation" },
              { icon: ShieldCheck, title: "Premium Quality", desc: "Only the finest products and techniques for your signature style.", back: "Trusted by hundreds of clients" },
              { icon: Sparkles, title: "Luxury Experience", desc: "Relax in a premium grooming environment designed for comfort and style.", back: "Unmatched comfort & style" },
              { icon: CalendarCheck, title: "Easy Online Booking", desc: "Book your appointment anytime with a seamless online booking system.", back: "Book in under 60 seconds" },
              { icon: UserCheck, title: "Personalized Styling", desc: "Get hairstyle recommendations tailored to your face shape and personality.", back: "Tailored to your unique look" }
            ].map((feature, i) => (
              <div key={i} className="group h-64 [perspective:1000px]">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ rotateY: 180 }}
                  className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d]"
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 glass p-8 rounded-2xl border border-white/5 flex flex-col items-center text-center justify-center [backface-visibility:hidden]">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                      <feature.icon className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 glass p-8 rounded-2xl border border-primary/30 flex flex-col items-center text-center justify-center bg-primary/5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                      <feature.icon className="text-primary w-8 h-8" />
                    </div>
                    <p className="text-primary font-black uppercase tracking-widest text-sm">{feature.back}</p>
                    <div className="mt-4 w-12 h-1 bg-primary/30 rounded-full"></div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
