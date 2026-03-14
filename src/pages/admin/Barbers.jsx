import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

const AdminBarbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBarber, setNewBarber] = useState({
    name: '',
    speciality: '',
    photoURL: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400',
    workingHours: { start: '09:00', end: '18:00' }
  });

  const fetchBarbers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'barbers'));
      setBarbers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching barbers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const handleAddBarber = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'barbers'), newBarber);
      setIsModalOpen(false);
      setNewBarber({
        name: '',
        speciality: '',
        photoURL: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400',
        workingHours: { start: '09:00', end: '18:00' }
      });
      fetchBarbers();
    } catch (error) {
      console.error("Add barber error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this barber?")) return;
    try {
      await deleteDoc(doc(db, 'barbers', id));
      fetchBarbers();
    } catch (error) {
      console.error("Delete barber error:", error);
    }
  };

  if (loading) return <div className="p-10">Loading Barbers...</div>;

  return (
    <div className="p-6 sm:p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black mb-2">Manage Barbers</h1>
          <p className="text-slate-500">Add, edit, or remove staff members.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-background-dark px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Barber
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {barbers.map((barber) => (
          <motion.div
            key={barber.id}
            layout
            className="glass p-6 rounded-3xl border border-white/5 flex items-center gap-6 group"
          >
            <img src={barber.photoURL} alt={barber.name} className="w-20 h-20 rounded-2xl object-cover" />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{barber.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{barber.speciality}</p>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-primary transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(barber.id)}
                  className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
              <h2 className="text-2xl font-bold">Add New Barber</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddBarber} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
                <input 
                  required
                  value={newBarber.name}
                  onChange={e => setNewBarber({...newBarber, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  placeholder="e.g. Marcus Chen"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Speciality</label>
                <input 
                  required
                  value={newBarber.speciality}
                  onChange={e => setNewBarber({...newBarber, speciality: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  placeholder="e.g. Fade Specialist"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Start Time</label>
                  <input 
                    type="time"
                    value={newBarber.workingHours.start}
                    onChange={e => setNewBarber({...newBarber, workingHours: {...newBarber.workingHours, start: e.target.value}})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">End Time</label>
                  <input 
                    type="time"
                    value={newBarber.workingHours.end}
                    onChange={e => setNewBarber({...newBarber, workingHours: {...newBarber.workingHours, end: e.target.value}})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-background-dark py-4 rounded-2xl font-black shadow-xl shadow-primary/20">
                Save Barber
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminBarbers;
