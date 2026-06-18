import { useApp } from '../context/AppContext';
import { ShoppingBag, Heart, User, Sparkles, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const {
    activePage,
    setActivePage,
    cart,
    favorites,
    currentUser,
    setIsCartOpen,
    setIsAuthModalOpen,
    siteSettings,
    theme,
    toggleTheme,
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Calculate items count in cart
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { label: 'Home', id: 'home' as const },
    { label: 'Shop Products', id: 'shop' as const },
    { label: 'Skin Quiz', id: 'quiz' as const },
    { label: 'Routine Builder', id: 'routine' as const },
    { label: 'Wellness Hub', id: 'blog' as const },
    { label: 'Our Story', id: 'about' as const },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#F0EAE1] bg-[#FAF7F2]/80 backdrop-blur-md">
      {/* Top Banner */}
      <div className="bg-[#1E1D1A] py-1.5 px-4 text-center text-[10px] sm:text-xs tracking-widest text-[#FAF7F2] uppercase font-mono flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-luxury-gold animate-pulse" />
        {siteSettings.announcementText}
        <Sparkles className="w-3 h-3 text-luxury-gold animate-pulse" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Brand Logo - Left or Center, let's keep it luxury Left */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => setActivePage('home')}>
            <span className="font-serif text-2xl sm:text-3xl tracking-widest text-luxury-charcoal relative">
              {siteSettings.logoTitle}
              <span className="absolute -bottom-3 left-0.5 text-[8px] font-sans tracking-[0.25em] font-medium text-luxury-gold uppercase">
                {siteSettings.logoSubtitle}
              </span>
            </span>
          </div>

          {/* Desktop Navigation Links - Centered */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActivePage(link.id)}
                  className={`text-sm tracking-widest uppercase transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? 'text-luxury-gold font-medium border-b border-luxury-gold pb-1'
                      : 'text-luxury-charcoal/75 hover:text-luxury-gold pb-1'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Icon Utility Controls - Right */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Account Profile */}
            <button
              onClick={() => {
                if (currentUser) {
                  setActivePage('account');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="p-2 text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-200 relative group cursor-pointer"
              title={currentUser ? `Welcome, ${currentUser.fullName}` : 'Account Login'}
            >
              <User className="w-[22px] h-[22px]" />
              {currentUser && (
                <span className="absolute h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#FAF7F2] top-2 right-2" />
              )}
            </button>

            {/* Premium Universal Theme Toggle (Sun/Moon) */}
            <button
              id="theme-toggle-desktop"
              onClick={toggleTheme}
              className="p-2 text-luxury-charcoal hover:text-luxury-gold duration-200 relative cursor-pointer"
              title={theme === 'dark' ? 'Activate Light Elegance' : 'Activate Midnight Velvet'}
              aria-label="Universal Theme Toggle"
            >
              {theme === 'dark' ? (
                <Sun className="w-[21px] h-[21px] stroke-[1.8] text-luxury-gold" />
              ) : (
                <Moon className="w-[21px] h-[21px] stroke-[1.8] text-luxury-charcoal/80" />
              )}
            </button>

            {/* Saved Favorites */}
            <button
              onClick={() => {
                if (currentUser) {
                  setActivePage('account');
                } else {
                  // Direct to account where favorites are shown, or alert
                  setActivePage('account');
                  // Trigger quick toast or indicator
                }
              }}
              className="p-2 text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-200 relative cursor-pointer"
              title="Saved Favorites"
            >
              <Heart className="w-[22px] h-[22px]" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-sans font-semibold leading-none text-white bg-luxury-rose rounded-full">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-200 relative cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-[22px] h-[22px]" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-sans font-semibold leading-none text-white bg-luxury-gold rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-luxury-charcoal/80 hover:text-luxury-gold lg:hidden transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] dark:bg-[#1E1D1A] border-t border-[#F0EAE1] dark:border-[#F0EAE1]/10 slide-in-down">
          <div className="space-y-1 px-4 py-6">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActivePage(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-3 rounded-md text-base tracking-widest uppercase transition-colors duration-200 ${
                    isActive
                      ? 'bg-luxury-gold/10 text-luxury-gold font-medium'
                      : 'text-luxury-charcoal/80 dark:text-[#E0E0E0]/80 hover:bg-[#F3EDE2] dark:hover:bg-neutral-800'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Mobile Theme Switcher */}
            <div className="border-t border-[#F0EAE1]/30 dark:border-white/10 mt-4 pt-4 px-3">
              <button
                id="theme-toggle-mobile"
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-between text-left text-sm tracking-widest uppercase text-luxury-charcoal/80 dark:text-[#E0E0E0]/80 py-2 hover:text-luxury-gold duration-200 cursor-pointer"
              >
                <span>Theme: {theme === 'dark' ? 'Midnight' : 'Luxury Light'}</span>
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-luxury-gold stroke-[1.5]" />
                ) : (
                  <Moon className="w-5 h-5 text-luxury-gold stroke-[1.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
