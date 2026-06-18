import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data';
import { useState } from 'react';
import { Star, ShieldAlert, ArrowLeft, Heart, ShoppingBag, Plus, Minus, Check } from 'lucide-react';

export default function ProductDetail() {
  const { selectedProduct, setSelectedProduct, setActivePage, addToCart, toggleFavorite, favorites, reviews, addReview } = useApp();
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'howTo'>('desc');
  const [quantity, setQuantity] = useState(1);

  // Subscription local states
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>('one-time');
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<'Monthly' | 'Quarterly'>('Monthly');

  // Review (Glow Diary) submission form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImage, setReviewImage] = useState('');
  const [reviewSkinType, setReviewSkinType] = useState<'Dry' | 'Oily' | 'Combination' | 'Sensitive'>('Dry');
  const [reviewConcern, setReviewConcern] = useState<'Hydration' | 'Acne' | 'Aging' | 'Dullness' | 'Sensitivities'>('Hydration');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShieldAlert className="w-12 h-12 text-luxury-rose mx-auto animate-bounce" />
        <h2 className="text-xl font-serif mt-4 text-luxury-charcoal">No Formulation Selected</h2>
        <p className="text-xs text-luxury-charcoal/60 mt-1">Please select an elixir from our apothecary list first.</p>
        <button
          onClick={() => setActivePage('shop')}
          className="mt-6 px-6 py-3 bg-luxury-charcoal text-white hover:bg-luxury-gold tracking-widest text-xs uppercase duration-200 cursor-pointer"
        >
          View All Products
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(selectedProduct.id);

  // Filter 3 related products for recommendation cross-sell
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== selectedProduct.id && (p.category === selectedProduct.category || p.skinTypes.includes(selectedProduct.skinTypes[0]))
  ).slice(0, 3);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* 1. Back navigation line */}
      <button
        onClick={() => {
          setSelectedProduct(null);
          setActivePage('shop');
        }}
        className="flex items-center gap-2 group text-xs text-luxury-charcoal/60 hover:text-luxury-gold tracking-widest font-mono uppercase transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 duration-200" />
        Return to apothecary shop
      </button>

      {/* 2. Main Product layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
        
        {/* Left Side: Editorial Image Block */}
        <div className="lg:col-span-6 grid grid-cols-1 gap-4">
          <div className="bg-white border border-[#E9DFCB]/50 rounded-sm overflow-hidden aspect-3/4 relative">
            <img
              src={selectedProduct.primaryImage}
              alt={selectedProduct.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-xs text-[10px] font-mono tracking-widest text-luxury-charcoal uppercase border border-[#F0EAE1]/80">
              {selectedProduct.size}
            </div>
          </div>
          
          {/* Subtle Secondary photo underneath */}
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-white border border-[#E9DFCB]/50 overflow-hidden rounded-sm">
              <img
                src={selectedProduct.secondaryImage}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            
            <div className="bg-luxury-gold/5 border border-luxury-gold/20 flex flex-col justify-center p-6 text-center rounded-sm">
              <Star className="w-6 h-6 text-luxury-gold fill-current mx-auto mb-2" />
              <span className="font-serif text-lg font-bold text-luxury-charcoal">{selectedProduct.rating} / 5.0</span>
              <span className="text-[10px] text-luxury-charcoal/50 font-mono uppercase mt-1">From {selectedProduct.reviewsCount} organic client reviews</span>
            </div>
          </div>
        </div>

        {/* Right Side: Informative & Action controls */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-28">
          
          {/* Tag, size, name */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.2em] text-luxury-gold uppercase block font-bold">
              {selectedProduct.category} Collection
            </span>
            <h1 className="text-3xl sm:text-4xl text-luxury-charcoal font-serif font-normal">
              {selectedProduct.name}
            </h1>
            <p className="text-sm text-luxury-gold font-serif italic tracking-wide">
              {selectedProduct.subtitle}
            </p>
          </div>

          <p className="font-mono text-2xl font-semibold text-luxury-charcoal border-b border-[#F0EAE1] pb-4">
            ${selectedProduct.price.toFixed(2)}
          </p>

          <p className="text-xs sm:text-sm text-luxury-charcoal/75 leading-relaxed font-light font-sans">
            {selectedProduct.description}
          </p>

          {/* Skin Type alignment badges */}
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <span className="font-mono text-[10px] tracking-widest text-luxury-charcoal/50 uppercase">SUITABILITY:</span>
            {selectedProduct.skinTypes.map((type, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-[#F2EDE2] rounded text-[10px] font-mono uppercase text-luxury-charcoal/80 font-medium">
                {type} Complexion
              </span>
            ))}
          </div>

          {/* Action selection */}
          {selectedProduct.inStock ? (
            <div className="p-5 bg-white border border-[#E9DFCB] rounded-sm shadow-md space-y-5">
              
              {/* Recurring Billing Toggle Option */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-[#C29F6F] uppercase block font-semibold">Select Purchase Option:</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* One-Time Select */}
                  <button
                    type="button"
                    onClick={() => setPurchaseType('one-time')}
                    className={`flex flex-col text-left p-3.5 border rounded-sm transition-all text-xs cursor-pointer ${
                      purchaseType === 'one-time'
                        ? 'border-luxury-charcoal bg-[#FAF8F3] ring-1 ring-luxury-charcoal/50'
                        : 'border-[#E2D8C0]/60 hover:border-[#1E1D1A]'
                    }`}
                  >
                    <span className="font-bold text-[#1E1D1A]">One-time Ritual Bath</span>
                    <span className="text-[11px] text-[#C29F6F] font-mono mt-1 font-semibold">${selectedProduct.price.toFixed(2)}</span>
                    <span className="text-[9.5px] text-luxury-charcoal/50 mt-1 font-sans leading-none">Single high-purity batch dispatch</span>
                  </button>

                  {/* Subscription Select */}
                  <button
                    type="button"
                    onClick={() => setPurchaseType('subscription')}
                    className={`flex flex-col text-left p-3.5 border rounded-sm transition-all text-xs relative cursor-pointer ${
                      purchaseType === 'subscription'
                        ? 'border-luxury-charcoal bg-[#FAF8F3] ring-1 ring-luxury-charcoal/50'
                        : 'border-[#E2D8C0]/60 hover:border-[#1E1D1A]'
                    }`}
                  >
                    <span className="absolute -top-2 right-2.5 bg-[#C29F6F] text-white font-mono text-[8px] tracking-wider uppercase font-bold py-0.5 px-2 rounded-full">
                      SAVE 15%
                    </span>
                    <span className="font-bold text-[#1E1D1A]">Apothecary Subscription</span>
                    <span className="text-[11px] text-emerald-800 font-mono mt-1 font-bold">
                      ${(selectedProduct.price * 0.85).toFixed(2)} <span className="text-[9px] text-luxury-charcoal/40 line-through">${selectedProduct.price.toFixed(2)}</span>
                    </span>
                    <span className="text-[9.5px] text-luxury-charcoal/50 mt-1 font-sans leading-none">Refills delivered on custom frequency</span>
                  </button>
                </div>
              </div>

              {/* Conditionally reveal subscription delivery rates selectors */}
              {purchaseType === 'subscription' && (
                <div className="p-3.5 bg-[#FBF9F4] border border-[#E9DFCB]/60 rounded-sm space-y-2.5 animate-fade-in text-xs">
                  <span className="text-[10px] font-mono tracking-widest text-[#C29F6F] uppercase block font-semibold">Delivery Frequency:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSubscriptionFrequency('Monthly')}
                      className={`py-2 px-3 text-[11px] font-mono tracking-wider uppercase rounded cursor-pointer ${
                        subscriptionFrequency === 'Monthly'
                          ? 'bg-luxury-charcoal text-white font-medium'
                          : 'bg-white border border-[#E0D8C8] text-luxury-charcoal/70'
                      }`}
                    >
                      EVERY 30 DAYS
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubscriptionFrequency('Quarterly')}
                      className={`py-2 px-3 text-[11px] font-mono tracking-wider uppercase rounded cursor-pointer ${
                        subscriptionFrequency === 'Quarterly'
                          ? 'bg-luxury-charcoal text-white font-medium'
                          : 'bg-white border border-[#E0D8C8] text-luxury-charcoal/70'
                      }`}
                    >
                      EVERY 90 DAYS
                    </button>
                  </div>
                  <p className="text-[10px] text-emerald-850 font-normal mt-1 leading-relaxed">
                    ✨ Free courier shipping + easy pause or cancel anytime inside your customer dashboard panel.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-[#F0EAE1] pt-3">
                <span className="text-xs font-mono tracking-widest text-luxury-charcoal/60 uppercase">QUANTITY SELECTION</span>
                <div className="flex items-center border border-[#E0D8C8] rounded bg-white">
                  <button
                    onClick={handleDecrease}
                    className="p-1.5 pr-3 pl-3 text-luxury-charcoal/60 hover:text-luxury-gold duration-200"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-luxury-charcoal min-w-[24px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="p-1.5 pl-3 pr-3 text-luxury-charcoal/60 hover:text-luxury-gold duration-200"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                {/* Buy Add-to-cart */}
                <button
                  onClick={() => addToCart(
                    selectedProduct,
                    quantity,
                    purchaseType,
                    purchaseType === 'subscription' ? subscriptionFrequency : undefined
                  )}
                  className="flex-1 bg-[#1E1D1A] hover:bg-luxury-gold text-white text-xs tracking-widest uppercase py-3.5 font-semibold flex items-center justify-center gap-2 duration-300 shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart • ${(
                    (purchaseType === 'subscription' ? selectedProduct.price * 0.85 : selectedProduct.price) * quantity
                  ).toFixed(2)}
                </button>

                {/* Add to Favorites Toggle */}
                <button
                  onClick={() => toggleFavorite(selectedProduct.id)}
                  className={`p-3 border rounded transition-colors duration-200 cursor-pointer flex items-center justify-center ${
                    isFav
                      ? 'bg-rose-50 border-rose-200 text-luxury-rose'
                      : 'bg-white border-[#E0D8C8] text-luxury-charcoal/55 hover:text-luxury-rose hover:bg-rose-50/50'
                  }`}
                  title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>

            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-800 rounded-sm">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-light leading-relaxed">
                This item is currently undergoing custom molecular batch blending in our lab. Register to your dashboard to receive notifications about restocking schedules.
              </p>
            </div>
          )}

          {/* Interactive tabs detailing details, use ritual and ingredients checklist */}
          <div className="border border-[#E9DFCB]/60 rounded-sm overflow-hidden bg-[#FBF8F3]">
            <div className="flex border-b border-[#E9DFCB]/60 text-xs font-mono font-medium tracking-widest uppercase">
              <button
                onClick={() => setActiveTab('desc')}
                className={`flex-1 py-3 text-center cursor-pointer transition-colors ${
                  activeTab === 'desc' ? 'bg-[#1E1D1A] text-white' : 'text-luxury-charcoal/70 bg-white hover:bg-[#FAF7F2]'
                }`}
              >
                Philosophy
              </button>
              <button
                onClick={() => setActiveTab('howTo')}
                className={`flex-1 py-3 text-center cursor-pointer transition-colors ${
                  activeTab === 'howTo' ? 'bg-[#1E1D1A] text-white' : 'text-luxury-charcoal/70 bg-white hover:bg-[#FAF7F2]'
                }`}
              >
                Ritual Use
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`flex-1 py-3 text-center cursor-pointer transition-colors ${
                  activeTab === 'ingredients' ? 'bg-[#1E1D1A] text-white' : 'text-luxury-charcoal/70 bg-white hover:bg-[#FAF7F2]'
                }`}
              >
                Ingredients
              </button>
            </div>

            <div className="p-6 text-xs sm:text-sm text-luxury-charcoal/80 leading-relaxed font-light min-h-[140px] flex items-center">
              {activeTab === 'desc' && (
                <div className="space-y-2">
                  <p>Our commitment to dermatological minimalism means we focus entirely on molecular bio-compatibility. This formulation uses pure, cold-pressed raw foundations designed to respect your skin’s biological pH buffer.</p>
                  <p className="font-mono text-[10px] text-luxury-gold uppercase tracking-widest block font-semibold pt-1">
                    ✓ Clean formulas • ✓ Cruelty-free • ✓ Carbon offset shipping
                  </p>
                </div>
              )}

              {activeTab === 'howTo' && (
                <div className="space-y-2">
                  <p className="font-serif italic font-medium text-luxury-gold">"How to activate the ritual:"</p>
                  <p>{selectedProduct.howToUse}</p>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="w-full">
                  <p className="mb-3 font-medium text-[11px] font-mono tracking-wider uppercase text-luxury-charcoal border-b border-[#EADFC9]/50 pb-1.5">
                    KEY ACTIVE MOLECULES:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedProduct.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 font-sans font-light">
                        <Check className="w-3.5 h-3.5 text-luxury-gold flex-shrink-0" />
                        <span>{ing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* GLOW DIARY - REVIEWS AND TRUST TIMELINE SECTION */}
      <section className="space-y-8 pt-10 border-t border-[#F0EAE1]">
        
        {/* Glow Diary Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-[#FAF7F2] pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#C29F6F] uppercase block font-bold">
              SOCIAL TRANSFORMATION LOG
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-luxury-charcoal font-normal">
              The <span className="italic">Glow Diary</span>
            </h2>
            <div className="w-12 h-0.5 bg-luxury-gold mt-1" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-luxury-charcoal/50 uppercase">AVERAGE DERMATOLOGICAL RATIO:</span>
            <span className="text-sm font-mono font-bold text-luxury-charcoal bg-[#FAF8F3] px-2 py-1 border border-[#E9DFCB]/60">
              ⭐ {selectedProduct.rating} / 5.0
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: ACTIVE GLOW DIARY FEED ENTIRELY DYNAMIC (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xs font-mono tracking-widest text-luxury-gold uppercase font-bold">
              ✓ Verified Customer Experiences ({reviews.filter(r => r.productId === selectedProduct.id && r.status === 'Approved').length})
            </h3>

            {reviews.filter(r => r.productId === selectedProduct.id && r.status === 'Approved').length === 0 ? (
              <div className="p-8 text-center bg-[#FAF8F3]/60 border border-[#CBD9CE]/30 rounded-sm text-luxury-charcoal/50 space-y-2">
                <p className="text-sm font-serif italic text-luxury-charcoal/60">"This diary entry is waiting to be written."</p>
                <p className="text-xs font-light max-w-sm mx-auto">
                  Be the very first client to record your biochemical skin development and photo transformation logs under our registry. Fill out the form to begin.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews
                  .filter(r => r.productId === selectedProduct.id && r.status === 'Approved')
                  .map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 bg-white border border-[#E9DFCB]/50 hover:border-luxury-gold/40 transition-colors rounded-sm shadow-xs space-y-3"
                    >
                      {/* Rating details & author header */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div className="space-y-1">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating ? 'text-luxury-gold fill-current' : 'text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <h4 className="font-serif text-sm font-semibold text-luxury-charcoal">
                            {rev.title}
                          </h4>
                        </div>

                        <div className="text-right sm:text-right text-[10px] font-mono text-luxury-charcoal/50 uppercase">
                          <span className="font-sans text-xs font-bold text-luxury-charcoal block">
                            {rev.authorName}
                          </span>
                          <span>{rev.date}</span>
                        </div>
                      </div>

                      {/* Review Skin parameters tag */}
                      {(rev.skinType || rev.concern) && (
                        <div className="flex gap-2 text-[9.5px] font-mono uppercase">
                          {rev.skinType && (
                            <span className="bg-[#FAF7F2] border border-[#E9DFCB]/80 text-[#C29F6F] px-2 py-0.5 rounded-sm">
                              {rev.skinType} COMPLEXION
                            </span>
                          )}
                          {rev.concern && (
                            <span className="bg-[#FAF7F2] border border-[#E9DFCB]/80 text-[#C29F6F] px-2 py-0.5 rounded-sm">
                              CONCERN: {rev.concern}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Commentary and Review Image */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-start">
                        <div className="md:col-span-8 text-xs sm:text-[13px] text-luxury-charcoal/80 leading-relaxed font-light font-sans">
                          {rev.comment}
                        </div>

                        {rev.imageUrl && (
                          <div className="md:col-span-4 max-w-[150px] aspect-square rounded overflow-hidden border border-[#FAF7F2] bg-luxury-cream">
                            <img
                              src={rev.imageUrl}
                              alt="Customer skin journey photo"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: CONTRIBUTE TO GLOW DIARY TESTIMONIAL FORM (4/12) */}
          <div className="lg:col-span-4 bg-[#FAF8F3] border border-[#CBD8CE]/40 p-6 rounded-sm space-y-4">
            
            <div className="space-y-1 border-b border-[#FAF7F2] pb-2">
              <span className="text-[9px] font-mono tracking-widest text-[#C29F6F] uppercase block font-bold">CLIENT LOG PORTAL</span>
              <h3 className="font-serif text-sm font-bold text-luxury-charcoal uppercase tracking-wide">
                Write to Glow Diary
              </h3>
            </div>

            {reviewSuccessMsg ? (
              <div className="bg-emerald-50 border border-emerald-250 p-4 text-xs text-emerald-900 rounded space-y-2.5">
                <p className="font-serif font-bold">✓ Reflection Submitted Successfully!</p>
                <p className="font-light leading-relaxed">
                  Your testimony and product image have been successfully uploaded to the manual admin moderation queue under our **Reviews Security Ledger**.
                </p>
                <p className="font-normal">
                  It will display live once verified by our laboratory support team.
                </p>
                <button
                  type="button"
                  onClick={() => setReviewSuccessMsg(false)}
                  className="text-[10px] uppercase font-mono tracking-widest text-emerald-800 underline block cursor-pointer"
                >
                  Write Another Entry
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reviewAuthor.trim() || !reviewComment.trim() || !reviewTitle.trim()) {
                    alert('Please specify your name, testimonial title, and comments.');
                    return;
                  }
                  
                  // Submit
                  addReview({
                    productId: selectedProduct.id,
                    productName: selectedProduct.name,
                    authorName: reviewAuthor,
                    authorEmail: reviewEmail || 'guest@glowregistry.com',
                    rating: reviewRating,
                    title: reviewTitle,
                    comment: reviewComment,
                    imageUrl: reviewImage.trim() || undefined,
                    skinType: reviewSkinType,
                    concern: reviewConcern
                  });

                  // Success Message and clean fields
                  setReviewAuthor('');
                  setReviewEmail('');
                  setReviewRating(5);
                  setReviewTitle('');
                  setReviewComment('');
                  setReviewImage('');
                  setReviewSuccessMsg(true);
                }}
                className="space-y-3.5 text-xs text-luxury-charcoal"
              >
                
                {/* Author Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-luxury-charcoal/70 block">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Clara Dubois"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full bg-white border border-[#CBD8CE]/50 px-3 py-1.5 rounded-xs"
                  />
                </div>

                {/* Email (Optional but helpful) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-luxury-charcoal/70 block">Email Address</label>
                  <input
                    type="email"
                    placeholder="E.g., client@glowmail.com"
                    value={reviewEmail}
                    onChange={(e) => setReviewEmail(e.target.value)}
                    className="w-full bg-white border border-[#CBD8CE]/50 px-3 py-1.5 rounded-xs"
                  />
                </div>

                {/* Rating selection (Stars) */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-luxury-charcoal/70 block">Formulation Rating</span>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewRating(i + 1)}
                        className="text-luxury-charcoal hover:scale-110 duration-150 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            i < reviewRating ? 'text-luxury-gold fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skin Type Complexion */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-mono uppercase tracking-widest text-luxury-charcoal/70 block">Complexion</label>
                    <select
                      value={reviewSkinType}
                      onChange={(e: any) => setReviewSkinType(e.target.value)}
                      className="w-full bg-white border border-[#CBD8CE]/50 px-2 py-1.5 rounded-xs font-mono text-[10.5px]"
                    >
                      <option value="Dry">Dry</option>
                      <option value="Oily">Oily</option>
                      <option value="Combination">Combination</option>
                      <option value="Sensitive">Sensitive</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-mono uppercase tracking-widest text-luxury-charcoal/70 block">Primary Concern</label>
                    <select
                      value={reviewConcern}
                      onChange={(e: any) => setReviewConcern(e.target.value)}
                      className="w-full bg-white border border-[#CBD8CE]/50 px-2 py-1.5 rounded-xs font-mono text-[10.5px]"
                    >
                      <option value="Hydration">Hydration</option>
                      <option value="Acne">Acne</option>
                      <option value="Aging">Aging</option>
                      <option value="Dullness">Dullness</option>
                      <option value="Sensitivities">Sensitivities</option>
                    </select>
                  </div>
                </div>

                {/* Review Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-luxury-charcoal/70 block">Testimonial Title</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Radiant and balanced skin!"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full bg-white border border-[#CBD8CE]/50 px-3 py-1.5 rounded-xs"
                  />
                </div>

                {/* Comment Text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-luxury-charcoal/70 block">Skin Transformation Comments</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share your botanical elixirs ritual process and barriers improvements..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full bg-white border border-[#CBD8CE]/50 px-3 py-1.5 rounded-xs resize-none"
                  />
                </div>

                {/* Customer image URL */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-luxury-charcoal/70 block">Photo URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/skin-before-after.jpg"
                    value={reviewImage}
                    onChange={(e) => setReviewImage(e.target.value)}
                    className="w-full bg-white border border-[#CBD8CE]/50 px-3 py-1.5 rounded-xs font-mono text-[11px]"
                  />
                  <span className="text-[9px] text-[#C29F6F] font-light leading-none">
                    Provide an Unsplash or static image to test dynamic review imagery rendering.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-luxury-charcoal hover:bg-luxury-gold text-white text-xs uppercase font-bold tracking-widest py-3 rounded-xs duration-300 shadow-sm cursor-pointer"
                >
                  Publish to Queue
                </button>

              </form>
            )}

          </div>

        </div>

      </section>

      {/* 3. Recommended for you - cross sells */}
      <section className="space-y-6 pt-10 border-t border-[#F0EAE1]">
        <div className="text-center max-w-sm mx-auto space-y-1">
          <span className="text-[10px] font-mono tracking-widest uppercase text-luxury-gold font-bold">
            Tailor-made matches
          </span>
          <h2 className="text-2xl text-luxury-charcoal font-serif font-normal">
            Recommended for You
          </h2>
          <div className="w-8 h-0.5 bg-luxury-gold/50 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedProduct(p);
                setQuantity(1);
                // Scroll top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white border border-[#E9DFCB]/50 p-4 rounded-sm hover:shadow-lg transition-all duration-350 cursor-pointer group flex gap-4 items-center"
            >
              <div className="w-20 h-24 bg-luxury-cream rounded-sm overflow-hidden flex-shrink-0">
                <img
                  src={p.primaryImage}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </div>

              <div className="space-y-1 flex-1">
                <span className="text-[9px] font-mono tracking-widest text-luxury-gold uppercase block font-semibold">
                  {p.category}
                </span>
                <h4 className="font-serif text-sm font-semibold text-luxury-charcoal leading-tight group-hover:text-luxury-gold duration-200">
                  {p.name}
                </h4>
                <p className="font-mono text-xs font-semibold text-luxury-charcoal pt-1.5">
                  ${p.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Sticky CTA button mock-up for luxurious ecomm feel */}
      <div className="fixed bottom-0 left-0 right-0 z-35 bg-white/95 backdrop-blur-md border-t border-[#F0EAE1] shadow-xl py-3 px-4 flex items-center justify-between sm:px-8 animate-fade-in md:hidden">
        <div className="flex flex-col">
          <span className="text-[9.5px] font-mono text-luxury-gold uppercase font-bold tracking-wider leading-none">
            {selectedProduct.category} Collection
          </span>
          <span className="font-serif text-sm font-semibold text-luxury-charcoal mt-1 line-clamp-1 leading-none">
            {selectedProduct.name}
          </span>
        </div>

        {selectedProduct.inStock ? (
          <button
            onClick={() => addToCart(selectedProduct, 1)}
            className="bg-[#1E1D1A] hover:bg-luxury-gold text-[#FAF7F2] py-2 px-4 rounded text-[11px] font-mono tracking-wider uppercase flex items-center gap-1.5 font-bold transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add • ${selectedProduct.price.toFixed(2)}
          </button>
        ) : (
          <span className="text-[10px] font-mono uppercase bg-rose-50 text-rose-800 py-2 px-3 font-bold border border-rose-100">
            Sold Out
          </span>
        )}
      </div>

    </div>
  );
}
