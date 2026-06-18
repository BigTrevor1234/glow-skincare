import { useApp } from '../context/AppContext';
import { Article } from '../types';
import { useState } from 'react';
import { Search, Calendar, User, Clock, ArrowRight, X, Heart, Sparkles } from 'lucide-react';
import ingredientsBg from '../assets/images/skincare_ingredients_1779494122044.png';

export default function WellnessHub() {
  const { articles } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = ['All', 'Skincare Daily', 'Inner Wellness', 'Sourcing Story', 'Self-Care Ritual'];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* 1. Header with visual top banner */}
      <section className="bg-[#FAF7F2] border border-[#E9DFCB]/50 grid grid-cols-1 md:grid-cols-12 rounded-sm overflow-hidden shadow-xs">
        <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.25em] text-luxury-gold font-bold uppercase block">
            Glow Skincare Chronicles
          </span>
          <h1 className="text-3xl sm:text-4xl text-luxury-charcoal font-serif font-normal leading-tight">
            The Wellness Hub & <br />
            Botanical Laboratory
          </h1>
          <div className="w-12 h-0.5 bg-luxury-gold/50" />
          <p className="text-xs sm:text-sm text-luxury-charcoal/70 leading-relaxed font-light">
            Insights, self-care routines, ingredient breakdowns, and our ethical botanical sourcing standards. Designed to nurture both radiant skin and mindful self-presence.
          </p>
        </div>

        {/* Right Generated beautiful flat lay raw botanical image */}
        <div className="md:col-span-5 relative h-56 md:h-auto min-h-[220px]">
          <img
            src={ingredientsBg}
            alt="Pure skincare raw botanical ingredients layout"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#1E1D1A]/5 via-transparent to-black/10" />
        </div>
      </section>

      {/* 2. Interactive Category, Search Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b border-[#F0EAE1]">
        
        {/* Category Pill selectors */}
        <div className="flex flex-wrap gap-2 justify-start w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded text-xs tracking-wider uppercase transition-colors duration-250 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-luxury-charcoal text-[#FAF7F2] font-semibold'
                  : 'bg-white border border-[#EBE3D3]/70 text-luxury-charcoal/70 hover:bg-[#FAF7F2]'
              }`}
            >
              {cat === 'All' ? 'View All Chronicles' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-luxury-charcoal/40" />
          <input
            type="text"
            placeholder="Search wellness articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E0D8C8] pl-10 pr-4 py-2 text-xs tracking-wider text-luxury-charcoal placeholder-luxury-charcoal/40 focus:outline-hidden focus:border-luxury-gold rounded-sm"
          />
        </div>

      </div>

      {/* 3. Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white border border-[#F2EDE2] rounded-sm flex flex-col items-center justify-center">
          <Clock className="w-10 h-10 text-luxury-rose mb-2 animate-pulse" />
          <h3 className="font-serif text-lg tracking-wide text-luxury-charcoal">No Articles Discovered</h3>
          <p className="text-xs text-luxury-charcoal/60 mt-1.5 max-w-sm font-light">
            Try correcting your search input query terms to see matching files of the wellness list.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-white border border-[#EADFC9]/50 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-350 cursor-pointer group"
            >
              <div className="aspect-16/9 relative overflow-hidden bg-luxury-cream border-b border-[#F0EAE1]">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 select-none"
                />
                <span className="absolute bottom-3 left-3 bg-white/95 px-2.5 py-1 text-[9.5px] font-mono tracking-widest text-luxury-charcoal uppercase border border-[#F0EAE1]/80">
                  {art.category}
                </span>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-[10px] font-mono text-luxury-gold uppercase tracking-wider font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {art.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {art.readingTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold leading-tight text-luxury-charcoal group-hover:text-luxury-gold transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-luxury-charcoal/65 leading-relaxed font-light">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F0EAE1] flex justify-between items-center text-xs">
                  <span className="font-mono text-[10.5px] tracking-wider text-luxury-charcoal/50 uppercase leading-none">
                    By {art.author.split(',')[0]}
                  </span>

                  <button className="text-luxury-charcoal group-hover:text-luxury-gold font-mono uppercase tracking-widest text-[11px] font-bold flex items-center gap-1 transition-all">
                    Read Story
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 duration-200" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 4. Luxury Pop-up full screen deep reading modal overlay structure */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto min-h-screen">
          {/* backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedArticle(null)}
          />

          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 z-50 relative">
            <div className="w-full max-w-3xl transform bg-[#FAF7F2] border border-[#E9DFCB] shadow-2xl transition-all relative rounded-sm flex flex-col">
              
              {/* Close Button top-right */}
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-luxury-charcoal shadow-md border border-[#F0EAE1] cursor-pointer hover:text-luxury-gold duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Cover Banner image */}
              <div className="w-full h-64 sm:h-80 relative overflow-hidden">
                <img
                  src={selectedArticle.coverImage}
                  alt={selectedArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-luxury-gold text-white text-[9px] font-mono tracking-widest uppercase font-semibold">
                    {selectedArticle.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-white leading-tight font-semibold">
                    {selectedArticle.title}
                  </h2>
                </div>
              </div>

              {/* Text Layout */}
              <div className="p-6 sm:p-10 space-y-6 max-h-[460px] overflow-y-auto">
                <div className="flex flex-wrap gap-4 items-center justify-between border-b border-[#EADFC9]/50 pb-4 text-xs font-mono text-luxury-gold uppercase font-bold">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Written by {selectedArticle.author}
                  </div>
                  <div className="flex gap-4">
                    <span>{selectedArticle.date}</span>
                    <span>• {selectedArticle.readingTime}</span>
                  </div>
                </div>

                <p className="font-serif italic text-base sm:text-lg text-luxury-charcoal/85 leading-relaxed bg-[#F5EFE4]/35 p-5 border-l-2 border-luxury-gold">
                  "{selectedArticle.summary}"
                </p>

                <div className="space-y-4 font-sans font-light text-sm sm:text-base text-luxury-charcoal/85 leading-relaxed">
                  {selectedArticle.contentParagraphs.map((para, index) => (
                    <p key={index}>{para}</p>
                  ))}
                </div>

                {/* Footnotes brand commitment */}
                <div className="border-t border-[#F0EAE1] pt-6 flex items-center justify-center text-center gap-2 text-xs font-mono text-luxury-gold uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 animate-spin" /> Glow Skincare Laboratory Verified Ethics
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
