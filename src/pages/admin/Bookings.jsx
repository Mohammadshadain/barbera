import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      setBookings(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (loading) return <div className="p-10">Loading Bookings...</div>;

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black mb-2">Booking Management</h1>
        <p className="text-slate-500">View and manage all customer appointments.</p>
      </div>

      <div className="glass rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Customer</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Service</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Barber</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {booking.userName?.charAt(0)}
                      </div>
                      <span className="font-medium">{booking.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{booking.serviceName}</td>
                  <td className="px-6 py-4 text-sm">{booking.barberName}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-bold">{format(new Date(booking.date), 'MMM d, yyyy')}</p>
                      <p className="text-slate-500">{booking.slot}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500' :
                      booking.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
