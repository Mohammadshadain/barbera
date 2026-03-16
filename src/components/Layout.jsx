import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';

const Layout = ({ children }) => {
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Scissors className="text-primary w-8 h-8" />
            <span className="text-xl font-bold tracking-tight">BARBERA</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
            <Link to="/booking" className="hover:text-primary transition-colors">Book Now</Link>
            {profile && (
              <>
                <Link to="/appointments" className="hover:text-primary transition-colors">My Bookings</Link>
                {isAdmin && (
                  <div className="flex items-center gap-6">
                    <Link to="/admin" className="text-primary font-bold flex items-center gap-1">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link to="/admin/barbers" className="hover:text-primary transition-colors">Barbers</Link>
                    <Link to="/admin/services" className="hover:text-primary transition-colors">Services</Link>
                    <Link to="/admin/bookings" className="hover:text-primary transition-colors">Bookings</Link>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {profile ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {profile.photoURL ? (
                      <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{profile.displayName}</span>
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-primary hover:bg-primary/90 text-background-dark px-6 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-20">
        {children}
      </main>

      {/* Sticky Logo - Moved to bottom-left to avoid overlap with chatbot */}
      <div className="fixed bottom-8 left-8 z-[60] pointer-events-none">
        <div className="flex items-center gap-2 bg-background-dark/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl">
          <Scissors className="text-primary w-5 h-5" />
          <span className="text-sm font-black tracking-tighter">BARBERA</span>
        </div>
      </div>

      <footer className="py-20 border-t border-white/5 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Scissors className="text-primary w-8 h-8" />
              <span className="text-2xl font-black tracking-tighter">BARBERA</span>
            </Link>
            <p className="text-slate-500 max-w-sm leading-relaxed mb-8">
              Redefining the modern grooming experience through precision, luxury, and digital innovation. Join the elite.
            </p>
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                <a key={social} href="#" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li>
                <button 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    window.dispatchEvent(new CustomEvent('start-booking', { 
                      detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } 
                    }));
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Book Appointment
                </button>
              </li>
              <li><Link to="/profile" className="hover:text-primary transition-colors">My Profile</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Member Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Location</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              123 Grooming St.<br />
              Luxury District<br />
              New York, NY 10001
            </p>
            <p className="mt-4 text-sm text-primary font-bold">
              +1 (555) 123-4567
            </p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">© 2024 BARBERA Inc. All rights reserved.</p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
