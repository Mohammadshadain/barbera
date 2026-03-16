import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, Scissors, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const MyAppointments = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/bookings/${user.uid}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        // Ensure data is an array
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setBookings([]); // Ensure it's an array even on error
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH'
      });
      if (!response.ok) throw new Error('Cancel failed');
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-black mb-12 text-gradient">My Appointments</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border border-white/5">
          <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-6" />
          <h2 className="text-xl font-bold mb-2">No appointments yet</h2>
          <p className="text-slate-500">Book your first session to see it here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Scissors className="text-primary w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{booking.serviceName}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" /> {booking.barberName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {format(new Date(booking.date), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {booking.slot}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                  booking.status === 'confirmed' ? 'bg-green-500/10 text-green-500' :
                  booking.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                  'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {booking.status === 'confirmed' ? <CheckCircle className="w-3 h-3" /> :
                   booking.status === 'cancelled' ? <XCircle className="w-3 h-3" /> :
                   <AlertCircle className="w-3 h-3" />}
                  {booking.status}
                </div>

                {booking.status === 'pending' && (
                  <button 
                    onClick={() => handleCancel(booking.id)}
                    className="text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
