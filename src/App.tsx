import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Hero from './components/Hero';
import Shop from './components/Shop';
import ProductDetail from './components/ProductDetail';
import SkinQuiz from './components/SkinQuiz';
import RoutineBuilder from './components/RoutineBuilder';
import WellnessHub from './components/WellnessHub';
import AboutUs from './components/AboutUs';
import Account from './components/Account';
import AdminPanel from './components/AdminPanel';
import { Sparkles, MapPin, Phone, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { activePage, setActivePage, siteSettings, theme } = useApp();

  // Dynamically sync theme to document element class list to enable standard dark: classes in subcomponents
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#121212] text-[#E0E0E0]' : 'bg-[#FAF7F2] text-luxury-charcoal'
    }`}>
      
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Slide Drawer Compartment */}
      <CartDrawer />

      {/* 3. Primary Page Router View */}
      <main className="flex-1">
        {activePage === 'home' && <Hero />}
        {activePage === 'shop' && <Shop />}
        {activePage === 'product-detail' && <ProductDetail />}
        {activePage === 'quiz' && <SkinQuiz />}
        {activePage === 'routine' && <RoutineBuilder />}
        {activePage === 'blog' && <WellnessHub />}
        {activePage === 'about' && <AboutUs />}
        {activePage === 'account' && <Account />}
        {activePage === 'admin' && <AdminPanel />}
      </main>

      {/* 4. Minimalist Luxury Footer */}
      <footer className="bg-[#1E1D1A] text-[#FAF7F2] border-t border-[#F0EAE1]/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-10 border-b border-[#FAF7F2]/10">
            
            {/* Column A: Logo Brand and alignment philosophy */}
            <div className="space-y-4">
              <span className="font-serif text-2xl sm:text-3xl tracking-widest text-[#FAF7F2] uppercase relative">
                {siteSettings.logoTitle}
                <span className="absolute -bottom-3 left-0.5 text-[8px] font-sans tracking-[0.25em] font-medium text-luxury-gold uppercase block">
                  {siteSettings.logoSubtitle}
                </span>
              </span>
              <p className="text-xs text-[#FAF7F2]/60 leading-relaxed font-light font-sans max-w-xs pt-3">
                {siteSettings.brandSlogan}
              </p>
            </div>

            {/* Column B: Collections routing links */}
            <div className="space-y-3.5">
              <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-luxury-gold font-bold">
                Apothecary Shop
              </h4>
              <ul className="space-y-2 text-xs font-light text-[#FAF7F2]/75 font-sans">
                <li>
                  <button onClick={() => setActivePage('shop')} className="hover:text-luxury-gold transition-colors cursor-pointer">
                    Pure Milky Cleansers
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('shop')} className="hover:text-luxury-gold transition-colors cursor-pointer">
                    Alpine Mineral Toners
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('shop')} className="hover:text-luxury-gold transition-colors cursor-pointer">
                    Amber Active Serums
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('shop')} className="hover:text-luxury-gold transition-colors cursor-pointer">
                    Cashmere Cloud Butter
                  </button>
                </li>
              </ul>
            </div>

            {/* Column C: Diagnostic tools / Info */}
            <div className="space-y-3.5">
              <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-luxury-gold font-bold">
                Tailored Systems
              </h4>
              <ul className="space-y-2 text-xs font-light text-[#FAF7F2]/75 font-sans">
                <li>
                  <button onClick={() => setActivePage('quiz')} className="hover:text-luxury-gold transition-colors cursor-pointer">
                    Skin Diagnostic Quiz
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('routine')} className="hover:text-luxury-gold transition-colors cursor-pointer">
                    Bespoke Sequence Builder
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('blog')} className="hover:text-luxury-gold transition-colors cursor-pointer">
                    Chronicles & Rituals
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePage('about')} className="hover:text-luxury-gold transition-colors cursor-pointer">
                    Sourcing story
                  </button>
                </li>
              </ul>
            </div>

            {/* Column D: Headquarters contact / timing */}
            <div className="space-y-3.5">
              <h4 className="font-mono text-[10px] tracking-[0.2em] uppercase text-luxury-gold font-bold">
                Headquarters
              </h4>
              <ul className="space-y-2 text-xs font-light text-[#FAF7F2]/75 font-sans">
                <li className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                  <span>{siteSettings.headquartersLocation}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                  <span>{siteSettings.supportPhone}</span>
                </li>
                <li className="pt-2 text-[10.5px] font-mono uppercase tracking-wider text-luxury-gold font-semibold leading-relaxed">
                  Support Operating Hours: <br />
                  {siteSettings.supportHours}
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom regulatory labels */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono tracking-widest uppercase text-[#FAF7F2]/45">
            <div>
              © 2026 GLOW SKINCARE INC. ALL RIGHTS RESERVED.
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 items-center">
              <button
                onClick={() => setActivePage('admin')}
                className="text-luxury-gold hover:text-[#FAF7F2] transition-colors duration-200 cursor-pointer font-bold tracking-widest font-mono"
                title="HQ Management System"
              >
                ● ADMIN PORTAL
              </button>
              <span>GENEVA LAB • SWISS HARVEST</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" /> SSL ENCRYPTED SECURE SHOP
              </span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
