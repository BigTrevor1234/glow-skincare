export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  description: string;
  howToUse: string;
  ingredients: string[];
  primaryImage: string;
  secondaryImage: string;
  skinTypes: ('Dry' | 'Oily' | 'Combination' | 'Sensitive' | 'All')[];
  concerns: ('Hydration' | 'Acne' | 'Aging' | 'Dullness' | 'Sensitivities' | 'All')[];
  category: 'Cleanser' | 'Serum' | 'Toner' | 'Moisturizer' | 'Mask' | 'Supplement';
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  size: string; // e.g., '50 ML' or '60 CAPSULES'
}

export interface CartItem {
  product: Product;
  quantity: number;
  purchaseType?: 'one-time' | 'subscription';
  subscriptionFrequency?: 'Monthly' | 'Quarterly';
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  title: string;
  comment: string;
  imageUrl?: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  skinType?: string;
  concern?: string;
}

export interface Subscription {
  id: string;
  userEmail: string;
  product: Product;
  quantity: number;
  frequency: 'Monthly' | 'Quarterly';
  status: 'Active' | 'Paused' | 'Cancelled';
  nextBillingDate: string;
  price: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discountCode?: string;
  name: string;
  email: string;
  shippingAddress: {
    addressLine: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: 'card' | 'paypal';
  paymentStatus: 'Paid' | 'Processing' | 'Refunded';
  orderDate: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Refunded';
  trackingNumber: string;
  trackingCarrier: string;
  earnedPoints?: number;
  pointsSpent?: number;
  pointsDiscount?: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    description: string;
    skinTypeScore?: 'Dry' | 'Oily' | 'Combination' | 'Sensitive';
    concernScore?: 'Hydration' | 'Acne' | 'Aging' | 'Dullness' | 'Sensitivities';
  }[];
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: 'Skincare Daily' | 'Inner Wellness' | 'Sourcing Story' | 'Self-Care Ritual';
  readingTime: string;
  date: string;
  summary: string;
  contentParagraphs: string[];
  coverImage: string;
  author: string;
}

export interface UserProfile {
  email: string;
  fullName: string;
  favorites: string[]; // Product IDs
  glowPoints?: number;
}

export interface SiteSettings {
  logoTitle: string;
  logoSubtitle: string;
  brandSlogan: string;
  announcementText: string;
  headquartersLocation: string;
  supportPhone: string;
  supportHours: string;
  aboutStoryTitle: string;
  aboutStorySubtitle: string;
  aboutStoryPara1: string;
  aboutStoryPara2: string;
  aboutStoryPara3: string;
  pointsNeededForOneDollar?: number; // Configurable Point-to-dollar conversion rate (default: 10 points = $1)
}

