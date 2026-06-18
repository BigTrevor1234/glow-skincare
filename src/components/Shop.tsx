import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { useState } from 'react';
import { Heart, Search, Filter, ShoppingBag, Eye, Star, AlertTriangle } from 'lucide-react';

export default function Shop() {
  const { products, addToCart, toggleFavorite, favorites, setSelectedProduct, setActivePage } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSkinType, setActiveSkinType] = useState<string>('All');
  const [activeConcern, setActiveConcern] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortKey, setSortKey] = useState<string>('featured');

  // Hover states tracking for second image swaps (stores productId of hovered card)
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  // Filter keys definitions
  const skinTypes = ['All', 'Dry', 'Oily', 'Combination', 'Sensitive'];
  const concerns = ['All', 'Hydration', 'Acne', 'Aging', 'Dullness', 'Sensitivities'];
  const categories = ['All', 'Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Mask', 'Supplement'];

  // Apply search query and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.subtitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkinType =
      activeSkinType === 'All' ||
      product.skinTypes.includes(activeSkinType as any) ||
      product.skinTypes.includes('All');

    const matchesConcern =
      activeConcern === 'All' ||
      product.concerns.includes(activeConcern as any) ||
      product.concerns.includes('All');

    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;

    return matchesSearch && matchesSkinType && matchesConcern && matchesCategory;
  });

  // Apply sorting math
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortKey === 'price-low') return a.price - b.price;
    if (sortKey === 'price-high') return b.price - a.price;
    if (sortKey === 'rating') return b.rating - a.rating;
    return 0; // 'featured' index
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. Header with styling tagline */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-luxury-gold font-semibold">
          Ethereal alchemy
        </span>
        <h1 className="text-3xl sm:text-4xl text-luxury-charcoal font-serif font-normal">
          The Glow Apothecary
        </h1>
        <div className="w-12 h-0.5 bg-luxury-gold/50 mx-auto" />
        <p className="text-xs sm:text-sm text-luxury-charcoal/65 leading-relaxed font-light">
          Browse our collection of dermatological actives, organic botanical lipids, and clean inner supplements. Balanced to soothe, repair, and illuminate.
        </p>
      </div>

      {/* 2. Interactive Search & Multi-Filter bar */}
      <div className="bg-[#F5EFE4]/60 border border-[#E9DFCB]/70 p-6 rounded-sm space-y-5 shadow-xs">
        
        {/* Row 1: Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          
          {/* Search bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-charcoal/40" />
            <input
              type="text"
              placeholder="Search botanical blends, cream, serum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E0D8C8] pl-10 pr-4 py-2 text-xs tracking-wider text-luxury-charcoal placeholder-luxury-charcoal/40 focus:outline-hidden focus:border-luxury-gold rounded-sm"
            />
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] font-mono tracking-widest text-luxury-charcoal/60 uppercase">SORT BY:</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="bg-[#FAF7F2] border border-[#E0D8C8] px-3 py-1.5 text-xs font-mono tracking-wider text-luxury-charcoal focus:outline-hidden focus:border-luxury-gold rounded-sm cursor-pointer"
            >
              <option value="featured">FEATURED CURATION</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
              <option value="rating">POPULAR RATING</option>
            </select>
          </div>

        </div>

        {/* Filters Groupings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-[#E5DFC9]/70">
          
          {/* Filter A: Skin Type */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-luxury-gold font-bold">
              Filter by Skin Type
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skinTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveSkinType(type)}
                  className={`px-3 py-1 text-[10px] tracking-widest uppercase transition-colors rounded duration-200 cursor-pointer ${
                    activeSkinType === type
                      ? 'bg-luxury-charcoal text-white font-medium'
                      : 'bg-white border border-[#E0D8C8]/60 text-luxury-charcoal/80 hover:bg-[#FAF7F2]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Filter B: Concerns */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-luxury-gold font-bold">
              Filter by Concern
            </span>
            <div className="flex flex-wrap gap-1.5">
              {concerns.map((concern) => (
                <button
                  key={concern}
                  onClick={() => setActiveConcern(concern)}
                  className={`px-3 py-1 text-[10px] tracking-widest uppercase transition-colors rounded duration-200 cursor-pointer ${
                    activeConcern === concern
                      ? 'bg-luxury-charcoal text-white font-medium'
                      : 'bg-white border border-[#E0D8C8]/60 text-luxury-charcoal/80 hover:bg-[#FAF7F2]'
                  }`}
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>

          {/* Filter C: Category Type */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-luxury-gold font-bold">
              Product Category
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-[10px] tracking-widest uppercase transition-colors rounded duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-luxury-charcoal text-white font-medium'
                      : 'bg-white border border-[#E0D8C8]/60 text-luxury-charcoal/80 hover:bg-[#FAF7F2]'
                  }`}
                >
                  {cat === 'All' ? 'All Types' : cat}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* 3. Product Grid Layout */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#FAF7F2] border border-[#F2EDE2] rounded-sm flex flex-col items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-luxury-rose animate-bounce mb-3" />
          <h3 className="font-serif text-lg tracking-wide text-luxury-charcoal">No Elixirs Match Your Criteria</h3>
          <p className="text-xs text-luxury-charcoal/60 mt-1.5 max-w-sm font-light">
            Try resetting some filters or search keys to discover other active formulations of our apothecary.
          </p>
          <button
            onClick={() => {
              setActiveSkinType('All');
              setActiveConcern('All');
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="mt-5 px-5 py-2 bg-luxury-charcoal hover:bg-luxury-gold duration-200 text-white tracking-widest uppercase text-[10px] font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product) => {
            const isFav = favorites.includes(product.id);
            const isHovered = hoveredProductId === product.id;

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between border border-[#EBE5DB] bg-white rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 relative"
                onMouseEnter={() => setHoveredProductId(product.id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                
                {/* Image Section - Interactive primary/secondary toggle on hover */}
                <div
                  className="aspect-3/4 relative overflow-hidden bg-[#FAF7F2] cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product);
                    setActivePage('product-detail');
                  }}
                >
                  <img
                    src={isHovered ? product.secondaryImage : product.primaryImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out select-none transform hover:scale-102"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    <span className="px-2.5 py-0.5 bg-white/90 text-luxury-charcoal rounded-xs text-[9px] font-mono tracking-widest uppercase border border-[#E7DEC1]/40 shadow-xs">
                      {product.size}
                    </span>
                    {!product.inStock && (
                      <span className="px-2.5 py-0.5 bg-rose-600 text-white font-medium text-[9px] font-mono tracking-widest uppercase shadow-xs">
                        Awaiting Restock
                      </span>
                    )}
                  </div>

                  {/* Add to favorites toggle icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full cursor-pointer transition-all duration-300 ${
                      isFav
                        ? 'bg-[#EBF1EC] text-luxury-rose border border-luxury-rose/30'
                        : 'bg-white/80 text-luxury-charcoal/60 hover:text-luxury-rose hover:bg-white/100 border border-[#F0EAE1]/80 hover:border-luxury-rose/30 shadow-xs'
                    }`}
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Action Quick overlays on Hover */}
                  <div className="absolute inset-0 bg-[#1E1D1A]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setActivePage('product-detail');
                      }}
                      className="p-3 bg-[#FAF7F2] text-luxury-charcoal hover:bg-luxury-gold hover:text-white rounded-full shadow-lg transition-transform duration-300 transform translate-y-4 group-hover:translate-y-0 cursor-pointer"
                      title="Inspect Product details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {product.inStock && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="p-3 bg-[#FAF7F2] text-luxury-charcoal hover:bg-luxury-gold hover:text-white rounded-full shadow-lg transition-transform duration-300 transform translate-y-4 group-hover:translate-y-0 delay-50 cursor-pointer"
                        title="Quick Add to Cart Selection"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>

                {/* Info Text Content Block */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-luxury-gold uppercase font-bold">
                      <span>{product.category}</span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-sans font-semibold text-luxury-charcoal">{product.rating}</span>
                      </div>
                    </div>

                    <h3
                      className="font-serif text-base font-semibold leading-tight text-luxury-charcoal hover:text-luxury-gold transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setActivePage('product-detail');
                      }}
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-luxury-charcoal/60 leading-relaxed font-light line-clamp-2">
                      {product.subtitle}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-[#F0EAE1] mt-auto">
                    <span className="font-mono text-base font-semibold text-luxury-charcoal">
                      ${product.price.toFixed(2)}
                    </span>
                    
                    <button
                      disabled={!product.inStock}
                      onClick={() => addToCart(product)}
                      className={`text-[10px] font-mono tracking-widest font-semibold uppercase px-4 py-2 bg-luxury-charcoal hover:bg-luxury-gold text-white duration-200 transition-colors cursor-pointer ${
                        !product.inStock ? 'opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''
                      }`}
                    >
                      {product.inStock ? 'Quick Add' : 'Sold Out'}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
