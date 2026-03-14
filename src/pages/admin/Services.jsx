import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Trash2, Edit2, X, DollarSign, Clock } from 'lucide-react';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    photoURL: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=400'
  });

  const fetchServices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      setServices(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'services'), newService);
      setIsModalOpen(false);
      setNewService({
        name: '',
        description: '',
        price: 0,
        duration: 30,
        photoURL: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=400'
      });
      fetchServices();
    } catch (error) {
      console.error("Add service error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      fetchServices();
    } catch (error) {
      console.error("Delete service error:", error);
    }
  };

  if (loading) return <div className="p-10">Loading Services...</div>;

  return (
    <div className="p-6 sm:p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black mb-2">Manage Services</h1>
          <p className="text-slate-500">Define your menu and pricing.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-background-dark px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <motion.div
            key={service.id}
            layout
            className="glass p-6 rounded-3xl border border-white/5 group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">{service.name}</h3>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">{service.description}</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 text-primary font-bold">
                <DollarSign className="w-4 h-4" />
                <span>{service.price}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>{service.duration} min</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass max-w-md w-full p-8 rounded-3xl border border-white/10"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Add New Service</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Service Name</label>
                <input 
                  required
                  value={newService.name}
                  onChange={e => setNewService({...newService, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  placeholder="e.g. Signature Haircut"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description</label>
                <textarea 
                  required
                  value={newService.description}
                  onChange={e => setNewService({...newService, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors h-24 resize-none"
                  placeholder="Describe the service..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Price ($)</label>
                  <input 
                    type="number"
                    required
                    value={newService.price}
                    onChange={e => setNewService({...newService, price: Number(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Duration (min)</label>
                  <input 
                    type="number"
                    required
                    value={newService.duration}
                    onChange={e => setNewService({...newService, duration: Number(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-background-dark py-4 rounded-2xl font-black shadow-xl shadow-primary/20">
                Save Service
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
