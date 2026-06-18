import { useApp } from '../context/AppContext';
import { QUIZ_QUESTIONS, PRODUCTS } from '../data';
import { useState } from 'react';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle, ShoppingBag, Eye } from 'lucide-react';
import quizBg from '../assets/images/skincare_quiz_bg_1779494109684.png';

export default function SkinQuiz() {
  const { addToCart, applyDiscount, setActivePage, setSelectedProduct } = useApp();

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [scores, setScores] = useState<{
    skinTypes: { Dry: number; Oily: number; Combination: number; Sensitive: number };
    concerns: { Hydration: number; Acne: number; Aging: number; Dullness: number; Sensitivities: number };
  }>({
    skinTypes: { Dry: 0, Oily: 0, Combination: 0, Sensitive: 0 },
    concerns: { Hydration: 0, Acne: 0, Aging: 0, Dullness: 0, Sensitivities: 0 },
  });

  const [quizFinished, setQuizFinished] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Computed results
  const [finalSkinType, setFinalSkinType] = useState<'Dry' | 'Oily' | 'Combination' | 'Sensitive'>('Dry');
  const [finalConcern, setFinalConcern] = useState<'Hydration' | 'Acne' | 'Aging' | 'Dullness' | 'Sensitivities'>('Hydration');
  const [recommendedTrio, setRecommendedTrio] = useState<any[]>([]);

  const handleOptionSelect = (option: typeof QUIZ_QUESTIONS[0]['options'][0]) => {
    // Accumulate score
    const updatedScores = { ...scores };
    if (option.skinTypeScore) {
      updatedScores.skinTypes[option.skinTypeScore] += 1;
    }
    if (option.concernScore) {
      updatedScores.concerns[option.concernScore] += 1;
    }
    setScores(updatedScores);

    // Sequence trigger
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Analyze final profiles
      setAnalyzing(true);
      setTimeout(() => {
        // Find highest scoring categories
        const highestSkinType = Object.keys(updatedScores.skinTypes).reduce((a, b) =>
          updatedScores.skinTypes[a as keyof typeof updatedScores.skinTypes] >= updatedScores.skinTypes[b as keyof typeof updatedScores.skinTypes] ? a : b
        ) as any;

        const highestConcern = Object.keys(updatedScores.concerns).reduce((a, b) =>
          updatedScores.concerns[a as keyof typeof updatedScores.concerns] >= updatedScores.concerns[b as keyof typeof updatedScores.concerns] ? a : b
        ) as any;

        setFinalSkinType(highestSkinType);
        setFinalConcern(highestConcern);

        // Find best 3 custom matching products: Cleanser, Serum (Treatment), Moisturizer
        const matchingCleanser = PRODUCTS.find(
          (p) => p.category === 'Cleanser' && (p.skinTypes.includes(highestSkinType) || p.skinTypes.includes('All'))
        ) || PRODUCTS.find((p) => p.category === 'Cleanser');

        const matchingTreatment = PRODUCTS.find(
          (p) => p.category === 'Serum' && (p.concerns.includes(highestConcern) || p.concerns.includes('All'))
        ) || PRODUCTS.find((p) => p.category === 'Serum');

        const matchingMoisturizer = PRODUCTS.find(
          (p) => p.category === 'Moisturizer' && (p.skinTypes.includes(highestSkinType) || p.skinTypes.includes('All'))
        ) || PRODUCTS.find((p) => p.category === 'Moisturizer');

        const trio = [matchingCleanser, matchingTreatment, matchingMoisturizer].filter(Boolean);
        setRecommendedTrio(trio);

        setAnalyzing(false);
        setQuizFinished(true);
        applyDiscount('ROUTINE15'); // Auto pre-apply routine discount
      }, 1500);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setScores({
      skinTypes: { Dry: 0, Oily: 0, Combination: 0, Sensitive: 0 },
      concerns: { Hydration: 0, Acne: 0, Aging: 0, Dullness: 0, Sensitivities: 0 },
    });
    setQuizFinished(false);
  };

  const handleAddBundleToCart = () => {
    recommendedTrio.forEach((product) => {
      addToCart(product, 1);
    });
    // Scroll smoothly to active navigation header bar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Editorial Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-luxury-gold font-bold">
          Dermatological profiling
        </span>
        <h1 className="text-3xl font-serif font-normal text-luxury-charcoal">
          The Skin Diagnostic Unit
        </h1>
        <div className="w-12 h-0.5 bg-luxury-gold/50 mx-auto" />
        <p className="text-xs sm:text-sm text-luxury-charcoal/65 leading-relaxed font-light">
          Unlock your skin’s metabolic blueprint. Our diagnostic model cross-calculates epidermal moisture barriers and environmental sensitivities to yield custom botanical alignments.
        </p>
      </div>

      {/* Main Container styling */}
      <div className="max-w-4xl mx-auto bg-white border border-[#E9DFCB]/50 shadow-xl rounded-sm overflow-hidden min-h-[460px] grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Aspect: Content visual banner */}
        <div className="md:col-span-5 relative hidden md:block">
          <img
            src={quizBg}
            alt="Gloss skin model portrait"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#1E1D1A]/10 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute bottom-6 left-6 text-white space-y-1 pr-6">
            <h4 className="font-serif text-lg tracking-wide">Radiant Harmony</h4>
            <p className="text-[10px] font-mono tracking-widest text-[#F2EDE2] uppercase">
              Formulated for biological synergy.
            </p>
          </div>
        </div>

        {/* Right Aspect: Interactive questions or results screen */}
        <div className="md:col-span-7 flex flex-col justify-center p-6 sm:p-10 bg-white">
          
          {/* A. Loading State */}
          {analyzing ? (
            <div className="text-center space-y-6 py-12">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute border-4 border-luxury-gold/20 border-t-luxury-gold rounded-full w-full h-full animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-luxury-gold animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-lg text-luxury-charcoal">Analyzing Epidermal Profile...</h3>
                <p className="text-xs text-luxury-charcoal/50 font-mono tracking-widest uppercase">
                  Cross-referencing lipid tolerances & sebum matrices
                </p>
              </div>
            </div>
          ) : !quizFinished ? (
            // B. Interactive Question State
            <div className="space-y-6">
              
              {/* Question progress */}
              <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                <span className="text-[10px] font-mono text-luxury-gold tracking-widest uppercase font-bold">
                  Step {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span className="text-[10px] font-mono text-luxury-charcoal/40 tracking-wider">
                  {Math.round(((currentQuestionIdx) / QUIZ_QUESTIONS.length) * 100)}% COMPLETED
                </span>
              </div>

              {/* Progress bar line */}
              <div className="w-full bg-[#FAF7F2] h-1 rounded-full overflow-hidden">
                <div
                  className="bg-luxury-gold h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-serif text-luxury-charcoal leading-tight font-normal">
                  {QUIZ_QUESTIONS[currentQuestionIdx].question}
                </h2>

                <div className="space-y-3 pt-2">
                  {QUIZ_QUESTIONS[currentQuestionIdx].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      className="w-full text-left p-4 border border-[#EBE3D3] bg-[#FAF8F3] hover:bg-white hover:border-luxury-gold hover:shadow-md transition-all duration-200 group rounded-xs flex flex-col text-xs space-y-1 cursor-pointer"
                    >
                      <span className="font-serif font-semibold text-sm text-luxury-charcoal group-hover:text-luxury-gold flex justify-between items-center w-full">
                        {option.label}
                        <ArrowRight className="w-4 h-4 text-luxury-charcoal/30 group-hover:translate-x-1 duration-200" />
                      </span>
                      <span className="text-[11px] text-luxury-charcoal/60 leading-relaxed font-light">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            // C. Quiz Results & Tailored Recommendations Screen
            <div className="space-y-6">
              
              <div className="space-y-2 border-b border-[#FAF7F2] pb-4">
                <div className="flex items-center gap-1.5 text-emerald-800 text-[10px] font-mono tracking-widest uppercase font-bold bg-[#EBF1EC] px-3 py-1 rounded w-fit">
                  <CheckCircle className="w-3.5 h-3.5" /> Diagnosis Completed Successfully
                </div>
                
                <h2 className="text-2xl font-serif text-luxury-charcoal leading-tight font-normal pt-1">
                  Your Skin Blueprint: <br />
                  <span className="italic text-luxury-gold">{finalSkinType} Complexion</span>
                </h2>
                
                <p className="text-xs text-luxury-charcoal/60 font-light leading-relaxed">
                  Calculated concern: <span className="font-semibold text-luxury-charcoal font-sans">{finalConcern}</span>.
                  Your barrier thrives under active biological ceramides and continuous multi-weight hydration triggers.
                </p>
              </div>

              {/* Recommended trio showcase */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono tracking-widest uppercase text-luxury-gold font-bold">
                  Your 3-Step Custom Aligned Routine
                </h3>

                <div className="space-y-3 max-h-[190px] overflow-y-auto pr-2 divide-y divide-[#FAF7F2]">
                  {recommendedTrio.map((p, idx) => (
                    <div key={p.id} className="flex gap-3 py-2.5 first:pt-0 last:pb-0 items-center">
                      <div className="w-12 h-14 bg-[#FAF7F2] border border-[#F0EAE1] overflow-hidden flex-shrink-0">
                        <img
                          src={p.primaryImage}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-0.5">
                        <div className="flex justify-between text-xs font-bold font-serif text-luxury-charcoal">
                          <span className="truncate max-w-[190px]">{p.name}</span>
                          <span className="font-mono text-luxury-charcoal/70">${p.price.toFixed(2)}</span>
                        </div>
                        <p className="text-[9.5px] font-mono text-luxury-gold uppercase tracking-widest">
                          STEP {idx + 1}: {p.category}
                        </p>
                        <p className="text-[10.5px] text-luxury-charcoal/60 leading-tight font-light truncate max-w-[240px]">
                          {p.subtitle}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setActivePage('product-detail');
                        }}
                        className="p-1 px-2.5 bg-[#FAF7F2] border border-[#EADFC9] text-[9.5px] font-mono uppercase tracking-wider text-luxury-charcoal hover:bg-luxury-gold hover:text-white duration-200 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" /> Info
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Action bundle block with discounts and codes */}
              <div className="bg-[#EBF1EC]/60 border border-[#CBD9CE]/50 p-4 rounded-sm space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-serif text-xs font-bold text-emerald-800 tracking-wider">BUNDLE PROMO DISCOUNT</h4>
                    <p className="text-[11px] text-luxury-charcoal/70 font-light mt-0.5">
                      Coupon <span className="font-mono font-bold bg-[#FAF8F3] px-1 text-luxury-charcoal border border-[#CBD9CE]/40">ROUTINE15</span> (15% off) has been automatically pre-applied to your session.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleAddBundleToCart}
                    className="flex-1 bg-luxury-charcoal hover:bg-emerald-800 text-[#FAF7F2] py-3 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 duration-300 shadow-xs cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Acquire Entire Routine Bundle
                  </button>
                  
                  <button
                    onClick={handleRestartQuiz}
                    className="p-3 border border-luxury-charcoal/30 hover:border-luxury-gold text-luxury-charcoal/80 hover:text-luxury-gold transition-colors text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-1 cursor-pointer bg-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Retake
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
