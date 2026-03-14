import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, query, orderBy, limit, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Scissors, 
  TrendingUp
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    bookings: 0,
    customers: 0,
    revenue: 0,
    barbers: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookingsSnap = await getDocs(collection(db, 'bookings'));
        const usersSnap = await getDocs(collection(db, 'users'));
        const barbersSnap = await getDocs(collection(db, 'barbers'));

        const revenue = bookingsSnap.docs.reduce((acc, doc) => acc + (doc.data().price || 0), 0);

        setStats({
          bookings: bookingsSnap.size,
          customers: usersSnap.size,
          revenue: revenue,
          barbers: barbersSnap.size
        });

        const recentQ = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(recentQ);
        setRecentBookings(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: 'Mon', revenue: 400 },
    { name: 'Tue', revenue: 600 },
    { name: 'Wed', revenue: 500 },
    { name: 'Thu', revenue: 900 },
    { name: 'Fri', revenue: 1200 },
    { name: 'Sat', revenue: 1500 },
    { name: 'Sun', revenue: 800 },
  ];

  const handleSeedData = async () => {
    if (!window.confirm("Seed initial data? This will add sample barbers and services.")) return;
    
    try {
      // Seed Barbers
      const barbers = [
        { name: "Marcus Chen", speciality: "Master Stylist", rating: 4.9, photoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuBM1zV4Gmauwa7RDQ-3LAoByAtYAWu3QoKa7oIl4ynMLq7LqHaiJMtRJheZBP2TQuPELRj0e1RJe0X4PJmxe6cpj9uWrFrCw6Mr8iRyoC5-oLYAc2tjw82amyH4yCl9hqEAkN0OdMBkrP-4mpt6oYr8kRdXLxgbN8YsO_DduQw9PoFPXGc4pHQNS0unQhOkVgL-YWafD9nrt--MXkm5xzynOib9jH5At5Ov4evQXUO6kxQknemUVSPCA2sacOYhOK4YQKg7n3XG5mc", workingHours: { start: "09:00", end: "18:00" } },
        { name: "Elena Rodriguez", speciality: "Fade Specialist", rating: 5.0, photoURL: "https://lh3.googleusercontent.com/aida-public/AB6AXuAd4QjQvbL7wLPL7WjaBY6DjxrCs-YYqKW5MeVehTU-GJ6lFKLvOOohKF3XTezr2Gk-bYuvewiN7pnPeiitfpyjKU7jGOdvb6qJ35uZT5Au00wOGe_71hCaeZqrzZR2r2X5z6SJjhNlE3uVA9-x5xrdsGHyzFvzswFrLPOCYaJUJY8BakCZtNbsTJP88Y6YPobo5PM85pc63BT8huX5kFx9AqS-3_RRwvQQ5_1v4AH4-MfppV-LiVMhhLuPBYX29fMj6b9b79xLIiA", workingHours: { start: "10:00", end: "19:00" } }
      ];
      for (const b of barbers) await addDoc(collection(db, 'barbers'), b);

      // Seed Services
      const services = [
        { name: "Signature Haircut", description: "Precise fading and styling tailored to your face shape.", price: 45, duration: 45, photoURL: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800" },
        { name: "Beard Sculpting", description: "Line-up, trim, and hot towel treatment for the modern beard.", price: 30, duration: 30, photoURL: "https://images.unsplash.com/photo-1621605815841-2dddb7a69e3d?auto=format&fit=crop&q=80&w=800" }
      ];
      for (const s of services) await addDoc(collection(db, 'services'), s);

      alert("Data seeded successfully! Refreshing...");
      window.location.reload();
    } catch (error) {
      console.error("Seed error:", error);
    }
  };

  if (loading) return <div className="p-10">Loading Dashboard...</div>;

  return (
    <div className="p-6 sm:p-10 space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black mb-2">Admin Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={handleSeedData} className="text-xs font-bold text-slate-500 hover:text-primary transition-colors">Seed Initial Data</button>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-primary uppercase tracking-widest">{format(new Date(), 'EEEE, MMMM do')}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: stats.bookings, icon: Calendar, color: 'text-blue-500' },
          { label: 'Total Customers', value: stats.customers, icon: Users, color: 'text-purple-500' },
          { label: 'Total Revenue', value: `$${stats.revenue}`, icon: DollarSign, color: 'text-green-500' },
          { label: 'Active Barbers', value: stats.barbers, icon: Scissors, color: 'text-primary' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border border-white/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
            <p className="text-2xl font-black">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Revenue Overview</h2>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#D4AF37' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="glass p-8 rounded-3xl border border-white/5">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold">Recent Bookings</h2>
            <button className="text-primary text-sm font-bold">View All</button>
          </div>
          <div className="space-y-6">
            {recentBookings.map((booking, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {booking.userName?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{booking.userName}</h4>
                    <p className="text-xs text-slate-500">{booking.serviceName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{booking.slot}</p>
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest">{format(new Date(booking.date), 'MMM d')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
