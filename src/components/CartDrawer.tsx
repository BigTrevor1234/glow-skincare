import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    discountApplied,
    applyDiscount,
    setActivePage,
    setSelectedProduct,
    triggerDevAbandonedCart,
    abandonedCartDispatched,
    simTimePassed,
    setSimTimePassed,
    setAbandonedCartDispatched,
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isCartOpen) return null;

  // Compute values
  const subtotal = cart.reduce((total, item) => {
    const unitPrice = item.purchaseType === 'subscription' ? item.product.price * 0.85 : item.product.price;
    return total + unitPrice * item.quantity;
  }, 0);
  
  const freeShippingThreshold = 100;
  const deliveryCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15.00;
  const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  const discountAmount = discountApplied ? subtotal * (discountApplied.percent / 100) : 0;
  const calculatedTotal = subtotal - discountAmount + deliveryCost;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponCode.trim()) {
      setCouponError('Please enter a valid promotion code.');
      return;
    }

    const success = applyDiscount(couponCode);
    if (success) {
      setCouponSuccess(`Success! '${couponCode.toUpperCase()}' discount has been applied.`);
      setCouponCode('');
    } else {
      setCouponError("This code is invalid or has expired. Try applying 'GLOW20'.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-[#FAF7F2] shadow-2xl transition-all flex flex-col h-full border-l border-[#F0EAE1]">
          
          {/* Drawer Header */}
          <div className="px-6 py-6 border-b border-[#F0EAE1] flex items-center justify-between">
            <h2 className="text-xl font-serif tracking-widest text-luxury-charcoal uppercase flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-luxury-gold" />
              Your Selection
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-luxury-charcoal/60 hover:text-luxury-gold transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Indicator for Free Shipping */}
          {cart.length > 0 && (
            <div className="px-6 py-4 bg-[#F2EDE2]/60 border-b border-[#F0EAE1]">
              {subtotal >= freeShippingThreshold ? (
                <p className="text-xs font-medium text-emerald-700 tracking-wide">
                  ✨ Congratulations! Your order qualifies for **Complementary Courier Delivery**.
                </p>
              ) : (
                <div>
                  <p className="text-xs text-luxury-charcoal/90 mb-2">
                    Add <span className="font-bold font-mono">${remainingForFreeShipping.toFixed(2)}</span> more to unlock <span className="font-semibold text-luxury-gold">Free Delivery</span>
                  </p>
                  <div className="w-full bg-[#E8E2D2] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-luxury-gold h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Contents Panel */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="bg-[#F4EDE0] p-4 rounded-full mb-4">
                  <ShoppingBag className="w-8 h-8 text-luxury-rose" />
                </div>
                <h3 className="font-serif text-lg tracking-wide text-luxury-charcoal">Your bag is empty</h3>
                <p className="text-sm text-luxury-charcoal/60 mt-2 max-w-xs">
                  Discover our pure botanical collections and begin crafting your custom daily self-care routine.
                </p>
                <button
                  onClick={() => {
                    setActivePage('shop');
                    setIsCartOpen(false);
                  }}
                  className="mt-6 px-6 py-2.5 bg-luxury-charcoal text-white hover:bg-luxury-gold tracking-widest uppercase text-xs duration-300 font-medium cursor-pointer"
                >
                  Shop Warm Radiance
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#EADFC9]/50">
                {cart.map((item) => {
                  const unitPrice = item.purchaseType === 'subscription' ? item.product.price * 0.85 : item.product.price;
                  const itemKey = `${item.product.id}-${item.purchaseType || 'one-time'}-${item.subscriptionFrequency || ''}`;

                  return (
                    <div key={itemKey} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                      {/* Primary Image */}
                      <div className="w-20 h-24 bg-white flex-shrink-0 border border-[#F0EAE1] overflow-hidden group relative">
                        <img
                          src={item.product.primaryImage}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Meta Fields */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif text-sm font-semibold tracking-wide text-luxury-charcoal leading-tight hover:text-luxury-gold cursor-pointer"
                                onClick={() => {
                                  selectProductView(item.product);
                                  setIsCartOpen(false);
                                }}>
                              {item.product.name}
                            </h4>
                            <span className="font-mono text-sm text-luxury-charcoal/90 font-medium pl-2">
                              ${(unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-luxury-gold font-mono tracking-widest uppercase mt-0.5">
                            {item.product.category} • {item.product.size}
                          </p>

                          {/* Subscription frequencies badge */}
                          {item.purchaseType === 'subscription' ? (
                            <span className="inline-block mt-1.5 bg-emerald-50 text-emerald-800 text-[8.5px] font-mono font-bold uppercase tracking-widest py-0.5 px-1.5 rounded-sm">
                              ✨ Apothecary subscription ({item.subscriptionFrequency || 'Monthly'})
                            </span>
                          ) : (
                            <span className="inline-block mt-1.5 text-luxury-charcoal/40 text-[8.5px] font-mono uppercase tracking-widest leading-none">
                              One-time ritual bath
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          {/* Adjuster */}
                          <div className="flex items-center border border-[#E8E2D2] rounded bg-[#FAF7F2] py-0.5 px-2">
                            <button
                              onClick={() => updateCartQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.purchaseType || 'one-time',
                                item.subscriptionFrequency
                              )}
                              className="p-1 text-luxury-charcoal/70 hover:text-luxury-gold transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-mono font-semibold text-luxury-charcoal text-center min-w-[20px]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.purchaseType || 'one-time',
                                item.subscriptionFrequency
                              )}
                              className="p-1 text-luxury-charcoal/70 hover:text-luxury-gold transition-colors cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(
                              item.product.id,
                              item.purchaseType || 'one-time',
                              item.subscriptionFrequency
                            )}
                            className="text-luxury-charcoal/40 hover:text-rose-600 transition-colors duration-200 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Pricing Summary and Promotional Actions */}
          {cart.length > 0 && (
            <div className="bg-[#F5EFE4] border-t border-[#F0EAE1] px-6 py-6 pb-8 space-y-4">
              
              {/* Promo Panel Toggle */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (GLOW20 / ROUTINE15)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-1.5 text-xs font-mono tracking-widest text-luxury-charcoal placeholder-luxury-charcoal/45 focus:outline-hidden focus:border-luxury-gold uppercase"
                />
                <button
                  type="submit"
                  className="bg-luxury-charcoal text-[#FAF7F2] hover:bg-luxury-gold px-4 py-1.5 text-xs font-medium tracking-widest uppercase transition-colors duration-200 cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {couponError && <p className="text-[11px] text-rose-600 font-medium tracking-wide">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-700 font-medium tracking-wide">{couponSuccess}</p>}

              {/* pricing math list */}
              <div className="space-y-2.5 text-xs tracking-wider">
                <div className="flex justify-between text-luxury-charcoal/80">
                  <span>Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Promo Applied ({discountApplied.code} {discountApplied.percent}%)
                    </span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-luxury-charcoal/80">
                  <span>Courier Shipping</span>
                  <span className="font-mono">
                    {deliveryCost === 0 ? 'COMPLEMENTARY' : `$${deliveryCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="border-t border-[#E5DFC9] pt-3 flex justify-between text-sm text-luxury-charcoal font-semibold font-serif">
                  <span className="tracking-widest uppercase">Est. Total</span>
                  <span className="font-mono">${calculatedTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setActivePage('shop'); // Go to checkout on Shop, or direct checkout flow
                    // Let's open the custom checkout flow!
                    // Wait, we can set activePage to 'account' or we can set up a direct full-screen Checkout.
                    // Let's create a custom 'checkout' sub-view which we can set! Wait, let's allow activePage 'account' or add 'account' checkout dashboard. Let's make a dedicated checkout experience or activePage = 'shop' checkout modal!
                    // Actually, we can add checking out right on activePage 'account' or as a global view 'account' / checkout tab.
                    // Let's route directly to our checkout process! Let's update activePage with 'shop' and open a checkout stage, or we can add 'account' checkout section. Let's make an activePage === 'account' or the user can pay. Let's redirect to 'account' or let's support a beautiful checkout view directly, say activePage = 'shop' with step 2 checkout! That is extremely clever. Or even better: we can add activePage = 'shop' and trigger an inline checkout state, or direct page 'account' (which is simple and handles orders perfectly!).
                    // Let's make an activePage = 'account' but with a direct checkout tab, or we can add activePage = 'shop' which has a subtotal checkout view! Let's do activePage = 'shop' (or activePage = 'account' with dynamic redirect).
                    // In useApp activePageState, let's check: we can direct the user to activePage = 'account' where their checkout screen is fully simulated, or we can make a dedicated 'account' view. Wait! Let's check activePage in useApp: we have 'account' as a choice! Let's route activePage directly to 'account', and if cart is populated, automatically trigger the checkout sequence! That is extremely smooth and logical!
                    setActivePage('account');
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-[#1E1D1A] text-white hover:bg-luxury-gold py-3.5 text-xs font-semibold tracking-widest uppercase text-center duration-300 shadow-xs cursor-pointer"
                >
                  Acquire Warm Radiance • ${(calculatedTotal).toFixed(2)}
                </button>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-luxury-charcoal/50 uppercase tracking-widest font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-luxury-gold" />
                  Secure, Encrypted checkout protected by SSL
                </div>

                {/* 🧪 Localhost Abandoned Cart SMTP Simulation Control Hub */}
                <div className="p-3.5 bg-white border border-dashed border-[#C29F6F]/40 rounded-sm space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#C29F6F]">
                      🧪 Localhost SMTP Testsuite
                    </span>
                    <span className="inline-block bg-[#C29F6F]/10 text-[#C29F6F] font-mono text-[8px] px-1.5 py-0.5 rounded font-bold">
                      2-Hour Delay SIM
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-luxury-charcoal/65 leading-relaxed font-sans">
                    Test the automatic, email-driven reminder loops. Simulates leaves-cart timeout of 2 hours.
                  </p>
                  
                  {abandonedCartDispatched ? (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-sm text-[10.5px] space-y-1.5 leading-relaxed">
                      <p className="font-semibold text-[10.5px] font-mono uppercase text-[#C29F6F] flex items-center gap-1 leading-none pt-0.5">
                        📨 [SMTP_LOG] DISPATCHED: "Don't Forget Your Glow"
                      </p>
                      <p className="text-gray-600">
                        Reminder email simulation sent! Switch to the **User Dashboard & Inbox** (Account tab) to see the interactive recovery email template and resume your session.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setAbandonedCartDispatched(false);
                          setSimTimePassed(false);
                        }}
                        className="text-[9.5px] font-mono text-[#C29F6F] hover:text-[#1E1D1A] underline block uppercase font-bold cursor-pointer"
                      >
                        Reset SMTP Simulator
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => triggerDevAbandonedCart()}
                      className="w-full bg-[#FAF7F2] hover:bg-[#1E1D1A] hover:text-white text-luxury-charcoal text-[9.5px] font-mono uppercase border border-[#CBD8CE] tracking-wider py-1.5 transition-colors font-semibold cursor-pointer"
                    >
                      Trigger Simulated Abandoned Cart Email
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  // Helper trigger to browse the product detail
  function selectProductView(product: any) {
    setSelectedProduct(product);
    setActivePage('product-detail');
  }
}
