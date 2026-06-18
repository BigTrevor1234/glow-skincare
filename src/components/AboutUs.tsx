import { Sparkles, Heart, Earth, GraduationCap, ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AboutUs() {
  const { setActivePage, siteSettings } = useApp();

  const pillars = [
    {
      icon: <Earth className="w-5 h-5 text-luxury-gold" />,
      title: 'Ethical Botanical Sourcing',
      desc: 'We partner uniquely with organic, family-owned cooperatives in Switzerland, France, and Nordic areas to harvest resilient stem cells and cold-pressed botanical fats sustainably.',
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-luxury-gold" />,
      title: 'Clinical Lipid Biochemistry',
      desc: 'We replace greasy generic filters with biomimetic lipid mortar matrices. Combining Ceramides 1, 3, 6, cholesterol, and vegan squalane in a stable, breathable barrier blanket.',
    },
    {
      icon: <Heart className="w-5 h-5 text-luxury-gold" />,
      title: 'Mindful Skin-Self Harmony',
      desc: 'We advocate for slow, physical application rituals that wake up capillaries, decrease salivary cortisol, and transform daily routines into deeply restorative grounding practices.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      
      {/* SECTION 1: Brand philosophy editorial hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
        
        <div className="lg:col-span-6 space-y-6">
          <span className="text-[10px] font-mono tracking-[0.25em] text-luxury-gold uppercase block font-bold leading-none">
            {siteSettings.aboutStorySubtitle}
          </span>
          <h1 className="text-3xl sm:text-5xl text-luxury-charcoal font-serif font-normal leading-[1.15]">
            {siteSettings.aboutStoryTitle}
          </h1>
          <div className="w-12 h-0.5 bg-luxury-rose/55" />
          
          <div className="space-y-4 text-xs sm:text-sm text-luxury-charcoal/75 leading-relaxed font-light">
            <p>
              {siteSettings.aboutStoryPara1}
            </p>
            <p>
              {siteSettings.aboutStoryPara2}
            </p>
            <p>
              {siteSettings.aboutStoryPara3}
            </p>
          </div>
        </div>

        {/* Right elegant portrait picture collage */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="aspect-3/4 bg-[#FAF7F2] rounded-sm overflow-hidden border border-[#E9DFCB]/50 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop"
              alt="Skin health botanical model"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <div className="aspect-square bg-[#FAF7F2] rounded-sm overflow-hidden border border-[#E9DFCB]/50 shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop"
                alt="Swiss forest canopy botanical detail"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="bg-[#FAF8F3] border border-[#EBE3D3] rounded p-6 text-center space-y-1">
              <Sparkles className="w-5 h-5 text-luxury-gold mx-auto animate-pulse" />
              <span className="block font-serif text-2xl font-bold tracking-tight text-luxury-charcoal">Est. 2026</span>
              <span className="text-[10px] font-mono tracking-widest text-[#1E1D1A]/50 uppercase font-semibold block pt-1">
                Apothecary standards
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* SECTION 2: Pillars Grid */}
      <section className="bg-[#F5EFE4]/60 p-8 sm:p-12 border border-[#E9DFCB]/70 rounded-sm space-y-8 shadow-xs">
        <div className="text-center max-w-sm mx-auto space-y-1.5">
          <span className="text-[9px] font-mono tracking-widest uppercase text-luxury-gold font-bold">
            Uncompromising values
          </span>
          <h2 className="text-2xl text-luxury-charcoal font-serif font-normal">
            The Three Pillars of Glow
          </h2>
          <div className="w-8 h-0.5 bg-luxury-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pil, idx) => (
            <div key={idx} className="bg-white/90 rounded border border-[#E9DFCB]/40 p-6 space-y-4 hover:shadow-lg duration-300">
              <div className="bg-[#FAF7F2] p-2.5 rounded-sm w-fit border border-[#E9DFCB]/45 shadow-xs">
                {pil.icon}
              </div>
              <h3 className="font-serif text-base font-semibold text-luxury-charcoal leading-none">
                {pil.title}
              </h3>
              <p className="text-xs sm:text-sm text-luxury-charcoal/70 leading-relaxed font-light">
                {pil.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Sourcing standards narrative editorial layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#F0EAE1] rounded-sm p-6 sm:p-8">
        
        <div className="lg:col-span-5 h-64 sm:h-80 w-full overflow-hidden rounded shadow-xs bg-[#FAF7F2]">
          <img
            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop"
            alt="Hand processing botanicals gently"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:col-span-7 p-4 space-y-5">
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#C29F6F] uppercase block font-bold">
            Biological Sourcing Accountability
          </span>
          <h3 className="text-xl sm:text-2xl text-luxury-charcoal font-serif leading-tight">
            Traceable Chemistry, Uncompromising Potency
          </h3>
          <p className="text-xs sm:text-sm text-luxury-charcoal/70 leading-relaxed font-light">
            We list every single chemical molecule and extract source on our containers. GlowSkincare does not engage in label-clutter of fake scientific names. We source Swiss Alpine Rose stem cells gathered gently on rocky heights exceeding 2,000 meters. Active ingredients remain stabilized via natural vacuum glass encapsulation, guaranteeing premium, long-term chemical potency for your complexion's daily breath.
          </p>
          <div>
            <button
              onClick={() => setActivePage('shop')}
              className="px-6 py-3 bg-luxury-charcoal text-white hover:bg-luxury-gold tracking-widest text-xs uppercase font-semibold transition-colors duration-250 cursor-pointer"
            >
              Discover the apothecary
            </button>
          </div>
        </div>

      </section>

    </div>
  );
}
