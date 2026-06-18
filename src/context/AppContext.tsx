import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, UserProfile, Article, SiteSettings, ProductReview, Subscription } from '../types';
import { PRODUCTS, ARTICLES } from '../data';
import { 
  isSupabaseConfigured,
  getSupabaseProducts,
  upsertSupabaseProduct,
  deleteSupabaseProduct,
  getSupabaseOrders,
  upsertSupabaseOrder,
  getSupabaseArticles,
  upsertSupabaseArticle,
  deleteSupabaseArticle,
  getSupabaseReviews,
  upsertSupabaseReview
} from '../lib/supabase';


interface AppContextType {
  activePage: 'home' | 'shop' | 'product-detail' | 'about' | 'blog' | 'quiz' | 'routine' | 'account' | 'admin';
  setActivePage: (page: 'home' | 'shop' | 'product-detail' | 'about' | 'blog' | 'quiz' | 'routine' | 'account' | 'admin') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, purchaseType?: 'one-time' | 'subscription', subscriptionFrequency?: 'Monthly' | 'Quarterly') => void;
  removeFromCart: (productId: string, purchaseType?: 'one-time' | 'subscription', subscriptionFrequency?: 'Monthly' | 'Quarterly') => void;
  updateCartQuantity: (productId: string, quantity: number, purchaseType?: 'one-time' | 'subscription', subscriptionFrequency?: 'Monthly' | 'Quarterly') => void;
  clearCart: () => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  currentUser: UserProfile | null;
  loginUser: (email: string, fullName: string) => void;
  logoutUser: () => void;
  orders: Order[]; // For currently logged-in customer
  allOrders: Order[]; // Global orders list for admin panel
  placeOrder: (shippingInfo: { addressLine: string; city: string; state: string; zip: string; country: string }, paymentMethod: 'card' | 'paypal', discountCode?: string) => Order | null;
  updateOrderStatus: (orderId: string, status: 'Processing' | 'Shipped' | 'Delivered' | 'Refunded', trackingNumber?: string, trackingCarrier?: string) => void;
  processRefund: (orderId: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  discountApplied: { code: string; percent: number } | null;
  applyDiscount: (code: string) => boolean;

  // Inventory Management
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;

  // Blog CMS
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (articleId: string) => void;

  // Hero CMS
  heroBannerSettings: { title: string; subtitle: string; image: string };
  updateHeroBannerSettings: (settings: { title: string; subtitle: string; image: string }) => void;

  // Global Site Settings / Media CMS
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: SiteSettings) => void;

  // Glow Points (Loyalty System)
  pointsRedeemed: number;
  setPointsRedeemed: (points: number) => void;

  // Subscriptions Engine
  subscriptions: Subscription[];
  updateSubscriptionStatus: (id: string, status: 'Active' | 'Paused' | 'Cancelled') => void;

  // Review & Social Proof Moderation (Glow Diary)
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'date' | 'status'> & { imageUrl?: string; rating: number; title: string; comment: string }) => void;
  updateReviewStatus: (reviewId: string, status: 'Approved' | 'Pending' | 'Rejected') => void;

  // Abandoned Cart Simulated Engine (Localhost First approach)
  abandonedCartDispatched: boolean;
  setAbandonedCartDispatched: (val: boolean) => void;
  dispatchedCartContent: CartItem[];
  simTimePassed: boolean;
  setSimTimePassed: (val: boolean) => void;
  triggerDevAbandonedCart: () => void;

  // Theme support
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SEEDED_ORDERS: Order[] = [
  {
    id: 'GS-891042',
    items: [
      {
        product: PRODUCTS[0], // Purifying Lotus Milky Cleanser
        quantity: 1,
      },
      {
        product: PRODUCTS[5], // Cashmere Cloud Deep Barrier Cream
        quantity: 1,
      }
    ],
    subtotal: 92.00,
    shipping: 15.00,
    tax: 7.36,
    total: 114.36,
    name: 'Charlotte Vance',
    email: 'charlotte.v@gmail.com',
    shippingAddress: {
      addressLine: '546 Ethereal Gardens, Suite B',
      city: 'Beverly Hills',
      state: 'CA',
      zip: '90210',
      country: 'United States',
    },
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    orderDate: 'May 10, 2026',
    status: 'Delivered',
    trackingNumber: 'GLOW-8743120934',
    trackingCarrier: 'DHL Luxury Express',
  },
  {
    id: 'GS-304918',
    items: [
      {
        product: PRODUCTS[3], // Radiance Amber Nectar Serum
        quantity: 1,
      },
      {
        product: PRODUCTS[2], // Alpine Rose Infused Mineral Toner
        quantity: 1,
      }
    ],
    subtotal: 102.00,
    shipping: 0.00,
    tax: 8.16,
    total: 110.16,
    name: 'Henry Lawson',
    email: 'henry.lawson@outlook.com',
    shippingAddress: {
      addressLine: '82 Alpine Terrace',
      city: 'Geneva',
      state: 'GE',
      zip: '1201',
      country: 'Switzerland',
    },
    paymentMethod: 'paypal',
    paymentStatus: 'Paid',
    orderDate: 'May 19, 2026',
    status: 'Shipped',
    trackingNumber: 'GLOW-1934810243',
    trackingCarrier: 'DHL Luxury Express',
  },
  {
    id: 'GS-774912',
    items: [
      {
        product: PRODUCTS[4], // Luna Ceramide Retinol Night Nectar
        quantity: 1,
      }
    ],
    subtotal: 76.00,
    shipping: 15.00,
    tax: 6.08,
    total: 97.08,
    name: 'Sophia Martinez',
    email: 'sophia.m99@gmail.com',
    shippingAddress: {
      addressLine: '12 Ocean Breeze Dr',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'United States',
    },
    paymentMethod: 'card',
    paymentStatus: 'Paid',
    orderDate: 'May 22, 2026',
    status: 'Processing',
    trackingNumber: 'GLOW-4938102484',
    trackingCarrier: 'DHL Luxury Express',
  }
];

