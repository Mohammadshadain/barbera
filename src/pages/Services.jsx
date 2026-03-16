import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch');
        const servicesData = await response.json();
        
        // Ensure servicesData is an array
        const servicesArray = Array.isArray(servicesData) ? servicesData : [];
        
        if (servicesArray.length === 0) {
          // Fallback mock data if DB is empty
          setServices([
            { id: '1', name: 'Signature Haircut', description: 'Precise fading and styling tailored to your face shape.', price: 45, duration: 45, photoURL: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800' },
            { id: '2', name: 'Beard Sculpting', description: 'Line-up, trim, and hot towel treatment for the modern beard.', price: 30, duration: 30, photoURL: 'https://images.unsplash.com/photo-1621605815841-2dddb7a69e3d?auto=format&fit=crop&q=80&w=800' },
            { id: '3', name: 'Premium Headwash', description: 'Relaxing scalp massage and premium deep conditioning treatment.', price: 25, duration: 20, photoURL: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800' },
            { id: '4', name: 'Hair Coloring', description: 'Professional hair coloring with premium products.', price: 55, duration: 60, photoURL: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800' },
            { id: '5', name: 'Kids Haircut', description: 'Stylish and comfortable haircuts for kids.', price: 20, duration: 25, photoURL: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800' },
            { id: '6', name: 'Hair & Beard Combo', description: 'Complete grooming package including haircut and beard styling.', price: 60, duration: 60, photoURL: 'https://images.unsplash.com/photo-1593702295094-ada74bc4a149?auto=format&fit=crop&q=80&w=800' },
            { id: '7', name: 'Luxury Shave', description: 'Traditional hot towel shave with premium grooming products.', price: 35, duration: 30, photoURL: 'https://images.unsplash.com/photo-1503951458645-643d53efd90f?auto=format&fit=crop&q=80&w=800' },
            { id: '8', name: 'Scalp Treatment', description: 'Deep scalp treatment for healthy hair and relaxation.', price: 40, duration: 35, photoURL: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800' }
          ]);
        } else {
          setServices(servicesArray);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        // Fallback to mock data on error
        setServices([
          { id: '1', name: 'Signature Haircut', description: 'Precise fading and styling tailored to your face shape.', price: 45, duration: 45, photoURL: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800' },
          { id: '2', name: 'Beard Sculpting', description: 'Line-up, trim, and hot towel treatment for the modern beard.', price: 30, duration: 30, photoURL: 'https://images.unsplash.com/photo-1621605815841-2dddb7a69e3d?auto=format&fit=crop&q=80&w=800' },
          { id: '3', name: 'Premium Headwash', description: 'Relaxing scalp massage and premium deep conditioning treatment.', price: 25, duration: 20, photoURL: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800' },
          { id: '4', name: 'Hair Coloring', description: 'Professional hair coloring with premium products.', price: 55, duration: 60, photoURL: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800' },
          { id: '5', name: 'Kids Haircut', description: 'Stylish and comfortable haircuts for kids.', price: 20, duration: 25, photoURL: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800' },
          { id: '6', name: 'Hair & Beard Combo', description: 'Complete grooming package including haircut and beard styling.', price: 60, duration: 60, photoURL: 'https://images.unsplash.com/photo-1593702295094-ada74bc4a149?auto=format&fit=crop&q=80&w=800' },
          { id: '7', name: 'Luxury Shave', description: 'Traditional hot towel shave with premium grooming products.', price: 35, duration: 30, photoURL: 'https://images.unsplash.com/photo-1503951458645-643d53efd90f?auto=format&fit=crop&q=80&w=800' },
          { id: '8', name: 'Scalp Treatment', description: 'Deep scalp treatment for healthy hair and relaxation.', price: 40, duration: 35, photoURL: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h2 className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4">Our Menu</h2>
        <h1 className="text-4xl md:text-6xl font-black text-gradient">Premium Services</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = rect.left + rect.width / 2;
                  const y = rect.top + rect.height / 2;
                  window.dispatchEvent(new CustomEvent('start-booking', { 
                    detail: { 
                      service, 
                      x, 
                      y 
                    } 
                  }))
                }}
                className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-background-dark py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                Book Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Services;
