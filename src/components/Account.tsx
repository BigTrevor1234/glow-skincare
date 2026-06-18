import React from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data';
import { Product } from '../types';
import { useState } from 'react';
import { Lock, Mail, User, ShieldCheck, Heart, FileText, Check, Truck, Eye, LogOut, Trash2, ShoppingBag, CreditCard, Inbox, RefreshCw, Gift, Clock } from 'lucide-react';

export default function Account() {
  const {
    currentUser,
    loginUser,
    logoutUser,
    favorites,
    toggleFavorite,
    setSelectedProduct,
    setActivePage,
    cart,
    orders,
    placeOrder,
    pointsRedeemed,
    setPointsRedeemed,
    siteSettings,
    subscriptions,
    updateSubscriptionStatus,
    abandonedCartDispatched,
    dispatchedCartContent,
    simTimePassed,
    setAbandonedCartDispatched,
    setSimTimePassed,
    addToCart,
    updateCartQuantity,
    setIsCartOpen
  } = useApp();

  // Authentication Fields
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Checkout Fields
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [checkoutError, setCheckoutError] = useState('');
  const [orderCreated, setOrderCreated] = useState<any | null>(null);

  // Expanded order tracks (stores order ID of currently inspected tracking bar)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Authentication Submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email.trim()) {
      setLoginError('Email address is required.');
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setLoginError('Please provide your full name for membership.');
      return;
    }

    // Capture or register session
    loginUser(email, isSignUp ? fullName : fullName || 'Valued Client');
  };

  // Secure Checkout Submit
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (!addressLine.trim() || !city.trim() || !stateCode.trim() || !zip.trim()) {
      setCheckoutError('Please populate all shipping address fields.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
        setCheckoutError('Please enter a valid 16-digit credit card number.');
        return;
      }
      if (!expiry.match(/^\d{2}\/\d{2}$/)) {
        setCheckoutError('Please enter expiry in MM/YY format.');
        return;
      }
      if (!cvv.match(/^\d{3}$/)) {
        setCheckoutError('Please enter a valid 3-digit CVV code.');
        return;
      }
    }

    // Place Order
    const info = { addressLine, city, state: stateCode, zip, country };
    const successOrder = placeOrder(info, paymentMethod);

    if (successOrder) {
      setOrderCreated(successOrder);
      setIsCheckingOut(false);
      // Clean checkout form fields
      setAddressLine('');
      setCity('');
      setStateCode('');
      setZip('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
    } else {
      setCheckoutError('An issue occurred placing your selection. Is your cart empty?');
    }
  };

  // Compute Cart pricing totals with subscription specific discounts & loyalty point savings
  const subtotal = cart.reduce((total, item) => {
    const unitPrice = item.purchaseType === 'subscription' ? item.product.price * 0.85 : item.product.price;
    return total + unitPrice * item.quantity;
  }, 0);
  
  const pointsDollarSaving = pointsRedeemed / (siteSettings.pointsNeededForOneDollar || 10);
  const deliveryCost = subtotal - pointsDollarSaving >= 100 || subtotal === 0 ? 0 : 15.00;
  const tax = Math.max(0, subtotal - pointsDollarSaving) * 0.08;
  const totalCost = Math.max(0, subtotal + deliveryCost + tax - pointsDollarSaving);

  // Unpack favorited items
  const favoritedProducts = PRODUCTS.filter((p) => favorites.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* CASE A: USER NOT LOGGED IN */}
      {!currentUser ? (
        <div className="max-w-md mx-auto bg-white border border-[#E9DFCB]/50 rounded-sm shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[9px] font-mono tracking-widest text-[#C29F6F] uppercase font-bold">
              Membership Program
            </span>
            <h1 className="text-2xl font-serif font-normal text-luxury-charcoal">
              {isSignUp ? 'Create Glow Account' : 'Access Your Profile'}
            </h1>
            <div className="w-10 h-0.5 bg-luxury-gold mx-auto" />
            <p className="text-[11.5px] text-luxury-charcoal/60 leading-relaxed font-light">
              Track formulations order progress, manage custom routine sets, and curate your chemical favorites listing.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-widest text-luxury-charcoal/65 uppercase block font-semibold">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-charcoal/30" />
                  <input
                    type="text"
                    placeholder="E.g., Charlotte Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E0D8C8] pl-10 pr-4 py-2 text-xs tracking-wider text-luxury-charcoal focus:outline-hidden focus:border-luxury-gold rounded-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-widest text-luxury-charcoal/65 uppercase block font-semibold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-charcoal/30" />
                <input
                  type="email"
                  placeholder="E.g., client@glowbeauty.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E0D8C8] pl-10 pr-4 py-2 text-xs tracking-wider text-luxury-charcoal focus:outline-hidden focus:border-luxury-gold rounded-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-widest text-luxury-charcoal/65 uppercase block font-semibold">
                Passphrase
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-charcoal/30" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E0D8C8] pl-10 pr-4 py-2 text-xs tracking-wider text-luxury-charcoal focus:outline-hidden focus:border-luxury-gold rounded-sm"
                />
              </div>
            </div>

            {loginError && <p className="text-[11px] text-rose-600 font-medium tracking-wide">{loginError}</p>}

            <button
              type="submit"
              className="w-full bg-[#1E1D1A] hover:bg-luxury-gold text-white tracking-widest uppercase text-xs py-3.5 font-semibold transition-colors duration-250 cursor-pointer shadow-xs"
            >
              {isSignUp ? 'Verify & Create Membership' : 'Sign In Safely'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setLoginError('');
              }}
              className="text-[11px] font-mono uppercase tracking-widest text-luxury-gold underline hover:text-luxury-charcoal cursor-pointer"
            >
              {isSignUp ? 'Already registered? Sign In' : 'New client? Open Account'}
            </button>
          </div>

          <div className="pt-4 border-t border-[#F0EAE1] flex justify-center items-center gap-1.5 text-[10px] text-luxury-charcoal/40 uppercase tracking-widest font-mono">
            <ShieldCheck className="w-4 h-4 text-luxury-gold" /> Protected Customer Portal System
          </div>
        </div>
      ) : (
        
        // CASE B: USER LOGGED IN
        <div className="space-y-12">
          
          {/* Header Dashboard section */}
          <section className="bg-white border border-[#E9DFCB]/50 p-6 sm:p-8 rounded-sm shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#C29F6F] uppercase block font-bold">
                MEMBER DASHBOARD
              </span>
              <h1 className="text-2xl sm:text-3xl text-luxury-charcoal font-serif font-normal">
                Welcome Back, <span className="italic">{currentUser.fullName}</span>
              </h1>
              <p className="text-xs text-luxury-charcoal/50 leading-relaxed font-light font-sans flex items-center gap-2">
                Registered Email: <span className="font-semibold text-luxury-charcoal">{currentUser.email}</span> • Status: Tier 1 Radiant Client
              </p>
            </div>

            <button
              onClick={logoutUser}
              className="px-4 py-2 border border-[#E9DFC0]/80 h-fit rounded text-xs font-mono tracking-widest text-luxury-charcoal hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer flex items-center gap-1 bg-[#FAF7F2]"
            >
              <LogOut className="w-3.5 h-3.5" /> LOGOUT
            </button>
          </section>

          {/* DYNAMIC SUCCESS OVERLAY SPLASH IF ORDER COMPLETED */}
          {orderCreated && (
            <div className="bg-emerald-50 border-2 border-emerald-200 p-6 sm:p-8 rounded-sm space-y-4 animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 py-1.5 px-4 bg-emerald-700 text-white font-mono text-[9px] tracking-widest uppercase rounded-bl shadow-xs">
                PLACED SECURELY
              </div>
              <div className="flex gap-4 items-start sm:items-center">
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-emerald-900 leading-none">Your Order has been Placed Successfully!</h3>
                  <p className="text-xs text-emerald-800 font-light mt-1 max-w-xl">
                    An ethereal beauty batch allocation receipt was delivered to <span className="font-bold">{currentUser.email}</span>. Your custom elixirs are currently entering chemical molecular packaging.
                  </p>
                </div>
              </div>

              {/* Order specifics */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-white/70 border border-emerald-150 rounded text-xs font-mono text-luxury-charcoal/80 pt-4 mt-2">
                <div>
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">ORDER NUMBER:</span>
                  <span className="text-sm font-semibold">{orderCreated.id}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">CARRIER ASSIGNED:</span>
                  <span className="text-sm font-semibold">{orderCreated.trackingCarrier}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">TRACKING CODE:</span>
                  <span className="text-sm font-semibold text-luxury-gold underline cursor-pointer"
                        onClick={() => {
                          setExpandedOrderId(orderCreated.id);
                          setOrderCreated(null);
                        }}>
                    {orderCreated.trackingNumber}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-500 font-bold uppercase">TOTAL DEBT PAID:</span>
                  <span className="text-sm font-semibold">${orderCreated.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => setOrderCreated(null)}
                  className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-800 underline hover:text-luxury-charcoal"
                >
                  Dismiss Banner
                </button>
              </div>
            </div>
          )}

          {/* DUAL CHECKOUT ENGINE PANEL MODE (Shows if client clicked checkout and has item) */}
          {isCheckingOut && cart.length > 0 && (
            <section className="bg-white border border-[#E9DFCB]/50 p-6 sm:p-10 rounded-sm shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              
              {/* Form Block (7/12 width) */}
              <form onSubmit={handleCheckoutSubmit} className="lg:col-span-7 space-y-6">
                <div className="flex justify-between items-center border-b border-[#FAF7F2] pb-3">
                  <h2 className="font-serif text-lg tracking-wide text-luxury-charcoal flex items-center gap-1.5 font-semibold">
                    <CreditCard className="w-5 h-5 text-luxury-gold" />
                    Enter Checkout Details
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckingOut(false);
                      setCheckoutError('');
                    }}
                    className="text-xs font-sans text-luxury-charcoal/50 hover:text-luxury-gold uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {/* Shipping info Address */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono tracking-widest uppercase text-luxury-gold font-bold">1. Shipping Destination</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-mono tracking-widest text-luxury-charcoal/65 uppercase block">Address Line</label>
                      <input
                        type="text"
                        placeholder="E.g., 546 Ethereal Gardens, Suite B"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-1.5 text-xs text-luxury-charcoal focus:outline-hidden focus:border-luxury-gold rounded-sm"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-mono tracking-widest text-luxury-charcoal/65 uppercase block">City</label>
                        <input
                          type="text"
                          placeholder="E.g., Beverly Hills"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-1.5 text-xs text-luxury-charcoal focus:outline-hidden focus:border-luxury-gold rounded-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono tracking-widest text-[#1E1D1A]/65 uppercase block">State</label>
                        <input
                          type="text"
                          placeholder="E.g., CA"
                          value={stateCode}
                          onChange={(e) => setStateCode(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-1.5 text-xs text-luxury-charcoal focus:outline-hidden focus:border-luxury-gold rounded-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono tracking-widest text-luxury-charcoal/65 uppercase block">Zip / Post</label>
                        <input
                          type="text"
                          placeholder="E.g., 90210"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="w-full bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-1.5 text-xs text-luxury-charcoal focus:outline-hidden focus:border-luxury-gold rounded-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Cards Payment Details */}
                <div className="space-y-4 pt-2 border-t border-[#FAF7F2]">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-mono tracking-widest uppercase text-luxury-gold font-bold">2. Payment Protocol</h3>
                    
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`px-3 py-1 text-[10px] tracking-widest uppercase font-mono rounded ${
                          paymentMethod === 'card'
                            ? 'bg-luxury-gold text-white font-medium'
                            : 'bg-white border border-[#E0D8C8]/50 text-luxury-charcoal/80'
                        }`}
                      >
                        CREDIT CARD
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`px-3 py-1 text-[10px] tracking-widest uppercase font-mono rounded ${
                          paymentMethod === 'paypal'
                            ? 'bg-luxury-gold text-white font-medium'
                            : 'bg-white border border-[#E0D8C8]/50 text-luxury-charcoal/80'
                        }`}
                      >
                        PAYPAL
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'card' ? (
                    <div className="space-y-3 p-4 bg-[#FAF8F3] border border-[#EADFC9]/50 rounded-sm">
                      <div>
                        <label className="text-[10px] font-mono tracking-widest text-luxury-charcoal/65 uppercase block">Card Number</label>
                        <input
                          type="text"
                          placeholder="E.g., 4111 2222 3333 4444"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white border border-[#E0D8C8] px-3 py-1.5 text-xs text-luxury-charcoal focus:outline-hidden focus:border-luxury-gold rounded-sm font-mono tracking-widest"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-mono tracking-widest text-[#1E1D1A]/65 uppercase block">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="w-full bg-white border border-[#E0D8C8] px-3 py-1.5 text-xs text-luxury-charcoal focus:outline-hidden focus:border-luxury-gold rounded-sm font-mono tracking-widest"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono tracking-widest text-luxury-charcoal/65 uppercase block">CVV Code</label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength={3}
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="w-full bg-white border border-[#E0D8C8] px-3 py-1.5 text-xs text-luxury-charcoal focus:outline-hidden focus:border-luxury-gold rounded-sm font-mono tracking-widest"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-[#F2EDE2]/60 border border-[#E9DFCB]/40 rounded-sm text-center text-xs space-y-2 text-[#1E1D1A]/85 font-light">
                      <p>✨ Continuing via PayPal: You will log in securely to complete funds verification inside the checkout modal panel.</p>
                    </div>
                  )}
                </div>

                {checkoutError && <p className="text-[11px] text-rose-600 font-medium tracking-wide">{checkoutError}</p>}

                <button
                  type="submit"
                  className="w-full bg-luxury-charcoal hover:bg-emerald-800 text-[#FAF7F2] tracking-widest uppercase text-xs py-3.5 font-bold transition-colors duration-300 shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-luxury-gold animate-pulse" /> Confirm Payment • ${totalCost.toFixed(2)}
                </button>
              </form>

              {/* Summary pricing list (5/12 width) */}
              <div className="lg:col-span-5 bg-[#FAF8F3] border border-[#EADFC9]/50 p-6 rounded-sm space-y-4">
                <h3 className="font-serif text-sm font-bold text-luxury-charcoal tracking-wide border-b border-[#FAF7F2] pb-2 uppercase">
                  Checkout Summary
                </h3>

                <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                  {cart.map((item) => {
                    const unitPrice = item.purchaseType === 'subscription' ? item.product.price * 0.85 : item.product.price;
                    const itemKey = `${item.product.id}-${item.purchaseType || 'one-time'}-${item.subscriptionFrequency || ''}`;

                    return (
                      <div key={itemKey} className="flex flex-col gap-0.5 text-xs text-luxury-charcoal/80 border-b border-[#FAF7F2]/50 pb-2">
                        <div className="flex gap-2">
                          <span className="font-bold underline text-[11px] font-mono shrink-0">{item.quantity}x</span>
                          <span className="truncate flex-1 font-medium">{item.product.name}</span>
                          <span className="font-mono text-luxury-charcoal/90 ml-2">${(unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                        {item.purchaseType === 'subscription' ? (
                          <span className="text-[9px] text-emerald-700 font-mono tracking-widest uppercase pl-6">
                            ✨ APOTHECARY SUB ({item.subscriptionFrequency}) • SAVE 15%
                          </span>
                        ) : (
                          <span className="text-[9px] text-[#C29F6F] font-mono tracking-widest uppercase pl-6">
                            SINGLE RITUAL ALLOCATION
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Glow Points redemption controller right inside Summary */}
                {currentUser && currentUser.glowPoints && currentUser.glowPoints > 0 ? (
                  <div className="pt-3 border-t border-dashed border-[#EADFC0]/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-wider text-[#C29F6F] uppercase font-bold flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5 text-luxury-gold" /> Redeem Glow Points
                      </span>
                      <span className="text-[10px] text-luxury-charcoal/60 font-mono font-bold">
                        Balance: {currentUser.glowPoints} Points (${(currentUser.glowPoints / (siteSettings.pointsNeededForOneDollar || 10)).toFixed(2)})
                      </span>
                    </div>
                    
                    <div className="bg-[#FAF7F2] p-2.5 border border-[#E0D8C8]/60 rounded-xs space-y-2">
                      <p className="text-[9px] leading-relaxed text-luxury-charcoal/70">
                        Redeem points to receive cash savings. Convert rate is **{siteSettings.pointsNeededForOneDollar || 10} points = $1.00** discount.
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max={currentUser.glowPoints}
                          step={siteSettings.pointsNeededForOneDollar || 10}
                          value={pointsRedeemed}
                          onChange={(e) => setPointsRedeemed(parseInt(e.target.value) || 0)}
                          className="flex-1 accent-luxury-gold cursor-pointer"
                        />
                        <span className="font-mono text-[10.5px] font-bold text-luxury-charcoal bg-white border border-[#E0D8C8] px-2 py-0.5 rounded-xs shrink-0">
                          {pointsRedeemed} Pts
                        </span>
                      </div>
                      
                      {pointsRedeemed > 0 && (
                        <div className="flex justify-between items-center text-[9.5px] font-mono font-black text-emerald-800 tracking-wider">
                          <span>LOYALTY DISCOUNT APPLIED:</span>
                          <span>-${pointsDollarSaving.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                <div className="border-t border-[#EADBC0]/50 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-luxury-charcoal/70">
                    <span>Subtotal</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {pointsRedeemed > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Glow Points Discount</span>
                      <span className="font-mono">-${pointsDollarSaving.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-luxury-charcoal/70">
                    <span>Express Shipping</span>
                    <span className="font-mono">
                      {deliveryCost === 0 ? 'COMPLEMENTARY' : `$${deliveryCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-luxury-charcoal/70">
                    <span>Sales Tax (8%)</span>
                    <span className="font-mono">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-[#EADFC0]/60 pt-3 flex justify-between text-sm font-bold text-luxury-charcoal font-serif">
                    <span>Grand Total</span>
                    <span className="font-mono">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </section>
          )}

          {/* GRID: LEFT ORDERS LIST TRACKER & RIGHT SAVED FAVORITES LIST */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: ORDERS & ACTIVE RECURRING SUBSCRIPTIONS */}
            <div className="lg:col-span-7 space-y-6">
              {/* Orders list block */}
              <section className="bg-white border border-[#E9DFCB]/50 p-6 rounded-sm shadow-xs space-y-6">
              <h2 className="text-xl font-serif text-luxury-charcoal border-b border-[#FAF7F2] pb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-luxury-rose" />
                Dermal Allocation Orders
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center text-luxury-charcoal/50">
                  <ShoppingBag className="w-8 h-8 text-luxury-gold/50 mb-2 animate-bounce" />
                  <p className="text-xs font-light max-w-xs leading-relaxed">
                    No active beauty orders found on this profile register. Populate your Selection and click "Acquire Warm Radiance" to submit.
                  </p>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setIsCheckingOut(true)}
                      className="mt-4 px-4 py-2 bg-luxury-charcoal text-[#FAF7F2] hover:bg-luxury-gold text-[10px] font-mono tracking-widest uppercase font-semibold cursor-pointer"
                    >
                      Process Your Cart
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;
                    return (
                      <div
                        key={order.id}
                        className="border border-[#F2EDE2] rounded p-4 font-sans space-y-3.5 hover:shadow-md transition-shadow bg-[#FAF8F3]/50"
                      >
                        {/* Summary Header */}
                        <div className="flex justify-between items-start text-xs border-b border-[#FAF7F2] pb-3">
                          <div>
                            <span className="text-[10px] text-gray-500 font-mono block">ALLOCATION SUMMARY:</span>
                            <span className="font-mono font-bold text-sm text-luxury-charcoal">{order.id}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 font-mono block">ORDER DATE:</span>
                            <span className="font-semibold">{order.orderDate}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 font-mono block">GRAND DEBT:</span>
                            <span className="font-mono font-bold text-luxury-charcoal">${order.total.toFixed(2)}</span>
                          </div>

                          <button
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="px-2.5 py-1.5 border border-luxury-charcoal/10 rounded font-mono text-[9.5px] uppercase tracking-wider text-luxury-charcoal hover:bg-[#FAF7F2] flex items-center gap-1 bg-white cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5 text-luxury-gold animate-bounce" /> TRACK SHIPMENT
                          </button>
                        </div>

                        {/* Expandable Luxury allocation timeline status tracker details */}
                        {isExpanded && (
                          <div className="pt-2 space-y-5 animate-fade-in">
                            
                            {/* Visual tracking timeline dots */}
                            <div className="relative pt-2 pb-1">
                              {/* Connector line */}
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-[85%] bg-gray-200 h-0.5 z-0 hidden sm:block" />
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-[60%] bg-luxury-gold h-0.5 z-0 hidden sm:block" />

                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10 text-[11px]">
                                
                                <div className="flex sm:flex-col items-center gap-3 sm:gap-1.5 sm:text-center text-emerald-800 font-semibold">
                                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-mono text-xs font-bold shrink-0">
                                    <Check className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="block">Order Received</span>
                                    <span className="text-[9px] text-gray-500 block font-normal">Approved</span>
                                  </div>
                                </div>

                                <div className="flex sm:flex-col items-center gap-3 sm:gap-1.5 sm:text-center text-emerald-800 font-semibold">
                                  <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-mono text-xs font-bold shrink-0">
                                    <Check className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="block">Algae Allocation</span>
                                    <span className="text-[9px] text-gray-500 block font-normal">Batch Checked</span>
                                  </div>
                                </div>

                                <div className="flex sm:flex-col items-center gap-3 sm:gap-1.5 sm:text-center text-luxury-gold font-bold">
                                  <div className="w-8 h-8 rounded-full bg-luxury-gold/10 border-2 border-luxury-gold flex items-center justify-center text-luxury-gold font-mono text-xs font-bold shrink-0 animate-pulse">
                                    3
                                  </div>
                                  <div>
                                    <span className="block">Courier Dispatch</span>
                                    <span className="text-[9px] text-gray-400 block font-normal">In Transit</span>
                                  </div>
                                </div>

                                <div className="flex sm:flex-col items-center gap-3 sm:gap-1.5 sm:text-center text-gray-400">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                                    4
                                  </div>
                                  <div>
                                    <span className="block">Client Hand-off</span>
                                    <span className="text-[9px] text-gray-300 block font-normal">Est. Today PM</span>
                                  </div>
                                </div>

                              </div>
                            </div>

                            {/* Carrier and tracking identifiers */}
                            <div className="p-3 bg-white border border-[#E9DFCB]/50 text-xs rounded space-y-1.5">
                              <div className="flex justify-between font-mono text-[10px] text-gray-500 uppercase font-bold">
                                <span>SHIPPING PARTNER:</span>
                                <span>TRACKING CODE:</span>
                              </div>
                              <div className="flex justify-between font-sans text-[13px] font-semibold text-luxury-charcoal">
                                <span>{order.trackingCarrier}</span>
                                <span className="font-mono text-luxury-gold underline">{order.trackingNumber}</span>
                              </div>
                              <p className="text-[11px] text-luxury-charcoal/60 leading-relaxed font-light pt-1">
                                Packaging departed our Switzerland distribution base. Hand-off predicted by end of business day at **{order.shippingAddress.addressLine}, {order.shippingAddress.city}**.
                              </p>
                            </div>

                            {/* Item list details inside tracking drawer */}
                            <div className="space-y-2 border-t border-[#FAF7F2] pt-4">
                              <span className="text-[9.5px] font-mono tracking-widest text-[#1E1D1A]/50 uppercase font-bold block">CONTAINMENT ITEM LIST:</span>
                              <div className="space-y-2.5">
                                {order.items.map((item) => (
                                  <div key={item.product.id} className="flex gap-3 text-xs items-center justify-between">
                                    <div className="flex gap-2 items-center truncate">
                                      <span className="font-mono font-bold bg-[#EADFC0]/20 border border-[#EADFC0]/40 px-1 text-[11px]">{item.quantity}x</span>
                                      <span className="truncate">{item.product.name}</span>
                                    </div>
                                    <span className="font-mono font-semibold">${item.product.price.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Active Subscriptions Module */}
            <section className="bg-white border border-[#E9DFCB]/50 p-6 rounded-sm shadow-xs space-y-6">
              <h2 className="text-xl font-serif text-luxury-charcoal border-b border-[#FAF7F2] pb-3 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-800" />
                Apothecary Custom Subscriptions
              </h2>

              {subscriptions.filter(sub => sub.userEmail === currentUser.email).length === 0 ? (
                <div className="text-center py-10 flex flex-col items-center justify-center text-luxury-charcoal/50">
                  <Clock className="w-8 h-8 text-emerald-800/30 mb-2" />
                  <p className="text-xs font-light max-w-xs leading-relaxed">
                    You have no active subscription formulas currently in your routine. Save 15% on any botanical formulation on its details panel by choosing Subscribe & Save.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptions.filter(sub => sub.userEmail === currentUser.email).map((sub) => {
                    const productObj = PRODUCTS.find(p => p.id === sub.productId);
                    if (!productObj) return null;
                    const discountedPrice = productObj.price * 0.85;

                    return (
                      <div
                        key={sub.id}
                        className="border border-emerald-100 rounded-sm p-4 font-sans bg-emerald-50/5 hover:shadow-sm duration-200 space-y-3"
                      >
                        <div className="flex justify-between items-start text-xs border-b border-emerald-100/40 pb-2 font-mono">
                          <div>
                            <span className="text-[10.5px] text-emerald-800 block font-bold leading-none mb-0.5">SUBSCRIPTION REGISTER:</span>
                            <span className="text-xs text-luxury-charcoal">{sub.id}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block">RECURRENCE CYCLE:</span>
                            <span className="text-[10px] font-bold text-emerald-800 uppercase bg-emerald-100/40 px-1.5 py-0.5 rounded leading-none">
                              {sub.frequency}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block">NEXT SHIPMENT:</span>
                            <span className="font-sans text-xs font-semibold leading-none">{sub.nextBillingDate}</span>
                          </div>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div className="w-12 h-14 bg-white border border-[#E8E2D2] overflow-hidden shrink-0 rounded-xs">
                            <img
                              src={productObj.primaryImage}
                              alt={productObj.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-xs sm:text-sm font-semibold text-luxury-charcoal truncate">
                              {productObj.name}
                            </h4>
                            <p className="text-[10px] text-luxury-gold font-mono uppercase tracking-wider">{productObj.category} • {productObj.size}</p>
                            <p className="text-xs font-semibold text-luxury-charcoal flex items-center gap-1.5 mt-0.5">
                              Price: <span className="font-mono text-emerald-800 font-bold">${discountedPrice.toFixed(2)}</span>
                              <span className="text-[9px] text-[#C29F6F] font-mono">(15% Save Applied)</span>
                            </p>
                          </div>

                          <div className="flex flex-col gap-1.5 shrink-0 text-right">
                            <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono uppercase tracking-wider font-bold text-center ${
                              sub.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-855'
                            }`}>
                              {sub.status}
                            </span>
                            
                            {sub.status === 'Active' ? (
                              <button
                                onClick={() => updateSubscriptionStatus(sub.id, 'Paused')}
                                className="px-2 py-1 text-[9px] font-mono tracking-wider font-bold uppercase bg-white border border-[#E0D8C8] text-[#1E1D1A] hover:bg-amber-50 hover:text-amber-700 transition-colors rounded-xs shrink-0 cursor-pointer"
                              >
                                Pause Item
                              </button>
                            ) : sub.status === 'Paused' ? (
                              <button
                                onClick={() => updateSubscriptionStatus(sub.id, 'Active')}
                                className="px-2 py-1 text-[9px] font-mono tracking-wider font-bold uppercase bg-emerald-850 text-white hover:bg-emerald-950 transition-colors rounded-xs shrink-0 cursor-pointer"
                              >
                                Resume Item
                              </button>
                            ) : null}

                            {sub.status !== 'Cancelled' && (
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you certain you wish to cancel this recurring subscription?')) {
                                    updateSubscriptionStatus(sub.id, 'Cancelled');
                                  }
                                }}
                                className="text-[9px] font-mono text-rose-600 hover:text-rose-800 underline uppercase mt-0.5 text-center cursor-pointer"
                              >
                                Cancel Contract
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: LOYALTY CARD, SMTP INBOX LOGS, AND SAVED FAVORITES */}
          <div className="lg:col-span-5 space-y-6">
            {/* Glow Points rewards balance status box */}
            <section className="bg-white border border-[#EADFC9]/50 p-6 rounded-sm shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-full bg-orange-50 text-luxury-gold shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-[#C29F6F] uppercase block font-bold leading-none mb-1">
                    GLOW LOYALTY BALANCE
                  </span>
                  <h2 className="text-xl font-serif text-luxury-charcoal font-semibold leading-none">
                    {currentUser.glowPoints || 0} <span className="text-xs font-sans text-luxury-charcoal/50 font-normal">Points Accumulation</span>
                  </h2>
                </div>
              </div>

              <div className="text-xs space-y-2.5 text-luxury-charcoal/80 leading-relaxed font-light border-t border-[#FAF7F2] pt-3">
                <p>
                  Accumulate <span className="font-semibold text-[#CBD8CE] bg-[#1E1D1A] px-1.5 py-0.5 rounded text-[10.5px]">1 Glow Point per $1.00 spent</span> on skin formulations.
                </p>
                
                <div className="bg-[#FAF8F3] p-3 border border-[#EADFC0]/50 rounded-xs font-mono text-[10px] space-y-1">
                  <span className="block font-bold uppercase text-[#C29F6F] text-[9px] tracking-wider mb-0.5">conversion metrics:</span>
                  <div className="flex justify-between font-mono">
                    <span>Rate:</span>
                    <span>{siteSettings.pointsNeededForOneDollar || 10} Points = $1.00 Credit</span>
                  </div>
                  <div className="flex justify-between border-t border-[#EADFC0]/20 pt-1 mt-1 text-emerald-800 font-bold font-mono">
                    <span>Redeemable Cash Credit:</span>
                    <span>${((currentUser.glowPoints || 0) / (siteSettings.pointsNeededForOneDollar || 10)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 📨 Simulated Sandbox Mailbox */}
            {abandonedCartDispatched && (
              <section className="bg-white border-2 border-dashed border-[#C29F6F]/40 p-5 rounded-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-2 font-mono">
                  <h3 className="text-xs tracking-widest text-[#C29F6F] uppercase font-bold flex items-center gap-1.5 leading-none">
                    <Inbox className="w-4 h-4 text-luxury-gold animate-bounce" /> [1] Unread Notification
                  </h3>
                  <span className="bg-emerald-50 text-emerald-805 text-[8px] font-bold uppercase px-1 rounded">
                    Localhost Sandbox SMTP
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="font-serif text-sm font-semibold text-luxury-charcoal leading-snug">
                    Subject: Don't Forget Your Glow ✨
                  </h4>
                  
                  <div className="bg-[#FAF7F2] p-3 text-[10.5px] text-luxury-charcoal/90 rounded-xs border border-[#E0D8C8]/50 space-y-2 leading-relaxed">
                    <p className="font-serif italic text-gray-600">
                      Hello {currentUser.fullName || 'Radiant Client'},
                    </p>
                    <p>
                      We noticed you left botanical essentials inside your apothecary kit without submitting your selection. Our certified organic formulas are kept secure for you.
                    </p>
                    <p className="font-bold text-[#C29F6F] font-mono text-[9px] uppercase tracking-wider">
                      Left formulations:
                    </p>
                    
                    <div className="pl-3 border-l text-gray-700 space-y-1 text-[10px] font-mono bg-white p-2 border-[#CBD8CE]/40">
                      {dispatchedCartContent && dispatchedCartContent.length > 0 ? (
                        dispatchedCartContent.map((item, index) => (
                          <div key={`abandoned-${index}`}>
                            • <span className="font-bold text-[#C29F6F] underline">{item.quantity}x</span> {item.product.name} ({item.purchaseType === 'subscription' ? 'Apothecary Subscription' : 'Single formulation'})
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 italic">No products currently listed.</div>
                      )}
                    </div>
                    
                    <p className="text-[10px] text-luxury-charcoal/65 mt-2 border-t border-gray-100 pt-2 font-sans font-light leading-relaxed font-serif italic">
                      To warm up your day, get **10% OFF** when you resume your cart right now. Perfect skin wellness is just a few moments of self-care away!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (dispatchedCartContent && dispatchedCartContent.length > 0) {
                        dispatchedCartContent.forEach(item => {
                          addToCart(item.product, item.quantity, item.purchaseType, item.subscriptionFrequency);
                        });
                        setAbandonedCartDispatched(false);
                        setSimTimePassed(false);
                        setIsCartOpen(true);
                      }
                    }}
                    className="w-full bg-[#1E1D1A] hover:bg-luxury-gold text-white text-[10px] font-mono tracking-widest uppercase py-2.5 transition-colors font-bold text-center cursor-pointer shadow-xs"
                  >
                    Resume Apothecary Order (Get 10% Off Bonus)
                  </button>
                </div>
              </section>
            )}

            {/* Saved Favorites list block (5/12 width) */}
            <section className="lg:col-span-12 bg-white border border-[#E9DFCB]/50 p-6 rounded-sm shadow-xs space-y-6">
              <h2 className="text-xl font-serif text-luxury-charcoal border-b border-[#FAF7F2] pb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-luxury-rose fill-current" />
                Saved Favorites
              </h2>

              {favorites.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center text-luxury-charcoal/50 space-y-1.5">
                  <Heart className="w-8 h-8 text-luxury-rose/40 mb-1" />
                  <p className="text-xs font-light max-w-xs leading-relaxed">
                    Your favorites shelf is blank. Browse the apothecary catalog to bookmark high-end formulations for easy profile access.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                  {favoritedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 border border-[#F2EDE2] rounded-sm hover:shadow-xs transition-shadow flex gap-3 items-center"
                    >
                      <div className="w-12 h-14 bg-luxury-cream rounded-sm overflow-hidden flex-shrink-0">
                        <img
                          src={p.primaryImage}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <h4 className="font-serif text-xs font-semibold text-luxury-charcoal truncate">
                          {p.name}
                        </h4>
                        <p className="text-[10px] text-luxury-gold font-mono uppercase tracking-wider">{p.category} • {p.size}</p>
                        <p className="font-mono text-xs font-bold text-luxury-charcoal">${p.price.toFixed(2)}</p>
                      </div>

                      <div className="flex gap-2">
                        
                        {/* VIEW */}
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setActivePage('product-detail');
                          }}
                          className="p-1.5 bg-[#FAF7F2] border border-[#CBD9CE]/60 rounded text-luxury-charcoal/80 hover:text-luxury-gold duration-200 cursor-pointer"
                          title="Inspect formula details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => toggleFavorite(p.id)}
                          className="p-1.5 bg-[#FAF7F2] border border-[#CBD9CE]/60 rounded text-luxury-charcoal/40 hover:text-rose-600 duration-200 cursor-pointer"
                          title="Delete favorite"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>

                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>

        </div>

      </div>
    )}

  </div>
);
}
