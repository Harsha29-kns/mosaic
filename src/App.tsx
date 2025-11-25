// src/App.tsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import WishesWall from './components/WishesWall';
import MosaicReveal from './components/MosaicReveal';
import AdminDashboard from './components/AdminDashboard';
import AudioPlayer from './components/AudioPlayer';

// A wrapper component to show the User Journey in order
function UserJourney() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hidden audio player persists music across scroll */}
      <div className="hidden"><AudioPlayer autoPlay={true} /></div>
      
      {/* Sections with IDs for smooth scrolling if needed */}
      <section id="hero">
        <Hero onStartJourney={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })} />
      </section>
      
      <section id="timeline">
        <Timeline />
      </section>
      
      <section id="wishes">
        <WishesWall />
      </section>
      
      <section id="reveal">
        <MosaicReveal />
      </section>
    </div>
  );
}

export default function App() {
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

  // Simple authentication check
  if (!userRole) {
    return <Login onLogin={setUserRole} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Route */}
        <Route 
          path="/admin" 
          element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
        />

        {/* User Route */}
        <Route 
          path="/" 
          element={userRole === 'user' ? <UserJourney /> : <Navigate to="/admin" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}