import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles, BookOpen, Heart, BrainCircuit } from 'lucide-react';
import heroBanner from '../assets/images/hero_skincare_banner_1779494096101.png';

export default function Hero() {
  const { setActivePage, heroBannerSettings } = useApp();

  const collections = [
    {
      title: 'Hydration',
      tagline: 'Deep cellular moisture infusion',
      description: 'Plump fine lines and restore radiant plumpness with raw glacier water & alpine rose.',
      filter: 'Hydration',
      bgClass: 'bg-[#F9F5EE]',
      borderClass: 'border-[#EADFC9]/70',
    },
    {
      title: 'Radiance',
      tagline: 'Luminous post-acne glass clarity',
      description: 'Fade stubborn discoloration with pure gold peptides and 10% niacinamide essences.',
      filter: 'Dullness',
      bgClass: 'bg-[#F2EFE8]',
      borderClass: 'border-[#DFD6C2]/70',
    },
    {
      title: 'Specialized Care',
      tagline: 'Dermatological barrier repair',
      description: 'Extinguish flare-ups and redness with botanical biomimetic lipid nourishment.',
      filter: 'Sensitivities',
      bgClass: 'bg-[#EBF1EC]',
      borderClass: 'border-[#CBD9CE]/70',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Main High-Impact Hero Banner */}
      <section className="relative overflow-hidden bg-luxury-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Slogan & Editorial Typography Copy (Left on Large screens) */}
            <div className="lg:col-span-6 space-y-6 md:space-y-8 text-left z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-luxury-gold/10 text-luxury-gold rounded-full text-xs font-mono tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Est. 2026 Beauty Philosophy
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl text-luxury-charcoal font-serif tracking-tight leading-[1.1] font-normal whitespace-pre-line">
                  {heroBannerSettings.title}
                </h1>
                <p className="text-sm sm:text-base text-luxury-charcoal/70 tracking-wide font-sans font-light max-w-lg leading-relaxed">
                  {heroBannerSettings.subtitle}
                </p>
              </div>

              {/* Call-to-actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => setActivePage('shop')}
                  className="px-8 py-4 bg-luxury-charcoal text-[#FAF7F2] hover:bg-luxury-gold hover:text-white transition-all duration-300 tracking-widest uppercase text-xs font-semibold flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Shop the Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActivePage('quiz')}
                  className="px-8 py-4 bg-transparent border border-luxury-charcoal text-luxury-charcoal hover:border-luxury-gold hover:text-luxury-gold transition-all duration-350 tracking-widest uppercase text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                >
                  Analyze Skin Profile
                </button>
              </div>

              {/* Distinguishing bullet features */}
              <div className="grid grid-cols-3 gap-4 border-t border-[#F0EAE1] pt-6 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-luxury-charcoal/60">
                <div>
                  <span className="block font-bold text-luxury-gold text-sm sm:text-base mb-1 font-sans">100%</span>
                  Vegan & Sourced Ethically
                </div>
                <div>
                  <span className="block font-bold text-luxury-gold text-sm sm:text-base mb-1 font-sans">No</span>
                  Chemical Fragrances or PEG
                </div>
                <div>
                  <span className="block font-bold text-luxury-gold text-sm sm:text-base mb-1 font-sans">Ph.D.</span>
                  Dermatologist Approved
                </div>
              </div>
            </div>

            {/* Premium Generated Skincare arrangements (Right on Large screens) */}
            <div className="lg:col-span-6 relative w-full aspect-16/9 lg:aspect-4/3 rounded-sm overflow-hidden shadow-xl border border-[#F2EDE2]">
              <img
                src={heroBannerSettings.image || heroBanner}
                alt="Minimalist luxury skincare products arrangement"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Featured Collections Slider/Trio */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-luxury-gold font-semibold">
            Tailored curation
          </span>
          <h2 className="text-2xl sm:text-3xl text-luxury-charcoal font-serif font-normal">
            Featured Collections
          </h2>
          <div className="w-12 h-0.5 bg-luxury-gold/50 mx-auto mt-2" />
          <p className="text-xs sm:text-sm text-luxury-charcoal/60 leading-relaxed font-light">
            Each formula works in absolute bio-harmony to accelerate your skin’s inherent regenerative frequency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((col, index) => (
            <div
              key={index}
              className={`rounded-sm border p-6 sm:p-8 flex flex-col justify-between space-y-6 ${col.bgClass} ${col.borderClass} group hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-luxury-gold uppercase block font-semibold">
                  {col.tagline}
                </span>
                <h3 className="text-xl font-serif text-luxury-charcoal font-semibold">{col.title}</h3>
                <p className="text-xs sm:text-sm text-luxury-charcoal/70 leading-relaxed font-light">
                  {col.description}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    // Navigate to shop and filter (we can handle setting session filters!)
                    // We'll teach our Shop to react to queries or pass standard params if we want!
                    setActivePage('shop');
                  }}
                  className="font-mono text-xs tracking-widest text-luxury-charcoal group-hover:text-luxury-gold font-semibold uppercase flex items-center gap-1.5 cursor-pointer pb-1 border-b border-transparent group-hover:border-luxury-gold w-fit duration-200"
                >
                  Explore Collection
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Daily Wellness Provisions Section */}
      <section className="bg-luxury-mint/50 py-16 border-y border-[#DCE4DE]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Descriptive Left Area */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-emerald-800 font-semibold block">
                Nurture from the core
              </span>
              <h2 className="text-2xl sm:text-3xl text-luxury-charcoal font-serif font-normal leading-tight">
                Daily Wellness <br className="hidden sm:inline" />
                Provisions
              </h2>
              <div className="w-12 h-0.5 bg-emerald-800/40" />
              <p className="text-xs sm:text-sm text-luxury-charcoal/70 leading-relaxed font-light">
                Sensory luxury topicals only cover half the skincare loop. True cell radiance demands bio-available nourishment from within. Our cellular elixirs balance gastrointestinal microbiome triggers and build deep collagen anchors.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex gap-3 items-start">
                  <div className="bg-emerald-800/10 p-1.5 rounded text-emerald-800 mt-0.5">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-luxury-charcoal">Inner Microbiome Calm</h4>
                    <p className="text-[11px] sm:text-xs text-luxury-charcoal/60 font-light leading-relaxed">
                      Lactobacillus strains decrease systemic redness signals.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="bg-emerald-800/10 p-1.5 rounded text-emerald-800 mt-0.5">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-luxury-charcoal">Precious Tissue Density</h4>
                    <p className="text-[11px] sm:text-xs text-luxury-charcoal/60 font-light leading-relaxed">
                      Hydrolyzed marine peptides trigger cellular tissue synthesis.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setActivePage('shop');
                  }}
                  className="px-6 py-3 bg-[#1e1d1a] text-white hover:bg-emerald-800 transition-colors duration-300 tracking-widest uppercase text-[10px] sm:text-xs font-semibold cursor-pointer"
                >
                  Acquire Supplements
                </button>
              </div>
            </div>

            {/* Visual Right Area - Collage / Floating Supplement Card */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-6">
                <div className="bg-white rounded-sm p-6 border border-[#E0ECE2]/60 shadow-xs relative overflow-hidden group hover:shadow-md transition-shadow">
                  <span className="absolute top-0 right-0 py-1 px-3 bg-emerald-800 text-white text-[9px] font-mono tracking-widest uppercase rounded-bl">
                    Cell Active
                  </span>
                  <div className="aspect-1 text-center py-4">
                    <img
                      src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=600&auto=format&fit=crop"
                      alt="Premium wellness supplements"
                      referrerPolicy="no-referrer"
                      className="w-32 h-32 object-contain mx-auto group-hover:scale-105 duration-500"
                    />
                  </div>
                  <h4 className="font-serif text-base font-semibold text-luxury-charcoal mb-1">Aura Complexion Elixir</h4>
                  <p className="text-[11px] sm:text-xs text-luxury-charcoal/65 leading-relaxed font-light">
                    Marine collagen peptides & probiotics. Perfect cellular partner.
                  </p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#F0EAE1]">
                    <span className="font-mono text-sm font-semibold">$60.00</span>
                    <button
                      onClick={() => setActivePage('shop')}
                      className="text-[10px] font-mono tracking-widest uppercase font-semibold text-emerald-800 underline hover:text-luxury-charcoal cursor-pointer"
                    >
                      Acquire Capsules
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="rounded-sm overflow-hidden aspect-3/4 border border-[#CADACE] shadow-lg relative">
                  <img
                    src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?q=80&w=600&auto=format&fit=crop"
                    alt="Wellness botanical flatlay"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#1E1D1A]/5 backdrop-blur-[1px]" />
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. Skin Health Education Promo */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#FDFCFB] rounded border border-[#F2EDE2] p-8 sm:p-12">
        <div className="space-y-6">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-luxury-gold font-semibold block">
            Unlock tailored moisture regimes
          </span>
          <h2 className="text-2xl sm:text-4xl text-luxury-charcoal font-serif font-normal leading-tight">
            Not sure what your <br />
            skin is asking for?
          </h2>
          <p className="text-xs sm:text-sm text-luxury-charcoal/75 leading-relaxed font-light">
            Every complexion holds a custom biological signature. Our interactive skin evaluation models analyze your moisture retention structures, active acne flare triggers, and environmental barrier sensitivities. Spend 2 minutes taking our quiz to lock in a custom luxury routine and unlock an exclusive discount code.
          </p>
          <div>
            <button
              onClick={() => setActivePage('quiz')}
              className="px-6 py-3 bg-luxury-charcoal text-[#FAF7F2] hover:bg-luxury-gold transition-all tracking-widest uppercase text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              Begin Skin Evaluation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="aspect-4/3 rounded-sm overflow-hidden border border-[#FAF7F2] shadow-md relative">
          <img
            src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop"
            alt="Evaluation aesthetic portrait"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

    </div>
  );
}
