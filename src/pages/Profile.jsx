import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  if (!profile) return null;

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="glass p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-32 h-32 rounded-3xl bg-primary/10 border-2 border-primary/20 p-2">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-background-dark flex items-center justify-center">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-primary" />
              )}
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black mb-2">{profile.displayName}</h1>
            <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2 mb-6">
              <Mail className="w-4 h-4" /> {profile.email}
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-3 h-3" /> {profile.role}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Member since 2024
              </span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-500/10 px-6 py-3 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div className="glass p-8 rounded-3xl border border-white/5">
          <h3 className="text-xl font-bold mb-6">Account Settings</h3>
          <div className="space-y-4">
            <button className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
              Update Profile Info
            </button>
            <button className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
              Notification Preferences
            </button>
          </div>
        </div>
        
        <div className="glass p-8 rounded-3xl border border-white/5">
          <h3 className="text-xl font-bold mb-6">Security</h3>
          <div className="space-y-4">
            <button className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
              Change Password
            </button>
            <button className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 text-red-400">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