const SEEDED_REVIEWS: ProductReview[] = [
  {
    id: 'rev-001',
    productId: 'prod-001',
    productName: 'Purifying Lotus Milky Cleanser',
    authorName: 'Eleanor Sterling',
    authorEmail: 'eleanor.sterling@outlook.com',
    rating: 5,
    title: 'Divine Softness & Clean Ingredients',
    comment: 'The lotus and chamomile are incredibly soothing on my dry skin. It does not strip my barrier, and leaves this subtle dewy cushion. Absolutely gorgeous!',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    date: 'May 3, 2026',
    status: 'Approved',
    skinType: 'Dry',
    concern: 'Hydration'
  },
  {
    id: 'rev-002',
    productId: 'prod-004',
    productName: 'Radiance Amber Nectar Serum',
    authorName: 'Marcus Bennett',
    authorEmail: 'marcus.b@gmail.com',
    rating: 5,
    title: 'Acne Scars Cleared Up in Weeks!',
    comment: 'This nectar has single handedly reversed my stubborn dullness and post-breakout dark marks. Incredible clinical standard.',
    date: 'May 14, 2026',
    status: 'Approved',
    skinType: 'Oily',
    concern: 'Acne'
  },
  {
    id: 'rev-003',
    productId: 'prod-003',
    productName: 'Alpine Rose Infused Mineral Toner',
    authorName: 'Clara Dubois',
    authorEmail: 'clara.dubois@swissmail.ch',
    rating: 5,
    title: 'Glow Diary Essential',
    comment: 'An absolute masterpiece of hydration. I mist this on my combination skin before serum and it creates an active seal.',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    date: 'May 19, 2026',
    status: 'Approved',
    skinType: 'Combination',
    concern: 'Dullness'
  },
  {
    id: 'rev-004',
    productId: 'prod-002',
    productName: 'Safflower Cell Renew Oil',
    authorName: 'Isabella Vance',
    authorEmail: 'isabellavance@gmail.com',
    rating: 4,
    title: 'Beautiful oil but pending photo audit',
    comment: 'My skin looks incredibly plump and hydrated! Leaving this review to test the admin approval pipeline with my product bottle photo.',
    imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=600&q=80',
    date: 'May 23, 2026',
    status: 'Pending',
    skinType: 'Sensitive',
    concern: 'Sensitivities'
  }
];

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  logoTitle: 'GLOW',
  logoSubtitle: 'skincare',
  brandSlogan: 'Uncompromising apothecary elixirs forging active botanical chemistry with clinical barrier lipids. True beauty starts with well-being.',
  announcementText: 'Enjoy Complementary Courier Delivery On All Orders Above $100',
  headquartersLocation: 'Geneva, Switzerland',
  supportPhone: '+41 (22) 546-7789',
  supportHours: 'Mon - Sat 09:00 - 18:00 CET',
  aboutStoryTitle: 'True beauty starts with well-being.',
  aboutStorySubtitle: 'The Philosophy of Pure Foundations',
  aboutStoryPara1: 'In an industry centered on aggressive chemical transformations and artificial surface radiance, GlowSkincare was forged in 2026 to celebrate a different standard: dermatological minimalism aligned with absolute physical harmony.',
  aboutStoryPara2: 'We believe your skin is not an outer battleground to be polished with peeling acids, but an incredibly sophisticated, breathing ecosystem. Our products do not cover up your identity; they supply high-purity biological blocks that reinforce your skin\'s inherent metabolic resilience.',
  aboutStoryPara3: 'From alpine rose terraces high in the Swiss mountains to the sustainable glass-bottled formulations of our laboratorial units, we prioritize integrity above scale. No filler water, no chemical fragrances, no synthetic colors. Welcome to the apothecary of true self-presence.',
  pointsNeededForOneDollar: 10
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activePage, setActivePage] = useState<'home' | 'shop' | 'product-detail' | 'about' | 'blog' | 'quiz' | 'routine' | 'account' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [discountApplied, setDiscountApplied] = useState<{ code: string; percent: number } | null>(null);

  // Dynamic products list
  const [products, setProducts] = useState<Product[]>([]);
  // Dynamic articles list
  const [articles, setArticles] = useState<Article[]>([]);
  // Hero Banner Settings
  const [heroBannerSettings, setHeroBannerSettings] = useState({
    title: 'Celebrate Your Unique Skin.',
    subtitle: 'True beauty starts with well-being. We forge active botanical chemistry with clinical lipids to create a calming, barrier-first skincare ritual of pure, minimalist luxury.',
    image: '', // defaults to local fallback if empty
  });
  // Global Media and Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  // Glow Points (Loyalty System)
  const [pointsRedeemed, setPointsRedeemed] = useState<number>(0);

  // Subscriptions Engine
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // Review & Social Proof Moderation (Glow Diary)
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  // Simulated Abandoned Cart Events
  const [abandonedCartDispatched, setAbandonedCartDispatched] = useState<boolean>(false);
  const [dispatchedCartContent, setDispatchedCartContent] = useState<CartItem[]>([]);
  const [simTimePassed, setSimTimePassed] = useState<boolean>(false);

  // Theme support
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('glow_theme') as 'light' | 'dark') || 'light';
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('glow_theme', next);
      return next;
    });
  };

  // Load initial states from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('glow_cart');
    const savedFavorites = localStorage.getItem('glow_favorites');
    const savedUser = localStorage.getItem('glow_user');
    const savedOrders = localStorage.getItem('glow_orders');
    const savedProducts = localStorage.getItem('glow_products');
    const savedArticles = localStorage.getItem('glow_articles');
    const savedHeroSettings = localStorage.getItem('glow_hero_banner');

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    
    // Parse user
    let user: UserProfile | null = null;
    if (savedUser) {
      user = JSON.parse(savedUser);
      setCurrentUser(user);
    }

    // Parse all orders or seed them
    let parsedAllOrders: Order[] = [];
    if (savedOrders) {
      parsedAllOrders = JSON.parse(savedOrders);
    } else {
      parsedAllOrders = SEEDED_ORDERS;
      localStorage.setItem('glow_orders', JSON.stringify(SEEDED_ORDERS));
    }
    setAllOrders(parsedAllOrders);

    // Filter orders if user logged in
    if (user) {
      setOrders(parsedAllOrders.filter(o => o.email === user!.email));
    } else {
      setOrders([]);
    }

    // Parse dynamic product inventory
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(PRODUCTS);
      localStorage.setItem('glow_products', JSON.stringify(PRODUCTS));
    }

    // Parse dynamic articles log
    if (savedArticles) {
      setArticles(JSON.parse(savedArticles));
    } else {
      setArticles(ARTICLES);
      localStorage.setItem('glow_articles', JSON.stringify(ARTICLES));
    }

    // Parse main banner
    if (savedHeroSettings) {
      setHeroBannerSettings(JSON.parse(savedHeroSettings));
    }

    // Parse dynamic site media configurations
    const savedSiteSettings = localStorage.getItem('glow_site_settings');
    if (savedSiteSettings) {
      setSiteSettings(JSON.parse(savedSiteSettings));
    }

    // Parse dynamic review logs or seed them
    const savedReviews = localStorage.getItem('glow_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews(SEEDED_REVIEWS);
      localStorage.setItem('glow_reviews', JSON.stringify(SEEDED_REVIEWS));
    }

    // Parse active client subscriptions configuration
    const savedSubscriptions = localStorage.getItem('glow_subscriptions');
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    } else {
      setSubscriptions([]);
    }
  }, []);

  // Overwrite local state with live database values if Supabase is configured
  useEffect(() => {
    async function syncSupabaseCollections() {
      if (!isSupabaseConfigured) return;
      try {
        console.log('📥 Premium Supabase Database live syncing active...');
        
        const dbProducts = await getSupabaseProducts();
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
          localStorage.setItem('glow_products', JSON.stringify(dbProducts));
        }
        
        const dbArticles = await getSupabaseArticles();
        if (dbArticles && dbArticles.length > 0) {
          setArticles(dbArticles);
          localStorage.setItem('glow_articles', JSON.stringify(dbArticles));
        }
        
        const dbReviews = await getSupabaseReviews();
        if (dbReviews && dbReviews.length > 0) {
          setReviews(dbReviews);
          localStorage.setItem('glow_reviews', JSON.stringify(dbReviews));
        }

        const dbOrders = await getSupabaseOrders();
        if (dbOrders) {
          setAllOrders(dbOrders);
          localStorage.setItem('glow_orders', JSON.stringify(dbOrders));
        }
      } catch (err) {
        console.warn('Silent fallback on Supabase sync override:', err);
      }
    }
    
    syncSupabaseCollections();
  }, [currentUser]);


  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
    localStorage.setItem('glow_site_settings', JSON.stringify(settings));
  };

  // Sync user orders when user logs in or out
  useEffect(() => {
    if (currentUser) {
      setOrders(allOrders.filter(o => o.email === currentUser.email));
    } else {
      setOrders([]);
    }
  }, [currentUser, allOrders]);

  // Save states to localStorage on modifications
  const saveCartToStorage = (newCart: CartItem[]) => {
    localStorage.setItem('glow_cart', JSON.stringify(newCart));
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    purchaseType: 'one-time' | 'subscription' = 'one-time',
    subscriptionFrequency?: 'Monthly' | 'Quarterly'
  ) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) =>
          item.product.id === product.id &&
          (item.purchaseType || 'one-time') === purchaseType &&
          item.subscriptionFrequency === subscriptionFrequency
      );
      let updatedCart;
      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.product.id === product.id &&
          (item.purchaseType || 'one-time') === purchaseType &&
          item.subscriptionFrequency === subscriptionFrequency
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...prevCart, { product, quantity, purchaseType, subscriptionFrequency }];
      }
      saveCartToStorage(updatedCart);
      return updatedCart;
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (
    productId: string,
    purchaseType: 'one-time' | 'subscription' = 'one-time',
    subscriptionFrequency?: 'Monthly' | 'Quarterly'
  ) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (item.purchaseType || 'one-time') === purchaseType &&
            item.subscriptionFrequency === subscriptionFrequency
          )
      );
      saveCartToStorage(updatedCart);
      return updatedCart;
    });
  };

  const updateCartQuantity = (
    productId: string,
    quantity: number,
    purchaseType: 'one-time' | 'subscription' = 'one-time',
    subscriptionFrequency?: 'Monthly' | 'Quarterly'
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, purchaseType, subscriptionFrequency);
      return;
    }
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.product.id === productId &&
        (item.purchaseType || 'one-time') === purchaseType &&
        item.subscriptionFrequency === subscriptionFrequency
          ? { ...item, quantity }
          : item
      );
      saveCartToStorage(updatedCart);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setDiscountApplied(null);
    localStorage.removeItem('glow_cart');
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prevFavorites) => {
      let updatedFavorites;
      if (prevFavorites.includes(productId)) {
        updatedFavorites = prevFavorites.filter((id) => id !== productId);
      } else {
        updatedFavorites = [...prevFavorites, productId];
      }
      localStorage.setItem('glow_favorites', JSON.stringify(updatedFavorites));

      // Also update favorites in user profile if logged in
      if (currentUser) {
        const updatedUser = { ...currentUser, favorites: updatedFavorites };
        setCurrentUser(updatedUser);
        localStorage.setItem('glow_user', JSON.stringify(updatedUser));
      }

      return updatedFavorites;
    });
  };

  const loginUser = (email: string, fullName: string) => {
    const userFavorites = favorites; // merge current session favorites
    const profile: UserProfile = { email, fullName, favorites: userFavorites };
    setCurrentUser(profile);
    localStorage.setItem('glow_user', JSON.stringify(profile));
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setOrders([]);
    clearCart();
    setFavorites([]);
    localStorage.removeItem('glow_user');
    localStorage.removeItem('glow_cart');
    localStorage.removeItem('glow_favorites');
    setActivePage('home');
  };

  const applyDiscount = (code: string): boolean => {
    const cleanedCode = code.toUpperCase().trim();
    if (cleanedCode === 'GLOW20') {
      setDiscountApplied({ code: 'GLOW20', percent: 20 });
      return true;
    }
    if (cleanedCode === 'ROUTINE15') {
      setDiscountApplied({ code: 'ROUTINE15', percent: 15 });
      return true;
    }
    return false;
  };

  const placeOrder = (
    shippingInfo: { addressLine: string; city: string; state: string; zip: string; country: string },
    paymentMethod: 'card' | 'paypal',
    discountCode?: string
  ): Order | null => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discountAmount = discountApplied ? subtotal * (discountApplied.percent / 100) : 0;
    
    // Redeem Glow points deduction calculation
    const pointsDollarSaving = pointsRedeemed / (siteSettings.pointsNeededForOneDollar || 10);
    
    const shipping = subtotal - discountAmount - pointsDollarSaving >= 100 ? 0 : 15;
    const tax = Math.max(0, subtotal - discountAmount - pointsDollarSaving) * 0.08;
    const total = Math.max(0, subtotal - discountAmount - pointsDollarSaving + shipping + tax);

    const email = currentUser?.email || 'guest@glowskincare.com';
    const name = currentUser?.fullName || 'Guest Client';

    // Earn 1 point for every $1 spent after discounts
    const earnedPoints = Math.round(Math.max(0, subtotal - discountAmount - pointsDollarSaving));

    // Random tracking digits
    const trackingDigits = Math.floor(1000000000 + Math.random() * 9000000000);
    const orderId = `GS-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      items: [...cart],
      subtotal,
      shipping,
      tax,
      total,
      discountCode: discountApplied?.code || discountCode,
      name,
      email,
      shippingAddress: shippingInfo,
      paymentMethod,
      paymentStatus: 'Paid',
      orderDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      status: 'Processing',
      trackingNumber: `GLOW-${trackingDigits}`,
      trackingCarrier: 'DHL Luxury Express',
      earnedPoints,
      pointsSpent: pointsRedeemed,
      pointsDiscount: pointsDollarSaving
    };

    // Subscriptions Generation
    const recurringItems = cart.filter(item => item.purchaseType === 'subscription');
    if (recurringItems.length > 0) {
      const newSubscriptions: Subscription[] = recurringItems.map(item => {
        const nextDate = new Date();
        if (item.subscriptionFrequency === 'Quarterly') {
          nextDate.setMonth(nextDate.getMonth() + 3);
        } else {
          nextDate.setMonth(nextDate.getMonth() + 1);
        }
        return {
          id: `SUB-${Math.floor(10000 + Math.random() * 90000)}`,
          userEmail: email,
          product: item.product,
          quantity: item.quantity,
          frequency: item.subscriptionFrequency || 'Monthly',
          status: 'Active',
          nextBillingDate: nextDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          price: item.product.price * 0.85 // 15% discount for subscribing!
        };
      });

      setSubscriptions(prev => {
        const updated = [...newSubscriptions, ...prev];
        localStorage.setItem('glow_subscriptions', JSON.stringify(updated));
        return updated;
      });
    }

    // Adjust user glow points balance
    if (currentUser) {
      const currentPoints = currentUser.glowPoints || 0;
      const updatedUser = {
        ...currentUser,
        glowPoints: Math.max(0, currentPoints - pointsRedeemed + earnedPoints)
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('glow_user', JSON.stringify(updatedUser));
    }

    setAllOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('glow_orders', JSON.stringify(updated));
      if (isSupabaseConfigured) {
        upsertSupabaseOrder(newOrder);
      }
      return updated;
    });

    clearCart();
    setPointsRedeemed(0); // Reset redemption points
    return newOrder;
  };

  // Subscriptions management
  const updateSubscriptionStatus = (id: string, status: 'Active' | 'Paused' | 'Cancelled') => {
    setSubscriptions(prev => {
      const updated = prev.map(sub => sub.id === id ? { ...sub, status } : sub);
      localStorage.setItem('glow_subscriptions', JSON.stringify(updated));
      return updated;
    });
  };

  // Reviews cms and Glow Diary
  const addReview = (review: Omit<ProductReview, 'id' | 'date' | 'status'> & { imageUrl?: string; rating: number; title: string; comment: string }) => {
    const newReview: ProductReview = {
      ...review,
      id: `rev-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      status: 'Pending' // Mandatory review moderation before display!
    };
    setReviews(prev => {
      const updated = [newReview, ...prev];
      localStorage.setItem('glow_reviews', JSON.stringify(updated));
      if (isSupabaseConfigured) {
        upsertSupabaseReview(newReview);
      }
      return updated;
    });
  };

  const updateReviewStatus = (reviewId: string, status: 'Approved' | 'Pending' | 'Rejected') => {
    setReviews(prev => {
      const updated = prev.map(rev => {
        if (rev.id === reviewId) {
          const updatedRev = { ...rev, status };
          if (isSupabaseConfigured) {
            upsertSupabaseReview(updatedRev);
          }
          return updatedRev;
        }
        return rev;
      });
      localStorage.setItem('glow_reviews', JSON.stringify(updated));
      return updated;
    });
  };

  // Automated Abandoned Cart Action trigger (Localhost Simulation mode)
  const triggerDevAbandonedCart = () => {
    if (cart.length === 0) return;
    setAbandonedCartDispatched(true);
    setDispatchedCartContent([...cart]);
    setSimTimePassed(true);
  };

  // Order Management admin handlers
  const updateOrderStatus = (
    orderId: string,
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Refunded',
    trackingNumber?: string,
    trackingCarrier?: string
  ) => {
    setAllOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id === orderId) {
          const updatedOrder = {
            ...o,
            status,
            trackingNumber: trackingNumber || o.trackingNumber,
            trackingCarrier: trackingCarrier || o.trackingCarrier,
          };
          if (isSupabaseConfigured) {
            upsertSupabaseOrder(updatedOrder);
          }
          return updatedOrder;
        }
        return o;
      });
      localStorage.setItem('glow_orders', JSON.stringify(updated));
      return updated;
    });
  };

  const processRefund = (orderId: string) => {
    setAllOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id === orderId) {
          const updatedOrder = {
            ...o,
            paymentStatus: 'Refunded' as const,
            status: 'Refunded' as const,
          };
          if (isSupabaseConfigured) {
            upsertSupabaseOrder(updatedOrder);
          }
          return updatedOrder;
        }
        return o;
      });
      localStorage.setItem('glow_orders', JSON.stringify(updated));
      return updated;
    });
  };

  // Inventory Management admin handlers
  const addProduct = (p: Product) => {
    setProducts((prev) => {
      const updated = [p, ...prev];
      localStorage.setItem('glow_products', JSON.stringify(updated));
      if (isSupabaseConfigured) {
        upsertSupabaseProduct(p);
      }
      return updated;
    });
  };

  const updateProduct = (p: Product) => {
    setProducts((prev) => {
      const updated = prev.map((item) => (item.id === p.id ? p : item));
      localStorage.setItem('glow_products', JSON.stringify(updated));
      if (isSupabaseConfigured) {
        upsertSupabaseProduct(p);
      }
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      localStorage.setItem('glow_products', JSON.stringify(updated));
      if (isSupabaseConfigured) {
        deleteSupabaseProduct(productId);
      }
      return updated;
    });
  };

  // Blog CMS handlers
  const addArticle = (art: Article) => {
    setArticles((prev) => {
      const updated = [art, ...prev];
      localStorage.setItem('glow_articles', JSON.stringify(updated));
      if (isSupabaseConfigured) {
        upsertSupabaseArticle(art);
      }
      return updated;
    });
  };

  const updateArticle = (art: Article) => {
    setArticles((prev) => {
      const updated = prev.map((item) => (item.id === art.id ? art : item));
      localStorage.setItem('glow_articles', JSON.stringify(updated));
      if (isSupabaseConfigured) {
        upsertSupabaseArticle(art);
      }
      return updated;
    });
  };

  const deleteArticle = (articleId: string) => {
    setArticles((prev) => {
      const updated = prev.filter((item) => item.id !== articleId);
      localStorage.setItem('glow_articles', JSON.stringify(updated));
      if (isSupabaseConfigured) {
        deleteSupabaseArticle(articleId);
      }
      return updated;
    });
  };


  // Hero CMS handler
  const updateHeroBannerSettings = (settings: { title: string; subtitle: string; image: string }) => {
    setHeroBannerSettings(settings);
    localStorage.setItem('glow_hero_banner', JSON.stringify(settings));
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        favorites,
        toggleFavorite,
        currentUser,
        loginUser,
        logoutUser,
        orders,
        allOrders,
        placeOrder,
        updateOrderStatus,
        processRefund,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        discountApplied,
        applyDiscount,

        // Inventory
        products,
        addProduct,
        updateProduct,
        deleteProduct,

        // Blog
        articles,
        addArticle,
        updateArticle,
        deleteArticle,

        // Hero CMS
        heroBannerSettings,
        updateHeroBannerSettings,

        // Global Site Settings / Media CMS
        siteSettings,
        updateSiteSettings,

        // Glow Points
        pointsRedeemed,
        setPointsRedeemed,

        // Subscriptions Engine
        subscriptions,
        updateSubscriptionStatus,

        // Review & Social Proof Moderation
        reviews,
        addReview,
        updateReviewStatus,

        // Simulated Abandoned Cart Events
        abandonedCartDispatched,
        setAbandonedCartDispatched,
        dispatchedCartContent,
        simTimePassed,
        setSimTimePassed,
        triggerDevAbandonedCart,

        // Theme Support
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
