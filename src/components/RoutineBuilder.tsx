import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data';
import { Product } from '../types';
import { useState } from 'react';
import { Sparkles, Trash2, Plus, Info, RefreshCw, ShoppingBag, Check } from 'lucide-react';

interface RoutineSlot {
  id: 'cleanse' | 'tone' | 'treat' | 'moisturize';
  label: string;
  categoryAllowed: 'Cleanser' | 'Toner' | 'Serum' | 'Moisturizer' | 'Mask';
  desc: string;
  product: Product | null;
}

export default function RoutineBuilder() {
  const { addToCart } = useApp();

  const [slots, setSlots] = useState<RoutineSlot[]>([
    { id: 'cleanse', label: '1. Cleanse Base', categoryAllowed: 'Cleanser', desc: 'Remove pollutants, sweat, and oils without stripping epidermal fats.', product: null },
    { id: 'tone', label: '2. Restorative Tone', categoryAllowed: 'Toner', desc: 'Settle epidermal pH margins and prime for continuous osmotic serum feed.', product: null },
    { id: 'treat', label: '3. Treat Actives', categoryAllowed: 'Serum', desc: 'Deliver corrective target compounds to restore brightness & lines structure.', product: null },
    { id: 'moisturize', label: '4. Seal Moisture', categoryAllowed: 'Moisturizer', desc: 'Lock active droplets beneath a breathable, defensive lipid blanket.', product: null },
  ]);

  const [activeSlotId, setActiveSlotId] = useState<'cleanse' | 'tone' | 'treat' | 'moisturize' | null>(null);

  // Retrieve products allowed for currently active slot selection panel
  const getEligibleProducts = () => {
    if (!activeSlotId) return [];
    const activeSlot = slots.find((s) => s.id === activeSlotId);
    if (!activeSlot) return [];
    return PRODUCTS.filter((p) => p.category === activeSlot.categoryAllowed);
  };

  const assignProductToSlot = (product: Product) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === activeSlotId ? { ...slot, product } : slot
      )
    );
    setActiveSlotId(null);
  };

  const removeProductFromSlot = (slotId: string) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === slotId ? { ...slot, product: null } : slot
      )
    );
  };

  const handleAddAllToCart = () => {
    const productsAdded = slots.map((s) => s.product).filter(Boolean) as Product[];
    productsAdded.forEach((product) => {
      addToCart(product, 1);
    });
    // Trigger scroll back to head cart
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic compatibility and instructions math
  const getCompatibilityExplanation = () => {
    const activeProductCount = slots.filter((s) => s.product).length;
    if (activeProductCount === 0) {
      return { rating: 0, feedback: 'Assign products to calculate biological compatibility margins.', color: 'text-luxury-charcoal/50 bg-[#F2EDE2]' };
    }
    if (activeProductCount === 1) {
      return { rating: 75, feedback: 'Single active formulation placed. Complete outer sequence slots to increase biological synergy.', color: 'text-luxury-gold bg-luxury-gold/5 border border-luxury-gold/15' };
    }
    if (activeProductCount === 2) {
      return { rating: 89, feedback: 'Strong biological compatibility. Formulations sync deeply to balance epidermal pH buffer and water columns.', color: 'text-emerald-700 bg-emerald-50 border border-emerald-100' };
    }
    
    // Check if conflicting products inside (e.g. Salicyl clay BHA cleanser + Retinol night nectar actives - both are highly active, sensitive skins might flare)
    const hasBha = slots.some((s) => s.product?.id === 'bha-cleanser');
    const hasRetinol = slots.some((s) => s.product?.id === 'retinol-elixir');

    if (hasBha && hasRetinol) {
      return {
        rating: 84,
        feedback: 'Caution: Salicyl Willow Bark and Luna Retinol are active exfoliators. Use Salicyl clay AM and Luna Retinol PM to avoid barrier sensitivity.',
        color: 'text-amber-800 bg-amber-50 border border-amber-100',
      };
    }

    return {
      rating: 98,
      feedback: 'Absolute Bio-Harmony. These formulations lock moisture, balance lipids, and speed cell renewals in highly stable ratios.',
      color: 'text-emerald-800 bg-[#EBF1EC] border border-[#CBD9CE]',
    };
  };

  const compatibility = getCompatibilityExplanation();
  const assignedProductsCount = slots.filter((s) => s.product).length;
  const totalPrice = slots.reduce((total, slot) => total + (slot.product?.price || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Narrative header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-luxury-gold font-bold">
          Customized routine curation
        </span>
        <h1 className="text-3xl font-serif font-normal text-luxury-charcoal">
          The Bespoke Sequence Builder
        </h1>
        <div className="w-12 h-0.5 bg-luxury-gold/50 mx-auto" />
        <p className="text-xs sm:text-sm text-luxury-charcoal/65 leading-relaxed font-light">
          Structure your daily morning and nocturnal self-care sequence. Assign specialized skin compounds to core operational slots and test biological compatibility indexes instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side (8/12 widths): Slot list representations */}
        <div className="lg:col-span-7 space-y-5">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={`border rounded-sm transition-all duration-300 p-5 ${
                slot.product
                  ? 'bg-white border-[#E5DFC9] shadow-xs'
                  : activeSlotId === slot.id
                  ? 'bg-luxury-gold/5 border-luxury-gold'
                  : 'bg-[#FDFCFB] border-[#EBE3D3]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Meta details */}
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold tracking-widest text-luxury-gold uppercase block">
                      {slot.label}
                    </span>
                    <span className="text-[9.5px] font-mono tracking-widest bg-[#F2EDE2] text-[#1E1D1A]/70 px-2 rounded font-medium border border-[#E9DFCB]/40">
                      REQUIRES {slot.categoryAllowed}
                    </span>
                  </div>
                  {!slot.product && (
                    <p className="text-xs text-luxury-charcoal/60 leading-relaxed font-light font-sans max-w-md">
                      {slot.desc}
                    </p>
                  )}
                </div>

                {/* Switch Actions */}
                <div className="flex-shrink-0">
                  {slot.product ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => removeProductFromSlot(slot.id)}
                        className="p-2 text-luxury-charcoal/40 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove product formulation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveSlotId(slot.id)}
                        className="p-1 px-3 border border-luxury-charcoal/10 text-[9.5px] font-mono uppercase text-luxury-charcoal hover:bg-[#FAF7F2] duration-200 cursor-pointer flex items-center gap-1 bg-white"
                      >
                        <RefreshCw className="w-3 h-3" /> Swap
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveSlotId(slot.id)}
                      className="px-4 py-2 bg-luxury-charcoal text-white hover:bg-luxury-gold transition-colors text-[10px] font-mono uppercase tracking-widest font-semibold cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Assign Formula
                    </button>
                  )}
                </div>

              </div>

              {/* Show assigned product card previews below inside slot */}
              {slot.product && (
                <div className="mt-4 pt-4 border-t border-[#FAF7F2] flex gap-4 items-center animate-fade-in">
                  <div className="w-12 h-16 bg-luxury-cream border border-[#FAF7F2] rounded-sm overflow-hidden flex-shrink-0">
                    <img
                      src={slot.product.primaryImage}
                      alt={slot.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-0.5 flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-serif text-sm font-semibold text-luxury-charcoal leading-tight">
                        {slot.product.name}
                      </h4>
                      <span className="font-mono text-xs font-semibold text-luxury-charcoal pl-3">
                        ${slot.product.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-luxury-gold font-mono tracking-widest uppercase">
                      {slot.product.size} • {slot.product.subtitle}
                    </p>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Right Side (5/12 widths): Action selection panel OR Compatibility calculator */}
        <div className="lg:col-span-5 bg-white border border-[#E9DFCB]/50 p-6 sm:p-8 rounded-sm shadow-xl space-y-6 lg:sticky lg:top-28">
          
          {/* Diagnostic Active Selector Drawer (mounted if slot selected) */}
          {activeSlotId ? (
            <div className="space-y-4 animate-fade-in">
              <div className="border-b border-[#FAF7F2] pb-3 flex justify-between items-center bg-[#FAF7F2] -mx-6 -mt-6 p-4 border-b border-[#CBD9CE]">
                <h3 className="font-serif text-sm font-semibold tracking-wide text-luxury-charcoal">
                  Select {slots.find((s) => s.id === activeSlotId)?.categoryAllowed} Formulation
                </h3>
                <button
                  onClick={() => setActiveSlotId(null)}
                  className="text-xs font-sans text-luxury-charcoal/60 hover:text-luxury-gold uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {getEligibleProducts().map((product) => (
                  <div
                    key={product.id}
                    onClick={() => assignProductToSlot(product)}
                    className="p-3 border border-[#F2EDE2] rounded-sm hover:border-luxury-gold hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="w-12 h-14 bg-luxury-cream rounded-sm overflow-hidden flex-shrink-0">
                      <img
                        src={product.primaryImage}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <h4 className="font-serif text-[13px] font-semibold text-luxury-charcoal group-hover:text-luxury-gold transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-luxury-charcoal/50 leading-tight font-light truncate max-w-[190px]">
                        {product.subtitle}
                      </p>
                      <div className="flex justify-between items-center pt-1">
                        <span className="font-mono text-xs font-semibold text-luxury-charcoal">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-[9px] font-mono text-luxury-gold uppercase block">
                          Size: {product.size}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // D. Analytical feedback, compatible totals, and quick add-all bundle controls
            <div className="space-y-6">
              <h3 className="font-serif text-lg tracking-wide border-b border-[#F2EDE2] pb-3 text-luxury-charcoal">
                Biological Diagnostics
              </h3>

              {/* Bio rating meter */}
              {assignedProductsCount > 0 && (
                <div className="space-y-1.5 py-1">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono uppercase text-luxury-charcoal/65 tracking-widest">
                      SYSTEM COMPATIBILITY INDEX
                    </span>
                    <span className="font-mono text-xl text-luxury-gold font-bold">{compatibility.rating}%</span>
                  </div>
                  
                  <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#FAF7F2]">
                    <div
                      className="bg-luxury-gold h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${compatibility.rating}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Analysis Textbox */}
              <div className={`p-4 rounded text-xs space-y-2 leading-relaxed font-light ${compatibility.color}`}>
                <div className="flex gap-2 items-center font-bold text-[10.5px] font-mono uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 animate-spin text-luxury-gold" /> Chemistry Analyst Report
                </div>
                <p>{compatibility.feedback}</p>
              </div>

              {assignedProductsCount > 0 && (
                <div className="bg-[#FBF8F3] border border-[#FAF7F2] p-4 rounded-sm space-y-3.5 text-xs text-luxury-charcoal/80">
                  <h4 className="font-serif text-[11px] font-mono uppercase tracking-wider text-luxury-charcoal border-b border-[#EADFC9]/50 pb-1.5">
                    DIAGNOSTIC PROTOCOLS:
                  </h4>
                  <div className="space-y-2 font-light">
                    <div className="flex gap-2 items-start">
                      <Check className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>AM Sequence:</strong> Apply Cleanser, follow directly with alpine rose Toner, apply active peptides serum, envelope inside Barrier Moisturizer, finish with high-protection sun factor.
                      </div>
                    </div>

                    <div className="flex gap-2 items-start">
                      <Check className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>PM Sequence:</strong> Carry out double cleansing. Massage in Active treatment, allow to reside for 60 seconds, and seal beneath cellular lipids skin repair creams.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bundle summary pricing checkout details */}
              {assignedProductsCount > 0 && (
                <div className="border-t border-[#F0EAE1] pt-5 space-y-4">
                  <div className="flex justify-between items-baseline font-serif">
                    <span className="text-sm tracking-wider uppercase">SEQUENCE TOTAL ({assignedProductsCount} items)</span>
                    <span className="font-mono text-lg font-semibold text-luxury-charcoal">${totalPrice.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleAddAllToCart}
                    className="w-full bg-[#1E1D1A] hover:bg-luxury-gold text-white text-xs py-3.5 font-semibold tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Place Sequence in Cart
                  </button>
                </div>
              )}

              {assignedProductsCount === 0 && (
                <div className="h-44 flex flex-col items-center justify-center text-center text-luxury-charcoal/50">
                  <Info className="w-8 h-8 text-luxury-rose mb-2" />
                  <p className="text-xs font-light max-w-xs px-4">
                    Assigned formulations are analyzed and summarized dynamically inside this dashboard window. Click on "Assign Formula" at the left to initiate your sequence creation.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
