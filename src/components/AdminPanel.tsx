import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, Article } from '../types';
import { 
  isSupabaseConfigured, 
  SUPABASE_SQL_TRANSCRIPT, 
  upsertSupabaseProduct, 
  upsertSupabaseArticle, 
  upsertSupabaseReview,
  upsertSupabaseOrder
} from '../lib/supabase';

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BookOpen,
  Image as ImageIcon,
  Users,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  RefreshCw,
  ChevronRight,
  FileText,
  TrendingUp,
  DollarSign,
  Tag,
  Calendar,
  Eye,
  AlertCircle,
  Lock,
  ShieldCheck,
  Clock,
  Sliders,
  LogOut,
  Key,
  ShieldAlert,
  Mail,
  Send,
  Globe,
  Zap,
  LifeBuoy,
  Terminal,
  ArrowRightLeft,
  Sun,
  Moon
} from 'lucide-react';

interface EmailDispatchLog {
  id: string;
  timestamp: string;
  recipient: string;
  subject: string;
  body: string;
  status: 'SENT' | 'DELIVERED';
  actionType: string;
  smtpHeader: string;
}

type AdminTab = 'overview' | 'inventory' | 'orders' | 'blog' | 'banners' | 'customers' | 'settings' | 'security' | 'integrations';

export default function AdminPanel() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    allOrders,
    updateOrderStatus,
    processRefund,
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    heroBannerSettings,
    updateHeroBannerSettings,
    setActivePage,
    siteSettings,
    updateSiteSettings,
    theme,
    toggleTheme,
    reviews
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Supabase live seeding states
  const [isSyncingToSupabase, setIsSyncingToSupabase] = useState(false);
  const [showSqlCheatsheet, setShowSqlCheatsheet] = useState(false);

  const handleBootstrapSupabase = async () => {
    if (!isSupabaseConfigured) {
      triggerNotice('Check Configuration: Supabase credentials are not configured in your env file.');
      return;
    }
    
    setIsSyncingToSupabase(true);
    triggerNotice('Commencing database seeding... Syncing current catalogs to Supabase.');
    
    try {
      let productCount = 0;
      for (const p of products) {
        const ok = await upsertSupabaseProduct(p);
        if (ok) productCount++;
      }
      
      let articleCount = 0;
      for (const art of articles) {
        const ok = await upsertSupabaseArticle(art);
        if (ok) articleCount++;
      }

      let reviewCount = 0;
      for (const rev of reviews) {
        const ok = await upsertSupabaseReview(rev);
        if (ok) reviewCount++;
      }
      
      triggerNotice(`Cloud Sync Complete! Seeded ${productCount} products, ${articleCount} blog posts, and ${reviewCount} reviews to your active Supabase.`);
    } catch (err) {
      triggerNotice('Cloud Sync interrupted. Review browser console for more details.');
      console.error(err);
    } finally {
      setIsSyncingToSupabase(false);
    }
  };

  // Helper notice handler
  const triggerNotice = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // ----------------------------------------------------
  // SECURE AUTHENTICATION STATE & SESSION TIMER HQ
  // ----------------------------------------------------
  const [timeoutPreset, setTimeoutPreset] = useState<string>(() => {
    return localStorage.getItem('glow_admin_timeout_preset') || '15';
  });
  const [idlePreset, setIdlePreset] = useState<string>(() => {
    return localStorage.getItem('glow_admin_idle_preset') || '5';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = sessionStorage.getItem('glow_admin_session');
      if (stored) {
        const { email, expiresAt } = JSON.parse(stored);
        if (email && expiresAt > Date.now()) {
          return true;
        }
      }
    } catch (e) {}
    return false;
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    try {
      const stored = sessionStorage.getItem('glow_admin_session');
      if (stored) {
        return JSON.parse(stored).email || '';
      }
    } catch (e) {}
    return '';
  });

  const [timeLeft, setTimeLeft] = useState<number>(Number(timeoutPreset) * 60);
  const [logoutReason, setLogoutReason] = useState<string | null>(null);

  // SMTP Simulation variables for high-security auto-email notification Option A
  const [emailDispatches, setEmailDispatches] = useState<EmailDispatchLog[]>(() => {
    try {
      const saved = localStorage.getItem('glow_admin_email_dispatches');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [smtpBanner, setSmtpBanner] = useState<{ show: boolean; subject: string; recipient: string }>({
    show: false,
    subject: '',
    recipient: 'sheriff09064212548@gmail.com'
  });

  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // ----------------------------------------------------
  // INTEGRATIONS & TUNNELS CONFIGURATION STATES
  // ----------------------------------------------------
  const [tunnelUrl, setTunnelUrl] = useState<string>(() => {
    return localStorage.getItem('glow_tunnel_url') || 'https://glowskincare-test.ngrok.io';
  });

  const [zapierWebhookUrl, setZapierWebhookUrl] = useState<string>(() => {
    return localStorage.getItem('glow_zapier_webhook_url') || 'https://hooks.zapier.com/hooks/catch/1929421/b73fza2/';
  });

  const [zendeskDomain, setZendeskDomain] = useState<string>(() => {
    return localStorage.getItem('glow_zendesk_domain') || 'glowskincare.zendesk.com';
  });

  const [zendeskAgentEmail, setZendeskAgentEmail] = useState<string>(() => {
    return localStorage.getItem('glow_zendesk_agent_email') || 'support@glowskincare.zendesk.com';
  });

  const [webhookLogs, setWebhookLogs] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('glow_webhook_delivery_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    
    // Default mock logs to populate the deliveries view on first load
    return [
      {
        id: 'wh-log-2309',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        targetService: 'Zapier Webhook',
        event: 'order.placed',
        url: 'https://hooks.zapier.com/hooks/catch/1929421/b73fza2/',
        status: 'SUCCESS',
        code: 200,
        payload: {
          event: "order.placed",
          timestamp: "2026-05-23T00:15:32.404Z",
          orderId: "GLOW-8492-CH",
          total: 185.00,
          customer: {
            name: "Emily Henderson",
            email: "emily.henderson@gmail.com"
          },
          items: [
            { id: "elixir-radiance", name: "Alpine Cellular Elixir", quantity: 1, price: 125.00 },
            { id: "cleansing-balm", name: "Botanical Purifying Balm", quantity: 1, price: 60.00 }
          ]
        }
      },
      {
        id: 'wh-log-2308',
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        targetService: 'Zendesk Ticket Bridge',
        event: 'support.ticket_created',
        url: 'https://glowskincare.zendesk.com/api/v2/tickets.json',
        status: 'SUCCESS',
        code: 201,
        payload: {
          ticket: {
            subject: "Custom Formula Reoccurrence Query",
            comment: { body: "Could I adjust my skincare delivery frequency from monthly to bi-monthly for the Retinol Active treatment? Thanks!" },
            priority: "normal",
            requester: { name: "Sarah Miller", email: "sarah.miller@outlook.com" }
          }
        }
      }
    ];
  });

  const [selectedWebhookLogId, setSelectedWebhookLogId] = useState<string | null>(null);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);

  const dispatchEmailNotification = (
    actionType: string,
    subject: string,
    description: string,
    details?: Record<string, any>
  ) => {
    const recipient = 'sheriff09064212548@gmail.com';
    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const uniqueId = `srv-smtp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const smtpHeader = [
      `Delivered-To: ${recipient}`,
      `Received: by mx.glowskincare.swiss with SMTP id s15-v402; ${timestampStr}`,
      `X-Google-Smtp-Source: AGLOWX109485${Date.now().toString().substring(5)}`,
      `MIME-Version: 1.0`,
      `From: GLOW SECURE AUDIT <security-monitoring@glowskincare.swiss>`,
      `To: Secure Administrator <${recipient}>`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      `X-Priority: 1 (Highest)`,
      `Return-Path: <security-monitoring@bounce.glowskincare.swiss>`
    ].join('\n');

    let body = `GLOW SKU LABS - HIGH SECURITY ALERT\n`;
    body += `==================================================\n`;
    body += `TRANSMISSION TYPE:   ${actionType}\n`;
    body += `TIMESTAMP TRIGGERED: ${timestampStr}\n`;
    body += `MONITRON RECIPIENT:  ${recipient}\n`;
    body += `\nSUMMARY LOG:\n${description}\n`;
    
    if (details && Object.keys(details).length > 0) {
      body += `\nEVENT ATTRIBUTES & CHANGES:\n`;
      Object.entries(details).forEach(([key, val]) => {
        body += `- ${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}\n`;
      });
    }
    
    body += `\n--------------------------------------------------\n`;
    body += `This is an encrypted administrative safety broadcast dispatched by decision sequence Option A. Actions, logins, and parameters edits are tracked under active compliance monitoring.`;

    const newLog: EmailDispatchLog = {
      id: uniqueId,
      timestamp: timestampStr,
      recipient,
      subject,
      body,
      status: 'DELIVERED',
      actionType,
      smtpHeader
    };

    setEmailDispatches(prev => {
      const updated = [newLog, ...prev].slice(0, 50);
      localStorage.setItem('glow_admin_email_dispatches', JSON.stringify(updated));
      return updated;
    });

    setSmtpBanner({
      show: true,
      subject,
      recipient
    });

    setTimeout(() => {
      setSmtpBanner(prev => ({ ...prev, show: false }));
    }, 4500);
  };

  // Login form elements
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Settings tab form values initialized from siteSettings
  const [logoTitleForm, setLogoTitleForm] = useState(siteSettings?.logoTitle || 'GLOW');
  const [logoSubtitleForm, setLogoSubtitleForm] = useState(siteSettings?.logoSubtitle || 'skincare');
  const [brandSloganForm, setBrandSloganForm] = useState(siteSettings?.brandSlogan || '');
  const [announcementTextForm, setAnnouncementTextForm] = useState(siteSettings?.announcementText || '');
  const [hqLocationForm, setHqLocationForm] = useState(siteSettings?.headquartersLocation || '');
  const [supportPhoneForm, setSupportPhoneForm] = useState(siteSettings?.supportPhone || '');
  const [supportHoursForm, setSupportHoursForm] = useState(siteSettings?.supportHours || '');
  const [aboutStoryTitleForm, setAboutStoryTitleForm] = useState(siteSettings?.aboutStoryTitle || '');
  const [aboutStorySubtitleForm, setAboutStorySubtitleForm] = useState(siteSettings?.aboutStorySubtitle || '');
  const [aboutStoryPara1Form, setAboutStoryPara1Form] = useState(siteSettings?.aboutStoryPara1 || '');
  const [aboutStoryPara2Form, setAboutStoryPara2Form] = useState(siteSettings?.aboutStoryPara2 || '');
  const [aboutStoryPara3Form, setAboutStoryPara3Form] = useState(siteSettings?.aboutStoryPara3 || '');

  // Synchronize settings form state if global settings are updated
  useEffect(() => {
    if (siteSettings) {
      setLogoTitleForm(siteSettings.logoTitle);
      setLogoSubtitleForm(siteSettings.logoSubtitle);
      setBrandSloganForm(siteSettings.brandSlogan);
      setAnnouncementTextForm(siteSettings.announcementText);
      setHqLocationForm(siteSettings.headquartersLocation);
      setSupportPhoneForm(siteSettings.supportPhone);
      setSupportHoursForm(siteSettings.supportHours);
      setAboutStoryTitleForm(siteSettings.aboutStoryTitle);
      setAboutStorySubtitleForm(siteSettings.aboutStorySubtitle);
      setAboutStoryPara1Form(siteSettings.aboutStoryPara1);
      setAboutStoryPara2Form(siteSettings.aboutStoryPara2);
      setAboutStoryPara3Form(siteSettings.aboutStoryPara3);
    }
  }, [siteSettings]);

  const lastActivityRef = useRef<number>(Date.now());

  // ----------------------------------------------------
  // INTEGRATIONS webhook triggers simulation engine
  // ----------------------------------------------------
  const triggerWebhookSimulation = (eventKey: 'order.placed' | 'client.registered' | 'support.ticket_created' | 'formula.active_sync') => {
    setIsSimulatingWebhook(true);
    setTimeout(() => {
      const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      const logId = `wh-log-${Math.floor(1000 + Math.random() * 9000)}`;
      
      let targetService = 'Zapier Webhook';
      let url = zapierWebhookUrl;
      let payload: any = {};
      let code = 200;

      if (eventKey === 'order.placed') {
        payload = {
          event: "order.placed",
          timestamp: new Date().toISOString(),
          orderId: `GLOW-${Math.floor(1000 + Math.random() * 9000)}-CH`,
          total: Number((50 + Math.random() * 200).toFixed(2)),
          customer: {
            name: "Alexander Mercer",
            email: "alex.mercer@innovate.ch"
          },
          items: [
            { id: "serum-vit-c", name: "Luminous Vitamin C Serum", quantity: 1, price: 95.00 },
            { id: "moisture-cream", name: "Phyto-Active Moisturizer", quantity: 2, price: 75.00 }
          ],
          sourceChannel: "Local Tunnel Route via " + tunnelUrl
        };
      } else if (eventKey === 'client.registered') {
        payload = {
          event: "client.registered",
          timestamp: new Date().toISOString(),
          customerEmail: "elena.rostova@geneva-skincare.ch",
          fullName: "Elena Rostova",
          skinTypePicked: "Dry / Sensitive",
          routineGoal: "Deep cellular hydration & barrier repair",
          registeredViaTunnel: tunnelUrl
        };
      } else if (eventKey === 'support.ticket_created') {
        targetService = 'Zendesk Ticket Bridge';
        url = `https://${zendeskDomain}/api/v2/tickets.json`;
        payload = {
          ticket: {
            id: Math.floor(100000 + Math.random() * 900000),
            subject: "Local hosting environment tunnel request",
            comment: {
              body: `Hello support, I am validating a webhook from my localhost environment running behind ${tunnelUrl}. Can you verify receipt?`
            },
            priority: "high",
            requester: {
              name: "Localhost Developer Sandbox",
              email: zendeskAgentEmail
            },
            status: "new",
            custom_fields: [
              { id: 49204910, value: tunnelUrl }
            ]
          }
        };
        code = 201;
      } else if (eventKey === 'formula.active_sync') {
        payload = {
          event: "formula.active_sync",
          timestamp: new Date().toISOString(),
          activeSubscriberCount: 142,
          formulasInRotation: ["Alpine Cellular Elixir", "Botanical Purifying Balm", "Retinol Active Treatment"],
          tunnelEndpoint: tunnelUrl,
          securitySync: "Sequence Option A Verified"
        };
      }

      const newLog = {
        id: logId,
        timestamp: timestampStr,
        targetService,
        event: eventKey,
        url,
        status: 'SUCCESS',
        code,
        payload
      };

      setWebhookLogs(prev => {
        const updated = [newLog, ...prev];
        localStorage.setItem('glow_webhook_delivery_logs', JSON.stringify(updated));
        return updated;
      });

      setIsSimulatingWebhook(false);
      triggerNotice(`Fired live integration webhook for: ${eventKey}`);
      
      // Dispatch safety email to keep ledger fully connected with Option A
      dispatchEmailNotification(
        'INTEGRATION_FIRE',
        `[INTEGRATION] Event "${eventKey}" successfully delivered`,
        `Glow simulated integration event forwarded successfully from endpoint ${tunnelUrl}.\nService targeted: ${targetService}.\nFired webhook endpoint: ${url}`,
        {
          webhookId: logId,
          targetService,
          eventTrigger: eventKey,
          webhookTarget: url,
          simulatedTunnelUrl: tunnelUrl,
          responseStatusCode: code
        }
      );
    }, 1200);
  };

  // Log in user session
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLogoutReason(null);

    const email = loginEmail.trim().toLowerCase();
    const authorizedEmails = [
      'sheriff09064212548@gmail.com',
      'admin@glowskincare.com',
      'glow@hq.swiss'
    ];

    if (!authorizedEmails.includes(email)) {
      setLoginError('Security Denied: E-mail is not listed on the high-clearance admin register database.');
      return;
    }

    // Require specific passcode
    if (loginPasscode !== 'GLOW-SECURE-2026') {
      setLoginError('Invalid Credential: Check default secret clearance code (GLOW-SECURE-2026).');
      return;
    }

    // Authenticated successfully - issue token
    const seconds = Number(timeoutPreset) * 60;
    const expiresAt = Date.now() + (seconds * 1000);
    const sessionTokenResult = { email, expiresAt };

    sessionStorage.setItem('glow_admin_session', JSON.stringify(sessionTokenResult));
    setIsAuthenticated(true);
    setAdminEmail(email);
    setTimeLeft(seconds);
    lastActivityRef.current = Date.now();
    triggerNotice(`Authenticated Session started: Welcome, Administrator ${email}.`);
    dispatchEmailNotification(
      'ACCESS_GRANTED',
      '[SECURITY ALERT] Administrative Gateway Access Granted',
      `Successful login performed under credential ${email}. Cryptographic sequence authorization accepted.`,
      {
        authenticatedUser: email,
        sessionExpiryLimit: `${timeoutPreset} Mins`,
        idleInactivityLimit: `${idlePreset} Mins`,
        userAgent: navigator.userAgent
      }
    );
  };

  // Perform clean session termination
  const handleAdminLogout = (reason?: string) => {
    const sessionUser = adminEmail || 'sheriff09064212548@gmail.com';
    sessionStorage.removeItem('glow_admin_session');
    setIsAuthenticated(false);
    setAdminEmail('');
    setLoginEmail('');
    setLoginPasscode('');
    if (typeof reason === 'string') {
      setLogoutReason(reason);
      dispatchEmailNotification(
        'SECURITY_TIMEOUT',
        '[SECURITY ALERT] Administrative Session Expired',
        `The high-clearance session for ${sessionUser} was automatically terminated for security. Reason: ${reason}`,
        {
          operator: sessionUser,
          autoInactivityPurge: true,
          details: reason
        }
      );
    } else {
      setLogoutReason(null);
      triggerNotice('Logged out securely.');
      dispatchEmailNotification(
        'SECURE_LOGOUT',
        '[SECURITY ALERT] Administrative Manual Session Terminated',
        `Administrator ${sessionUser} manually terminated their secure authorization token from the terminal.`,
        {
          operator: sessionUser,
          voluntaryLogout: true
        }
      );
    }
  };

  // Session Ticking interval and Inactivity listener hooks
  useEffect(() => {
    if (!isAuthenticated) return;

    // reset inactivity timestamp
    const resetInactivity = () => {
      lastActivityRef.current = Date.now();
    };

    const monitoredEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    monitoredEvents.forEach(evt => {
      window.addEventListener(evt, resetInactivity, { passive: true });
    });

    // timer countdown runner
    const timerInterval = setInterval(() => {
      // 1. Check countdown expiration
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAdminLogout('Your session duration has expired due to high security precautions (countdown limit reached).');
          return 0;
        }
        return prev - 1;
      });

      // 2. Check idle inactivity
      const idleLimitMs = Number(idlePreset) * 60 * 1000;
      if (Date.now() - lastActivityRef.current > idleLimitMs) {
        handleAdminLogout(`You have been automatically logged out for security after ${idlePreset} minutes of inactive inactivity.`);
      }
    }, 1000);

    return () => {
      monitoredEvents.forEach(evt => {
        window.removeEventListener(evt, resetInactivity);
      });
      clearInterval(timerInterval);
    };
  }, [isAuthenticated, idlePreset]);

  // Format countdown text e.g. 14:59
  const formatTimeLeft = (secTotal: number) => {
    const mins = Math.floor(secTotal / 60);
    const secs = secTotal % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle saving customizable site settings values
  const handleSiteSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      logoTitle: logoTitleForm,
      logoSubtitle: logoSubtitleForm,
      brandSlogan: brandSloganForm,
      announcementText: announcementTextForm,
      headquartersLocation: hqLocationForm,
      supportPhone: supportPhoneForm,
      supportHours: supportHoursForm,
      aboutStoryTitle: aboutStoryTitleForm,
      aboutStorySubtitle: aboutStorySubtitleForm,
      aboutStoryPara1: aboutStoryPara1Form,
      aboutStoryPara2: aboutStoryPara2Form,
      aboutStoryPara3: aboutStoryPara3Form
    });
    triggerNotice('Dynamic site media configuration successfully broadcasted!');
    dispatchEmailNotification(
      'SETTINGS_UPDATE',
      '[DATABASE CHANGE] Brand Parameters & Site Media Config Updated',
      `Dynamic site layout media and brand settings were updated by ${adminEmail || 'sheriff09064212548@gmail.com'}.`,
      {
        operator: adminEmail || 'sheriff09064212548@gmail.com',
        newLogoTitle: logoTitleForm,
        newLogoSubtitle: logoSubtitleForm,
        announcementText: announcementTextForm,
        officeLocation: hqLocationForm
      }
    );
  };

  // ----------------------------------------------------
  // OVERVIEW DATA & ANALYTICS COMPUTATIONS
  // ----------------------------------------------------
  const paidOrders = allOrders.filter(o => o.paymentStatus === 'Paid' && o.status !== 'Refunded');
  
  const grossRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = allOrders.length;
  const uniqueCustomersCount = Array.from(new Set(allOrders.map(o => o.email))).length;
  const avgOrderValue = paidOrders.length > 0 ? grossRevenue / paidOrders.length : 0;
  
  // Categorized performance metrics
  const categorySales: { [cat: string]: number } = {};
  paidOrders.forEach(o => {
    o.items.forEach(item => {
      const cat = item.product.category;
      categorySales[cat] = (categorySales[cat] || 0) + (item.product.price * item.quantity);
    });
  });

  // Recent 4 sales
  const recentOrders = [...allOrders].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 4);

  // ----------------------------------------------------
  // CUSTOMER DIRECTORY DATABASE PARSER
  // ----------------------------------------------------
  const customersMap: { [email: string]: { name: string; email: string; ordersCount: number; totalSpent: number; transactions: { id: string; date: string; amount: number; status: string }[] } } = {};
  allOrders.forEach(order => {
    const email = order.email;
    if (!customersMap[email]) {
      customersMap[email] = {
        name: order.name,
        email: order.email,
        ordersCount: 0,
        totalSpent: 0,
        transactions: []
      };
    }
    customersMap[email].ordersCount += 1;
    if (order.status !== 'Refunded') {
      customersMap[email].totalSpent += order.total;
    }
    customersMap[email].transactions.push({
      id: order.id,
      date: order.orderDate,
      amount: order.total,
      status: order.status
    });
  });
  const systemCustomers = Object.values(customersMap);

  // Expanded customer state
  const [expandedCustomerEmail, setExpandedCustomerEmail] = useState<string | null>(null);

  // ----------------------------------------------------
  // INVENTORY EDITOR MANAGEMENT STATES
  // ----------------------------------------------------
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    id: '',
    name: '',
    subtitle: '',
    price: 0,
    description: '',
    howToUse: '',
    ingredients: [],
    primaryImage: 'https://images.unsplash.com/photo-1556228448-524c96de71b6?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop',
    skinTypes: ['All'],
    concerns: ['Hydration'],
    category: 'Moisturizer',
    rating: 4.8,
    reviewsCount: 1,
    inStock: true,
    size: '50 ML'
  });
  const [productIngredientsText, setProductIngredientsText] = useState('');
  const [productSkinTypes, setProductSkinTypes] = useState<string[]>(['All']);
  const [productConcerns, setProductConcerns] = useState<string[]>(['Hydration']);

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredientsArray = productIngredientsText
      ? productIngredientsText.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    
    const finalProduct: Product = {
      id: (productForm.id || 'product-' + Date.now()).toLowerCase().replace(/\s+/g, '-'),
      name: productForm.name || 'Untitled Elixir',
      subtitle: productForm.subtitle || 'Formulated by Glow Laboratories',
      price: Number(productForm.price) || 20,
      description: productForm.description || '',
      howToUse: productForm.howToUse || '',
      ingredients: ingredientsArray,
      primaryImage: productForm.primaryImage || 'https://images.unsplash.com/photo-1556228448-524c96de71b6?q=80&w=800&auto=format&fit=crop',
      secondaryImage: productForm.secondaryImage || 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop',
      skinTypes: productSkinTypes as any[],
      concerns: productConcerns as any[],
      category: productForm.category as any || 'Moisturizer',
      rating: productForm.rating || 4.8,
      reviewsCount: productForm.reviewsCount || 10,
      inStock: productForm.inStock !== undefined ? productForm.inStock : true,
      size: productForm.size || '50 ML'
    };

    const exists = products.some(p => p.id === finalProduct.id);
    if (exists) {
      updateProduct(finalProduct);
      triggerNotice('Product inventory updated successfully.');
      dispatchEmailNotification(
        'INVENTORY_UPDATE',
        `[DATABASE CHANGE] Catalog Item Updated: "${finalProduct.name}"`,
        `Product inventory details for "${finalProduct.name}" were updated by ${adminEmail || 'sheriff09064212548@gmail.com'}.`,
        {
          operator: adminEmail || 'sheriff09064212548@gmail.com',
          productId: finalProduct.id,
          productName: finalProduct.name,
          price: `$${finalProduct.price}`,
          inStock: finalProduct.inStock ? 'Yes' : 'No'
        }
      );
    } else {
      addProduct(finalProduct);
      triggerNotice('New product added to inventory.');
      dispatchEmailNotification(
        'INVENTORY_ADD',
        `[DATABASE CHANGE] New Catalog Item Added: "${finalProduct.name}"`,
        `A new skincare apothecary formulation was published in the digital boutique catalog by ${adminEmail || 'sheriff09064212548@gmail.com'}.`,
        {
          operator: adminEmail || 'sheriff09064212548@gmail.com',
          productId: finalProduct.id,
          productName: finalProduct.name,
          category: finalProduct.category,
          price: `$${finalProduct.price}`
        }
      );
    }
    setIsEditingProduct(false);
    resetProductForm();
  };

  const resetProductForm = () => {
    setProductForm({
      id: '',
      name: '',
      subtitle: '',
      price: 0,
      description: '',
      howToUse: '',
      ingredients: [],
      primaryImage: 'https://images.unsplash.com/photo-1556228448-524c96de71b6?q=80&w=800&auto=format&fit=crop',
      secondaryImage: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=800&auto=format&fit=crop',
      skinTypes: ['All'],
      concerns: ['Hydration'],
      category: 'Moisturizer',
      rating: 4.8,
      reviewsCount: 1,
      inStock: true,
      size: '50 ML'
    });
    setProductIngredientsText('');
    setProductSkinTypes(['All']);
    setProductConcerns(['Hydration']);
  };

  const startEditProduct = (p: Product) => {
    setProductForm(p);
    setProductIngredientsText(p.ingredients.join(', '));
    setProductSkinTypes(p.skinTypes);
    setProductConcerns(p.concerns);
    setIsEditingProduct(true);
  };

  const toggleSkinTypeForm = (type: string) => {
    setProductSkinTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const toggleConcernForm = (concern: string) => {
    setProductConcerns(prev => {
      if (prev.includes(concern)) {
        return prev.filter(c => c !== concern);
      } else {
        return [...prev, concern];
      }
    });
  };

  // ----------------------------------------------------
  // ORDER STAGE HANDLERS
  // ----------------------------------------------------
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNoInput, setTrackingNoInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('DHL Luxury Express');
  const [orderFilter, setOrderFilter] = useState<'All' | 'Processing' | 'Shipped' | 'Delivered' | 'Refunded'>('All');

  const handleUpdateOrder = (orderId: string, status: any) => {
    updateOrderStatus(orderId, status, trackingNoInput || undefined, carrierInput || undefined);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status, trackingNumber: trackingNoInput || prev.trackingNumber, trackingCarrier: carrierInput || prev.trackingCarrier } : null);
    }
    triggerNotice(`Order ${orderId} updated to status: ${status}`);
    dispatchEmailNotification(
      'ORDER_UPDATE',
      `[DATABASE CHANGE] Order #${orderId} Updated to [${status}]`,
      `Order status for secure transaction #${orderId} has been progressed to "${status}" by administrator ${adminEmail || 'sheriff09064212548@gmail.com'}.`,
      {
        operator: adminEmail || 'sheriff09064212548@gmail.com',
        orderId,
        newStatus: status,
        trackingCarrier: carrierInput || 'N/A',
        trackingNumber: trackingNoInput || 'N/A'
      }
    );
    setTrackingNoInput('');
  };

  const handleRefundOrder = (orderId: string) => {
    if (confirm(`Are you sure you want to process a full refund for Order ${orderId}? This will reverse transaction metrics and notify the client.`)) {
      processRefund(orderId);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, paymentStatus: 'Refunded', status: 'Refunded' } : null);
      }
      triggerNotice(`Order ${orderId} fully refunded.`);
      dispatchEmailNotification(
        'ORDER_REFUND',
        `[DATABASE CHANGE] Order #${orderId} FULLY REFUNDED`,
        `Direct financial refund process triggered for order #${orderId} by administrator ${adminEmail || 'sheriff09064212548@gmail.com'}. Funds are re-routed to the buyer's original payment method.`,
        {
          operator: adminEmail || 'sheriff09064212548@gmail.com',
          orderRefunded: orderId,
          refundAmount: selectedOrder ? `$${selectedOrder.total.toFixed(2)}` : 'Unknown',
          refundStatus: 'Completed Reversal'
        }
      );
    }
  };

  // ----------------------------------------------------
  // CMS BLOG EDITOR STATES
  // ----------------------------------------------------
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [articleForm, setArticleForm] = useState<Partial<Article>>({
    id: '',
    title: '',
    subtitle: '',
    category: 'Skincare Daily',
    readingTime: '5 MIN READ',
    date: '',
    summary: '',
    contentParagraphs: [],
    coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
    author: ''
  });
  const [articleContentText, setArticleContentText] = useState('');

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paragraphs = articleContentText
      ? articleContentText.split('\n\n').map(p => p.trim()).filter(Boolean)
      : [];

    const finalArticle: Article = {
      id: (articleForm.id || 'article-' + Date.now()).toLowerCase().replace(/\s+/g, '-'),
      title: articleForm.title || 'Untitled Article',
      subtitle: articleForm.subtitle || 'Mindful Reflections',
      category: articleForm.category as any || 'Skincare Daily',
      readingTime: articleForm.readingTime || '5 MIN READ',
      date: articleForm.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      summary: articleForm.summary || '',
      contentParagraphs: paragraphs,
      coverImage: articleForm.coverImage || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
      author: articleForm.author || 'Glow Skin Editorial Host'
    };

    const exists = articles.some(a => a.id === finalArticle.id);
    if (exists) {
      updateArticle(finalArticle);
      triggerNotice('Chronicle updated successfully.');
      dispatchEmailNotification(
        'CHRONICLE_UPDATE',
        `[DATABASE CHANGE] Blog Chronicle Updated: "${finalArticle.title}"`,
        `Wellness Hub column article topic "${finalArticle.title}" was refreshed by editor administrator ${adminEmail || 'sheriff09064212548@gmail.com'}.`,
        {
          operator: adminEmail || 'sheriff09064212548@gmail.com',
          articleId: finalArticle.id,
          articleTitle: finalArticle.title,
          category: finalArticle.category,
          author: finalArticle.author
        }
      );
    } else {
      addArticle(finalArticle);
      triggerNotice('New Chronicle published in Wellness Hub.');
      dispatchEmailNotification(
        'CHRONICLE_ADD',
        `[DATABASE CHANGE] New Blog Chronicle Published: "${finalArticle.title}"`,
        `A high-value wellness chronic entry titled "${finalArticle.title}" was authorized and published by ${adminEmail || 'sheriff09064212548@gmail.com'}.`,
        {
          operator: adminEmail || 'sheriff09064212548@gmail.com',
          articleId: finalArticle.id,
          articleTitle: finalArticle.title,
          category: finalArticle.category,
          author: finalArticle.author
        }
      );
    }
    setIsEditingArticle(false);
    resetArticleForm();
  };

  const startEditArticle = (art: Article) => {
    setArticleForm(art);
    setArticleContentText(art.contentParagraphs.join('\n\n'));
    setIsEditingArticle(true);
  };

  const resetArticleForm = () => {
    setArticleForm({
      id: '',
      title: '',
      subtitle: '',
      category: 'Skincare Daily',
      readingTime: '5 MIN READ',
      date: '',
      summary: '',
      contentParagraphs: [],
      coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
      author: ''
    });
    setArticleContentText('');
  };

  // ----------------------------------------------------
  // CMS HOME HERO BANNER STATES
  // ----------------------------------------------------
  const [heroTitle, setHeroTitle] = useState(heroBannerSettings.title);
  const [heroSubtitle, setHeroSubtitle] = useState(heroBannerSettings.subtitle);
  const [heroImageUrl, setHeroImageUrl] = useState(heroBannerSettings.image);

  const handleHeroBannerUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroBannerSettings({
      title: heroTitle,
      subtitle: heroSubtitle,
      image: heroImageUrl
    });
    triggerNotice('Homepage hero text and image updated!');
    dispatchEmailNotification(
      'HERO_UPDATE',
      '[DATABASE CHANGE] Homepage Hero Visual Banner Configured',
      `The homepage marketing spotlight (hero banner settings) was updated by ${adminEmail || 'sheriff09064212548@gmail.com'}.`,
      {
        operator: adminEmail || 'sheriff09064212548@gmail.com',
        titleSpotlight: heroTitle,
        subtitleSpotlight: heroSubtitle,
        imageSourceUrl: heroImageUrl
      }
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center min-h-[70vh] justify-center">
        {/* Header story title */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] font-mono tracking-[0.3em] text-luxury-gold uppercase block font-bold leading-none">
            GLOW SKINCARE SECURE GATEWAY
          </span>
          <h1 className="text-3xl font-serif font-normal text-luxury-charcoal">
            HQ System Administration Login
          </h1>
          <div className="w-10 h-0.5 bg-luxury-rose/55 mx-auto mt-2" />
        </div>

        {logoutReason && (
          <div className="w-full max-w-md mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-sm text-xs space-y-1.5 animate-pulse shadow-sm">
            <div className="flex items-center gap-1.5 font-bold tracking-wider font-mono uppercase text-[#92400e] text-amber-800">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              SECURITY TIMEOUT ALERT
            </div>
            <p className="font-sans leading-relaxed text-amber-800 font-light">{logoutReason}</p>
          </div>
        )}

        <div className="w-full max-w-md bg-white border border-[#EADFC9]/50 shadow-md rounded-sm p-6 sm:p-8 space-y-6">
          <div className="flex justify-center mb-2">
            <div className="bg-[#FAF7F2] p-4 rounded-full border border-luxury-cream shadow-xs text-luxury-gold">
              <Lock className="w-8 h-8 animate-[pulse_2s_infinite]" />
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70 font-bold">
                ADMIN ACCESS EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="sheriff09064212548@gmail.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                className="w-full bg-white border border-[#CBD9CE]/65 p-3 text-xs tracking-wide focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70 font-bold">
                SECURITY clearance Passcode
              </label>
              <input
                type="password"
                required
                placeholder="Enter 12-digit security key"
                value={loginPasscode}
                onChange={e => setLoginPasscode(e.target.value)}
                className="w-full bg-white border border-[#CBD9CE]/65 p-3 text-xs tracking-wide focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs font-mono"
              />
            </div>

            {/* Session limit configuration option directly on login panel */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="block text-[8.5px] font-mono tracking-wider uppercase text-luxury-charcoal/40 font-bold">
                  TIMEOUT PRESET
                </label>
                <select
                  value={timeoutPreset}
                  onChange={e => {
                    setTimeoutPreset(e.target.value);
                    localStorage.setItem('glow_admin_timeout_preset', e.target.value);
                  }}
                  className="w-full bg-[#FAF7F2] border border-[#EADFC9]/45 px-2 py-1.5 text-[10.5px] font-mono focus:ring-1 focus:ring-luxury-gold outline-none rounded-xs"
                >
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[8.5px] font-mono tracking-wider uppercase text-luxury-charcoal/40 font-bold">
                  INACTIVITY LIMIT
                </label>
                <select
                  value={idlePreset}
                  onChange={e => {
                    setIdlePreset(e.target.value);
                    localStorage.setItem('glow_admin_idle_preset', e.target.value);
                  }}
                  className="w-full bg-[#FAF7F2] border border-[#EADFC9]/45 px-2 py-1.5 text-[10.5px] font-mono focus:ring-1 focus:ring-luxury-gold outline-none rounded-xs"
                >
                  <option value="2">2 minutes</option>
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                </select>
              </div>
            </div>

            {loginError && (
              <p className="text-[11px] font-mono text-red-600 bg-red-50 p-2.5 border border-red-200 rounded-sm leading-relaxed">
                ● {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-luxury-charcoal text-white hover:bg-luxury-gold py-3.5 tracking-widest text-xs font-mono uppercase rounded-sm duration-200 cursor-pointer flex items-center justify-center gap-2 mt-4 font-bold"
            >
              <ShieldCheck className="w-4 h-4 text-luxury-gold" /> Initiate Security Checks
            </button>
          </form>

          {/* Quick verification instruction guideline box */}
          <div className="bg-[#FAF7F2] p-4 border border-[#EADFC9]/40 rounded-sm space-y-1.5 text-[11px]">
            <span className="font-mono text-[9px] font-bold text-luxury-gold tracking-widest uppercase block flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> SECURITY SYSTEM CREDENTIALS MATRIX
            </span>
            <ul className="space-y-1 text-luxury-charcoal/70 list-disc list-inside leading-relaxed font-light">
              <li>Authorized Email: <code className="font-mono bg-white px-1 py-0.5 rounded border border-gray-100 font-semibold text-luxury-charcoal">sheriff09064212548@gmail.com</code></li>
              <li>Clearance Key: <code className="font-mono bg-white px-1 py-0.5 rounded border border-gray-100 font-semibold text-luxury-charcoal">GLOW-SECURE-2026</code></li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => setActivePage('home')}
          className="text-xs font-mono tracking-widest text-luxury-gold hover:text-luxury-charcoal uppercase border-b border-luxury-gold hover:border-luxury-charcoal mt-8 pb-0.5 cursor-pointer duration-200"
        >
          ← Return to public website
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. Header Banner */}
      <div className="border-b border-[#EADFC9]/60 pb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-luxury-gold font-bold">
              Internal Operations Portal
            </span>
            <span className="subpixel-antialiased bg-emerald-50 text-emerald-800 border border-emerald-200/50 text-[9.5px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse animate-[pulse_2s_infinite]" /> HQ SECURED ACCESS
            </span>
          </div>
          <h1 className="text-3xl font-serif font-normal text-luxury-charcoal">
            GLOW HQ Administrator Control
          </h1>
          <p className="text-xs text-luxury-charcoal/60 leading-relaxed font-light">
            Logged in as <span className="font-mono font-bold text-luxury-gold">{adminEmail}</span>. Review live boutique parameters, configure the apothecary catalog, manage orders, and edit media streams.
          </p>
        </div>

        {/* Dynamic Session Control Widget */}
        <div className="flex flex-wrap items-center gap-3 bg-[#FAF7F2] dark:bg-[#1C1B18] p-3 rounded-sm border border-[#EADFC9]/50 dark:border-white/10 shadow-xs text-xs">
          <div className="flex items-center gap-2 font-mono text-luxury-charcoal/70 dark:text-gray-300">
            <Clock className="w-4 h-4 text-luxury-gold shrink-0 animate-pulse" />
            <span>TIMEOUT IN:</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded-xs ${timeLeft < 120 ? 'bg-red-50 text-red-700 animate-pulse' : 'text-luxury-charcoal dark:text-white'}`}>
              {formatTimeLeft(timeLeft)}
            </span>
          </div>

          <button
            onClick={() => {
              setTimeLeft(Number(timeoutPreset) * 60);
              lastActivityRef.current = Date.now();
              triggerNotice('Admin active session duration renewed successfully.');
            }}
            className="px-2.5 py-1.5 bg-white dark:bg-[#2A2926] hover:bg-luxury-cream dark:hover:bg-[#3A3935] border border-luxury-charcoal/15 dark:border-white/10 rounded-sm text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/80 dark:text-gray-200 font-bold cursor-pointer transition-colors"
            title="Maintain session active status manually"
          >
            Renew Token
          </button>

          {/* Premium Universal Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="px-2.5 py-1.5 bg-white dark:bg-[#2A2926] hover:bg-luxury-cream dark:hover:bg-[#3A3935] border border-luxury-charcoal/15 dark:border-white/10 rounded-sm text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/80 dark:text-gray-200 font-bold cursor-pointer transition-colors flex items-center gap-1.5"
            title={theme === 'dark' ? 'Activate Light Elegance' : 'Activate Midnight Velvet'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-luxury-gold stroke-[1.8] animate-spin-slow" />
                <span>Light oper.</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-luxury-gold stroke-[1.8]" />
                <span>Midnight oper.</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleAdminLogout()}
            className="py-1.5 px-3 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 rounded-sm font-mono text-[10px] uppercase font-semibold cursor-pointer flex items-center gap-1 border border-red-200/30 transition-colors"
            title="Terminate secure session key"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Success Banner Alert Notification */}
      {successMessage && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 py-3 px-4 rounded-sm text-xs md:text-sm font-sans flex items-center gap-2 slide-in-down">
          <Check className="w-4 h-4 text-emerald-600" />
          {successMessage}
        </div>
      )}

      {/* SMTP Security Broadcast Dispatch Notification */}
      {smtpBanner.show && (
        <div className="bg-[#1E1D1A] text-white border border-luxury-gold/30 py-3.5 px-4 rounded-sm text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-[pulse_2s_infinite] shadow-md border-l-4 border-l-luxury-gold slide-in-down">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <Mail className="w-4 h-4 text-luxury-gold shrink-0" />
            <div className="space-y-0.5 text-left">
              <span className="text-[10px] uppercase tracking-wider font-bold text-luxury-gold block">📧 SMTP AUDIT DISPATCH BROADCASTED</span>
              <span className="text-gray-300 font-sans leading-snug">{smtpBanner.subject}</span>
            </div>
          </div>
          <div className="text-[10.5px] text-gray-400 bg-white/5 py-1 px-2.5 rounded-xs border border-white/10 shrink-0 font-medium">
            Recipient: <span className="text-luxury-gold">{smtpBanner.recipient}</span>
          </div>
        </div>
      )}

      {/* 2. Primary Tabs bar */}
      <div className="flex flex-wrap gap-1 border-b border-[#FAF7F2] pb-0.5 text-xs font-mono tracking-wider uppercase">
        {(['overview', 'inventory', 'orders', 'blog', 'banners', 'customers', 'settings', 'security', 'integrations'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setIsEditingProduct(false);
              setIsEditingArticle(false);
              setSelectedOrder(null);
            }}
            className={`px-5 py-3 font-semibold transition-all duration-200 border-t-2 ${
              activeTab === tab
                ? 'bg-white text-luxury-gold border-luxury-gold shadow-sm font-bold'
                : 'bg-[#F2EFE8]/40 hover:bg-[#F2EFE8]/70 text-luxury-charcoal/60 border-transparent hover:text-luxury-charcoal'
            } rounded-t-sm cursor-pointer flex items-center gap-2`}
          >
            {tab === 'overview' && <LayoutDashboard className="w-3.5 h-3.5" />}
            {tab === 'inventory' && <Package className="w-3.5 h-3.5" />}
            {tab === 'orders' && <ShoppingCart className="w-3.5 h-3.5" />}
            {tab === 'blog' && <BookOpen className="w-3.5 h-3.5" />}
            {tab === 'banners' && <ImageIcon className="w-3.5 h-3.5" />}
            {tab === 'customers' && <Users className="w-3.5 h-3.5" />}
            {tab === 'settings' && <Sliders className="w-3.5 h-3.5" />}
            {tab === 'security' && <ShieldCheck className="w-3.5 h-3.5 shrink-0" />}
            {tab === 'integrations' && <Globe className="w-3.5 h-3.5 shrink-0" />}
            <span className="capitalize">
              {tab === 'security' ? 'Security logs' : tab === 'integrations' ? 'Tunnels & APIs' : tab}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Panel Compartment Content */}
      <div className="bg-white rounded-sm border border-[#EADFC9]/30 p-6 md:p-8 shadow-xs">
        
        {/* ========================================== */}
        {/* TAB: OVERVIEW */}
        {/* ========================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Statistics Row Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 bg-[#FAF7F2] rounded-sm border border-[#EADFC9]/40 space-y-3">
                <div className="flex justify-between items-center text-luxury-charcoal/50">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">Gross Revenue</span>
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-luxury-charcoal">${grossRevenue.toFixed(2)}</h3>
                  <p className="text-[10px] text-emerald-600 font-mono flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +14.2% from last week
                  </p>
                </div>
              </div>

              <div className="p-6 bg-[#FAF7F2] rounded-sm border border-[#EADFC9]/40 space-y-3">
                <div className="flex justify-between items-center text-luxury-charcoal/50">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">Processed Sales</span>
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-luxury-charcoal">{totalOrdersCount}</h3>
                  <p className="text-[10px] text-luxury-gold font-mono">
                    3 active conversions today
                  </p>
                </div>
              </div>

              <div className="p-6 bg-[#FAF7F2] rounded-sm border border-[#EADFC9]/40 space-y-3">
                <div className="flex justify-between items-center text-luxury-charcoal/50">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">Apothecary Clients</span>
                  <Users className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-luxury-charcoal">{uniqueCustomersCount}</h3>
                  <p className="text-[10px] text-emerald-600 font-mono">
                    Organic newsletter linked database
                  </p>
                </div>
              </div>

              <div className="p-6 bg-[#FAF7F2] rounded-sm border border-[#EADFC9]/40 space-y-3">
                <div className="flex justify-between items-center text-luxury-charcoal/50">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">Avg Order Value</span>
                  <Tag className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-luxury-charcoal">${avgOrderValue.toFixed(2)}</h3>
                  <p className="text-[10px] text-luxury-charcoal/40 font-mono">
                    Target baseline KPI $100
                  </p>
                </div>
              </div>

            </div>

            {/* Custom Visual native SVG Graphic */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Category Sales Distribution SVG Visualizer */}
              <div className="lg:col-span-7 bg-[#FAF7F2]/50 p-6 rounded-sm border border-[#EADFC9]/30 space-y-6">
                <div>
                  <h3 className="text-md font-serif text-luxury-charcoal font-medium">Sales Contribution by Category</h3>
                  <p className="text-xs text-luxury-charcoal/50 font-light">Distribution of revenue generated across product classifications.</p>
                </div>

                <div className="space-y-4 pt-2">
                  {Object.entries(categorySales).length === 0 ? (
                    <div className="text-center py-10 font-mono text-xs text-luxury-charcoal/40">No conversions recorded yet.</div>
                  ) : (
                    Object.entries(categorySales).map(([category, amount]) => {
                      const percentage = Math.min(100, (amount / grossRevenue) * 100) || 0;
                      return (
                        <div key={category} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-luxury-charcoal">{category}</span>
                            <span className="font-mono text-luxury-gold font-semibold">${amount.toFixed(2)} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 bg-[#F3EDE2] rounded-full overflow-hidden">
                            <div className="h-full bg-luxury-gold duration-500 ease-out transition-all" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Recent Activity Live Stream log */}
              <div className="lg:col-span-5 bg-[#FAF7F2]/50 p-6 rounded-sm border border-[#EADFC9]/30 flex flex-col justify-between space-y-6">
                <div className="space-y-1">
                  <h3 className="text-md font-serif text-luxury-charcoal font-medium">Recent Store Operations</h3>
                  <p className="text-xs text-luxury-charcoal/50 font-light">Real-time purchase and status updates.</p>
                </div>

                <div className="space-y-4 flex-1 pt-4">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex justify-between items-start text-xs border-b border-[#FAF7F2] pb-3 last:border-0 last:pb-0">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-luxury-charcoal flex items-center gap-1">
                          <span>{order.name}</span>
                          <span className="text-[10px] font-mono font-normal text-luxury-charcoal/40">({order.id})</span>
                        </div>
                        <p className="text-[10px] text-luxury-charcoal/50 font-light leading-none">{order.items.length} items • {order.orderDate}</p>
                      </div>

                      <div className="text-right space-y-1">
                        <span className="font-semibold text-luxury-charcoal font-mono block">${order.total.toFixed(2)}</span>
                        <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-mono select-none ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                          order.status === 'Refunded' ? 'bg-red-50 text-red-700 border border-red-100' :
                          'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB: INVENTORY */}
        {/* ========================================== */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            
            {/* Upper Action Bar */}
            {!isEditingProduct ? (
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pb-4 border-b border-[#F5F0E6]">
                <div>
                  <h2 className="text-xl font-serif text-luxury-charcoal font-medium">Apothecary Catalog Storage</h2>
                  <p className="text-xs text-luxury-charcoal/50 font-light">Define skincare formulations, adjust client price tags, size descriptions, and toggle stocks.</p>
                </div>

                <button
                  onClick={() => {
                    resetProductForm();
                    setIsEditingProduct(true);
                  }}
                  className="px-5 py-3 bg-luxury-charcoal text-white hover:bg-luxury-gold transition-colors duration-200 text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-1.5 rounded-sm shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add New Formula
                </button>
              </div>
            ) : null}

            {/* Editing/Adding Form Module */}
            {isEditingProduct ? (
              <form onSubmit={handleProductSubmit} className="space-y-6 max-w-4xl bg-[#FAF7F2]/50 p-6 rounded-sm border border-[#EADFC9]/30">
                <div className="flex justify-between items-center border-b border-[#EADFC9]/40 pb-3">
                  <h3 className="text-md font-serif text-luxury-charcoal font-medium uppercase font-semibold">
                    {productForm.id ? `Edit Catalog Formulation: ${productForm.name}` : 'Apothecary Formulation Form'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProduct(false);
                      resetProductForm();
                    }}
                    className="p-1 text-luxury-charcoal/50 hover:text-luxury-charcoal duration-150"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Formula Unique Slug ID</label>
                    <input
                      type="text"
                      disabled={!!productForm.id} // ID locked on edits
                      required
                      placeholder="e.g. dynamic-hydra-gel"
                      value={productForm.id || ''}
                      onChange={e => setProductForm(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Formulation Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rosewater Bio Peptides Balm"
                      value={productForm.name || ''}
                      onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Tagline / Subtitle</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ultra-smoothing cellular overnight infusion"
                      value={productForm.subtitle || ''}
                      onChange={e => setProductForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1 col-span-2">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Retail Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        placeholder="48.00"
                        value={productForm.price || ''}
                        onChange={e => setProductForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                        className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Size</label>
                      <input
                        type="text"
                        placeholder="50 ML"
                        required
                        value={productForm.size || ''}
                        onChange={e => setProductForm(prev => ({ ...prev, size: e.target.value }))}
                        className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Product Category</label>
                    <select
                      value={productForm.category || 'Moisturizer'}
                      onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                    >
                      {['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Mask', 'Supplement'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Stock Level Status</label>
                    <div className="flex gap-4 p-3 bg-white border border-[#CBD9CE]/50 rounded-xs">
                      <label className="flex items-center gap-1.5 text-xs text-luxury-charcoal cursor-pointer">
                        <input
                          type="radio"
                          checked={productForm.inStock === true}
                          onChange={() => setProductForm(prev => ({ ...prev, inStock: true }))}
                          className="text-luxury-gold focus:ring-luxury-gold"
                        />
                        In Stock (Available)
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-luxury-charcoal cursor-pointer">
                        <input
                          type="radio"
                          checked={productForm.inStock === false}
                          onChange={() => setProductForm(prev => ({ ...prev, inStock: false }))}
                          className="text-luxury-gold focus:ring-luxury-gold"
                        />
                        Out of Stock
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Primary Image URL</label>
                    <input
                      type="text"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={productForm.primaryImage || ''}
                      onChange={e => setProductForm(prev => ({ ...prev, primaryImage: e.target.value }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Hover-effects Image URL</label>
                    <input
                      type="text"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={productForm.secondaryImage || ''}
                      onChange={e => setProductForm(prev => ({ ...prev, secondaryImage: e.target.value }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Formula Rich Summary Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter absolute cell chemical descriptions, benefits, and protective barrier claims..."
                    value={productForm.description || ''}
                    onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">How To Use Directions</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Describe sensory application steps for the consumer ritual..."
                    value={productForm.howToUse || ''}
                    onChange={e => setProductForm(prev => ({ ...prev, howToUse: e.target.value }))}
                    className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Apothecary Ingredients (Comma separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="Watermelon Infusion, Gotu Kola, Organic Squalane, Rose Hydrosol"
                    value={productIngredientsText}
                    onChange={e => setProductIngredientsText(e.target.value)}
                    className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                  />
                </div>

                {/* Checklist fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Target Skin Types</label>
                    <div className="grid grid-cols-2 gap-2 bg-white p-3 border border-[#CBD9CE]/50 rounded-xs text-xs">
                      {['All', 'Dry', 'Oily', 'Combination', 'Sensitive'].map(st => (
                        <label key={st} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productSkinTypes.includes(st)}
                            onChange={() => toggleSkinTypeForm(st)}
                            className="text-luxury-gold focus:ring-luxury-gold"
                          />
                          {st}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Target Skin Concerns</label>
                    <div className="grid grid-cols-2 gap-2 bg-white p-3 border border-[#CBD9CE]/50 rounded-xs text-xs">
                      {['Hydration', 'Acne', 'Aging', 'Dullness', 'Sensitivities'].map(con => (
                        <label key={con} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={productConcerns.includes(con)}
                            onChange={() => toggleConcernForm(con)}
                            className="text-luxury-gold focus:ring-luxury-gold"
                          />
                          {con}
                        </label>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#EADFC9]/45">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProduct(false);
                      resetProductForm();
                    }}
                    className="px-5 py-3 border border-luxury-charcoal/30 text-luxury-charcoal hover:bg-[#FAF7F2] tracking-widest text-[10px] font-mono uppercase rounded-sm duration-150 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-luxury-charcoal text-white hover:bg-luxury-gold tracking-widest text-[10px] font-mono uppercase rounded-sm duration-155 cursor-pointer"
                  >
                    Commit to Store Catalog
                  </button>
                </div>
              </form>
            ) : (
              /* Products Directory Table grid */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-[#F0EAE1] font-mono text-[10px] tracking-widest uppercase text-luxury-charcoal/50">
                      <th className="py-3 px-4">Formula Details</th>
                      <th className="py-3 px-4">Classification</th>
                      <th className="py-3 px-4 font-mono">Retail Price</th>
                      <th className="py-3 px-4">Stock Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EAE1]/40 font-sans">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                        <td className="py-4 px-4 flex items-center gap-3">
                          <img
                            src={p.primaryImage}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-11 object-cover rounded-xs border border-luxury-cream shrink-0"
                          />
                          <div className="space-y-0.5">
                            <h4 className="font-semibold text-luxury-charcoal text-sm">{p.name}</h4>
                            <p className="text-[10px] text-luxury-charcoal/50 leading-relaxed max-w-sm font-light truncate">{p.subtitle}</p>
                            <span className="text-[9px] font-mono bg-luxury-cream text-luxury-gold font-bold px-1.5 py-0.5 rounded-sm">{p.id}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-light text-luxury-charcoal">
                          <span className="block font-medium">{p.category}</span>
                          <span className="text-[10px] font-mono text-luxury-charcoal/50 uppercase tracking-wider">{p.size}</span>
                        </td>

                        <td className="py-4 px-4 font-mono font-semibold text-luxury-charcoal">
                          ${p.price.toFixed(2)}
                        </td>

                        <td className="py-4 px-4 select-none">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                            p.inStock
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-red-50 text-red-700 border border-red-100'
                          }`}>
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right cursor-pointer">
                          <div className="flex justify-end gap-2.5">
                            <button
                              onClick={() => startEditProduct(p)}
                              className="p-1.5 text-luxury-charcoal/60 hover:text-luxury-gold transition-colors"
                              title="Edit formula"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to permanently delete "${p.name}" from the catalog?`)) {
                                  deleteProduct(p.id);
                                  triggerNotice(`"${p.name}" successfully removed.`);
                                  dispatchEmailNotification(
                                    'INVENTORY_DELETE',
                                    `[DATABASE CHANGE] Catalog Item REMOVED: "${p.name}"`,
                                    `Skincare catalog formulation "${p.name}" (ID: ${p.id}) was permanently deleted from active records by ${adminEmail || 'sheriff09064212548@gmail.com'}.`,
                                    {
                                      operator: adminEmail || 'sheriff09064212548@gmail.com',
                                      deletedProductId: p.id,
                                      deletedProductName: p.name,
                                      category: p.category
                                    }
                                  );
                                }
                              }}
                              className="p-1.5 text-luxury-charcoal/40 hover:text-red-600 transition-colors"
                              title="Delete formula"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* ========================================== */}
        {/* TAB: ORDERS */}
        {/* ========================================== */}
        {activeTab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Orders list tab panel (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-serif text-luxury-charcoal font-medium">Bespoke Orders Ledger</h2>
                <p className="text-xs text-luxury-charcoal/50 font-light">Monitor transactions, adjust dispatch stages, process refunds, or print customer dispatch tags.</p>
              </div>

              {/* Order Stage Filter Bar */}
              <div className="flex flex-wrap gap-1 border-b border-[#FAF7F2] pb-2 font-mono text-[10px] tracking-wider uppercase">
                {(['All', 'Processing', 'Shipped', 'Delivered', 'Refunded'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={`px-3.5 py-1.5 rounded-full border ${
                      orderFilter === f
                        ? 'bg-luxury-gold text-white border-luxury-gold text-xs font-semibold'
                        : 'bg-[#F9F5EE]/40 text-luxury-charcoal/60 border-transparent hover:text-luxury-charcoal hover:bg-luxury-cream'
                    } duration-150 cursor-pointer`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Grid lists of orders */}
              <div className="space-y-3">
                {allOrders
                  .filter(o => orderFilter === 'All' || o.status === orderFilter)
                  .map(order => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-4 rounded-sm border cursor-pointer hover:shadow-md transition-all duration-200 ${
                        selectedOrder?.id === order.id
                          ? 'bg-[#FAF7F2] border-luxury-gold'
                          : 'bg-white border-[#EADFC9]/30'
                      } flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-luxury-gold">{order.id}</span>
                          <span className="text-xs text-luxury-charcoal/40 font-mono">{order.orderDate}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-luxury-charcoal font-sans">{order.name}</h4>
                        <p className="text-[11px] text-luxury-charcoal/60 max-w-sm truncate whitespace-nowrap">
                          {order.items.map(it => `${it.quantity}x ${it.product.name}`).join(', ')}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start w-full sm:w-auto shrink-0 gap-2">
                        <span className="font-bold text-luxury-charcoal font-mono text-sm">${order.total.toFixed(2)}</span>
                        
                        <div className="flex gap-1.5 items-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-medium ${
                            order.paymentStatus === 'Refunded' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-800'
                          }`}>
                            {order.paymentStatus}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono leading-none ${
                            order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                            order.status === 'Refunded' ? 'bg-red-50 text-red-700 border border-red-100' :
                            'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Order detail operations sidebar (4 cols on lg) */}
            <div className="lg:col-span-4 bg-[#FAF7F2] p-5 rounded-sm border border-[#EADFC9]/50 space-y-6">
              {selectedOrder ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-[#EADFC9]/50 pb-3">
                    <div>
                      <span className="text-[9px] font-mono text-luxury-charcoal/40 uppercase block">Dispatched Order Registry</span>
                      <h3 className="font-serif text-md font-bold text-luxury-charcoal">{selectedOrder.id}</h3>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="text-luxury-charcoal/40 hover:text-luxury-charcoal">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Customer information details */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-[9px] font-mono text-luxury-charcoal/50 uppercase block font-semibold">Recipient Client</span>
                      <p className="font-medium text-luxury-charcoal text-sm">{selectedOrder.name}</p>
                      <p className="text-luxury-charcoal/60 lowercase">{selectedOrder.email}</p>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono text-luxury-charcoal/50 uppercase block font-semibold">Date Placed</span>
                      <p className="text-luxury-charcoal">{selectedOrder.orderDate}</p>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono text-luxury-charcoal/50 uppercase block font-semibold">Shipping Address</span>
                      <p className="text-luxury-charcoal tracking-wide max-w-sm text-justify font-sans leading-relaxed md:text-[11.5px]">
                        {selectedOrder.shippingAddress.addressLine} <br />
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip} <br />
                        {selectedOrder.shippingAddress.country}
                      </p>
                    </div>

                    <div>
                      <span className="text-[9px] font-mono text-luxury-charcoal/50 uppercase block font-semibold">Payment</span>
                      <p className="text-luxury-charcoal uppercase">Method: {selectedOrder.paymentMethod} • Status: {selectedOrder.paymentStatus}</p>
                    </div>

                    {selectedOrder.discountCode && (
                      <div>
                        <span className="text-[9px] font-mono text-luxury-gold uppercase block font-semibold">Promo Code</span>
                        <p className="text-luxury-gold uppercase font-mono">{selectedOrder.discountCode}</p>
                      </div>
                    )}
                  </div>

                  {/* Order formulation list items */}
                  <div className="border-t border-b border-[#EADFC9]/40 py-3.5 space-y-2.5">
                    <span className="text-[9px] font-mono text-luxury-charcoal/50 uppercase block font-semibold">Items Purchase Manifest</span>
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-xs">
                        <span className="font-light truncate text-luxury-charcoal max-w-[180px]">{item.quantity}x {item.product.name}</span>
                        <span className="font-mono text-luxury-charcoal/70">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="pt-2 text-xs font-mono space-y-1 text-luxury-charcoal/70">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Courier Shipping:</span>
                        <span>{selectedOrder.shipping === 0 ? 'FREE' : `$${selectedOrder.shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT (8%):</span>
                        <span>${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-luxury-charcoal text-sm border-t border-dashed border-[#EADFC9]/50 pt-1">
                        <span>Grand Cash:</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin State Changers */}
                  {selectedOrder.status !== 'Refunded' ? (
                    <div className="space-y-4">
                      <span className="text-[9px] font-mono text-luxury-charcoal/50 uppercase block font-semibold">Logistic Stage controls</span>
                      
                      {/* Shipping Carrier edit option */}
                      <div className="space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] uppercase text-luxury-charcoal/60 block">Carrier</label>
                            <input
                              type="text"
                              value={carrierInput}
                              onChange={e => setCarrierInput(e.target.value)}
                              className="w-full bg-white border border-[#CBD9CE]/50 p-2 text-[11px] rounded-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] uppercase text-luxury-charcoal/60 block">Tracking Number</label>
                            <input
                              type="text"
                              placeholder="GLOW-XXXX"
                              value={trackingNoInput}
                              onChange={e => setTrackingNoInput(e.target.value)}
                              className="w-full bg-white border border-[#CBD9CE]/50 p-2 text-[11px] rounded-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 pt-2">
                        <button
                          onClick={() => handleUpdateOrder(selectedOrder.id, 'Processing')}
                          disabled={selectedOrder.status === 'Processing'}
                          className={`py-2 text-[9px] font-mono uppercase tracking-widest rounded-sm font-semibold border ${
                            selectedOrder.status === 'Processing'
                              ? 'bg-transparent text-luxury-charcoal/40 border-transparent cursor-not-allowed'
                              : 'bg-white text-luxury-charcoal/80 border-luxury-charcoal hover:bg-white/80 cursor-pointer'
                          }`}
                        >
                          Process
                        </button>
                        <button
                          onClick={() => handleUpdateOrder(selectedOrder.id, 'Shipped')}
                          disabled={selectedOrder.status === 'Shipped'}
                          className={`py-2 text-[9px] font-mono uppercase tracking-widest rounded-sm font-semibold border ${
                            selectedOrder.status === 'Shipped'
                              ? 'bg-transparent text-luxury-charcoal/40 border-transparent cursor-not-allowed'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 cursor-pointer'
                          }`}
                        >
                          Ship Out
                        </button>
                        <button
                          onClick={() => handleUpdateOrder(selectedOrder.id, 'Delivered')}
                          disabled={selectedOrder.status === 'Delivered'}
                          className={`py-2 text-[9px] font-mono uppercase tracking-widest rounded-sm font-semibold border ${
                            selectedOrder.status === 'Delivered'
                              ? 'bg-transparent text-luxury-charcoal/40 border-transparent cursor-not-allowed'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer'
                          }`}
                        >
                          Deliver
                        </button>
                      </div>

                      {/* Refund Activation Button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleRefundOrder(selectedOrder.id)}
                          className="w-full py-2.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors text-[9px] font-mono uppercase tracking-widest font-semibold rounded-sm cursor-pointer"
                        >
                          Process Full Refund
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="bg-red-50 p-3 rounded-sm border border-red-100 flex items-center gap-2 text-xs text-red-600">
                      <AlertCircle className="w-4 h-4" /> This order transaction was fully reversed & refunded.
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-16 space-y-2 font-light text-luxury-charcoal/40">
                  <Tag className="w-8 h-8 text-luxury-gold/50 mx-auto" />
                  <p className="text-xs font-mono uppercase font-semibold">Order Terminal Isolated</p>
                  <p className="text-[11px] leading-relaxed max-w-xs mx-auto">Click on any customer order card on the left to review invoice lists, allocate tracking numbers, or process refunds.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB: BLOG CMS */}
        {/* ========================================== */}
        {activeTab === 'blog' && (
          <div className="space-y-8">
            
            {/* Header action bar */}
            {!isEditingArticle ? (
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pb-4 border-b border-[#F5F0E6]">
                <div>
                  <h2 className="text-xl font-serif text-luxury-charcoal font-medium">Bespoke Wellness Blog Publisher (Chronicles)</h2>
                  <p className="text-xs text-luxury-charcoal/50 font-light">Draft beauty reports, botanical sourcing logs, self-care routines, or organic tutorials instantly.</p>
                </div>

                <button
                  onClick={() => {
                    resetArticleForm();
                    setIsEditingArticle(true);
                  }}
                  className="px-5 py-3 bg-luxury-charcoal text-white hover:bg-luxury-gold transition-colors duration-200 text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-1.5 rounded-sm shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Chronicle Entry
                </button>
              </div>
            ) : null}

            {/* Editing / Creating visual blog form */}
            {isEditingArticle ? (
              <form onSubmit={handleArticleSubmit} className="space-y-6 max-w-4xl bg-[#FAF7F2]/50 p-6 rounded-sm border border-[#EADFC9]/30">
                <div className="flex justify-between items-center border-b border-[#EADFC9]/40 pb-3">
                  <h3 className="text-md font-serif text-luxury-charcoal font-medium uppercase font-semibold">
                    {articleForm.id ? `Edit Chronicle: ${articleForm.title}` : 'Dynamic Chronicle Form'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingArticle(false);
                      resetArticleForm();
                    }}
                    className="p-1 text-luxury-charcoal/50 hover:text-luxury-charcoal duration-150"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Chronicle Slug Unique URL Key</label>
                    <input
                      type="text"
                      disabled={!!articleForm.id} // Locked once created
                      required
                      placeholder="e.g. skin-care-benefits-ceramides"
                      value={articleForm.id || ''}
                      onChange={e => setArticleForm(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Host Author Representative</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Vance, Holistic Esthetician"
                      value={articleForm.author || ''}
                      onChange={e => setArticleForm(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Title Slogan</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The Holistic Magic of Cold-Pressed Squalane"
                      value={articleForm.title || ''}
                      onChange={e => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Subtitle Subheader</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Why natural skin lipids safeguard youthful complexions."
                      value={articleForm.subtitle || ''}
                      onChange={e => setArticleForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Stream Category classification</label>
                    <select
                      value={articleForm.category || 'Skincare Daily'}
                      onChange={e => setArticleForm(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                    >
                      {['Skincare Daily', 'Inner Wellness', 'Sourcing Story', 'Self-Care Ritual'].map(sc => (
                        <option key={sc} value={sc}>{sc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Estimated reading duration</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5 MIN READ"
                      value={articleForm.readingTime || ''}
                      onChange={e => setArticleForm(prev => ({ ...prev, readingTime: e.target.value }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Headline Display Banner Cover Image URL</label>
                    <input
                      type="text"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={articleForm.coverImage || ''}
                      onChange={e => setArticleForm(prev => ({ ...prev, coverImage: e.target.value }))}
                      className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Headline Quick Summary Card</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Enter short 2-sentence summary hook showing up on the grid directory..."
                    value={articleForm.summary || ''}
                    onChange={e => setArticleForm(prev => ({ ...prev, summary: e.target.value }))}
                    className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Chronicle Body Paragraphs</label>
                    <span className="text-[9px] font-mono text-luxury-charcoal/40 font-light">Separate paragraphs with double enter (blank line)</span>
                  </div>
                  <textarea
                    rows={6}
                    required
                    placeholder="First paragraphs describing scientific claims...&#13;&#10;&#13;&#10;Second paragraph describing the sensory ritual steps..."
                    value={articleContentText}
                    onChange={e => setArticleContentText(e.target.value)}
                    className="w-full bg-white border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-[#EADFC9]/45">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingArticle(false);
                      resetArticleForm();
                    }}
                    className="px-5 py-3 border border-luxury-charcoal/30 text-luxury-charcoal hover:bg-[#FAF7F2] tracking-widest text-[10px] font-mono uppercase rounded-sm duration-150 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-luxury-charcoal text-white hover:bg-luxury-gold tracking-widest text-[10px] font-mono uppercase rounded-sm duration-155 cursor-pointer"
                  >
                    Publish Chronicle Entry
                  </button>
                </div>
              </form>
            ) : (
              /* Articles CMS List directory grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map(art => (
                  <div key={art.id} className="bg-[#FAF7F2]/40 rounded-sm border border-[#EADFC9]/30 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={art.coverImage}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-[#1E1D1A] text-white px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest leading-none rounded-sm">
                        {art.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono text-luxury-charcoal/40 font-semibold uppercase tracking-wider block">ID: {art.id} • {art.readingTime}</span>
                        <h3 className="font-serif text-base text-luxury-charcoal font-semibold leading-snug line-clamp-2">{art.title}</h3>
                        <p className="text-xs text-luxury-charcoal/60 leading-relaxed line-clamp-3 font-light">{art.summary}</p>
                      </div>

                      <div className="pt-4 border-t border-[#EADFC9]/20 flex justify-between items-center">
                        <div className="text-[10px] uppercase font-mono text-luxury-charcoal/50 leading-relaxed font-light">
                          By <span className="font-semibold text-luxury-charcoal/80">{art.author}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => startEditArticle(art)}
                            className="p-1.5 text-luxury-charcoal hover:text-luxury-gold transition-colors"
                            title="Edit chronicle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to permanently delete article "${art.title}"?`)) {
                                deleteArticle(art.id);
                                triggerNotice('Chronicle entry deleted successfully.');
                                dispatchEmailNotification(
                                  'CHRONICLE_DELETE',
                                  `[DATABASE CHANGE] Chronicle Column REMOVED: "${art.title}"`,
                                  `Wellness article "${art.title}" (ID: ${art.id}) written by ${art.author} was purged from live blog resources by user ${adminEmail || 'sheriff09064212548@gmail.com'}.`,
                                  {
                                    operator: adminEmail || 'sheriff09064212548@gmail.com',
                                    deletedArticleId: art.id,
                                    deletedArticleTitle: art.title,
                                    category: art.category
                                  }
                                );
                              }
                            }}
                            className="p-1.5 text-luxury-charcoal/40 hover:text-red-600 transition-colors"
                            title="Delete chronicle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ========================================== */}
        {/* TAB: BANNERS CMS */}
        {/* ========================================== */}
        {activeTab === 'banners' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Editor fields */}
            <form onSubmit={handleHeroBannerUpdate} className="lg:col-span-6 space-y-5">
              <div>
                <h2 className="text-xl font-serif text-luxury-charcoal font-medium">Homepage Hero Banner CMS</h2>
                <p className="text-xs text-luxury-charcoal/50 font-light">Instantly modify headline slogans, text copy paragraphs, or main visuals without code.</p>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Main Slogan Heading (HTML/Whitespace and breaks allowed)</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Celebrate Your Unique Skin."
                  value={heroTitle}
                  onChange={e => setHeroTitle(e.target.value)}
                  className="w-full bg-[#FAF7F2]/40 border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs font-sans leading-relaxed"
                />
                <span className="text-[9.5px] text-luxury-charcoal/40 font-mono italic">Tip: use line feeds/breaks to control typography design flow.</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Apothecary Philosophy Subtitle Paragraph</label>
                <textarea
                  rows={4}
                  required
                  placeholder="True beauty starts with well-being..."
                  value={heroSubtitle}
                  onChange={e => setHeroSubtitle(e.target.value)}
                  className="w-full bg-[#FAF7F2]/40 border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs font-sans font-light leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/70">Main Cover Image URL (Unsplash or direct asset links)</label>
                <input
                  type="text"
                  placeholder="Leave empty to restore default pre-generated arrangement artwork"
                  value={heroImageUrl}
                  onChange={e => setHeroImageUrl(e.target.value)}
                  className="w-full bg-[#FAF7F2]/40 border border-[#CBD9CE]/50 p-3 text-xs focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold outline-none rounded-xs"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setHeroTitle('Celebrate Your \nUnique Skin.');
                    setHeroSubtitle('True beauty starts with well-being. We forge active botanical chemistry with clinical lipids to create a calming, barrier-first skincare ritual of pure, minimalist luxury.');
                    setHeroImageUrl('');
                  }}
                  className="px-4 py-3 border border-luxury-charcoal/20 text-luxury-charcoal tracking-widest text-[9.5px] font-mono uppercase rounded-sm duration-150 cursor-pointer"
                >
                  Reset Defaults
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-luxury-charcoal text-white hover:bg-luxury-gold tracking-widest text-[9.5px] font-mono uppercase rounded-sm duration-155 cursor-pointer"
                >
                  Update Banner Media
                </button>
              </div>
            </form>

            {/* Live mockup layout viewport */}
            <div className="lg:col-span-6 bg-[#FAF7F2]/50 p-5 rounded-sm border border-[#EADFC9]/40 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-luxury-gold uppercase font-semibold block outline-none">Live WYSIWYG Viewport Preview</span>
                <p className="text-[11px] text-luxury-charcoal/50 leading-relaxed font-light font-sans">Simulated display card showing visual alignment on client screen.</p>
              </div>

              <div className="bg-white p-4 border border-[#FAF1E3] space-y-4 shadow-xs rounded-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2 text-left">
                    <span className="inline-block text-[8px] font-mono uppercase bg-luxury-gold/10 text-luxury-gold px-2 py-0.5 rounded-full font-semibold">Philosophy EST. 2026</span>
                    <h1 className="text-xl font-serif text-luxury-charcoal font-semibold whitespace-pre-line leading-snug">{heroTitle}</h1>
                    <p className="text-[10px] text-luxury-charcoal/60 leading-relaxed font-sans font-light select-none line-clamp-4">{heroSubtitle}</p>
                  </div>
                  <div className="aspect-4/3 rounded-xs overflow-hidden bg-luxury-cream border border-gray-100">
                    <img
                      src={heroImageUrl || 'https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?q=80&w=800&auto=format&fit=crop'}
                      alt="Hero banner layout mock"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB: CUSTOMERS DATABASE */}
        {/* ========================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-serif text-luxury-charcoal font-medium">Boutique Customer Relationship Database (CRM)</h2>
              <p className="text-xs text-luxury-charcoal/50 font-light">Explore client purchase history, evaluate dynamic customer lifetimes value, and outline personalized skincare marketing suggestions.</p>
            </div>

            {/* Customers table */}
            <div className="border border-[#EADFC9]/30 rounded-sm overflow-hidden bg-white">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-[#F0EAE1] font-mono text-[10px] tracking-widest uppercase text-luxury-charcoal/50 bg-[#FAF7F2]/40">
                    <th className="py-3 px-4">Customer Name & Contact</th>
                    <th className="py-3 px-4 text-center">Total Orders</th>
                    <th className="py-3 px-4 font-mono text-right">Lifetime Spent Value</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE1]/40 font-sans">
                  {systemCustomers.map(customer => (
                    <React.Fragment key={customer.email}>
                      <tr className="hover:bg-[#FAF7F2]/25 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-luxury-charcoal leading-snug text-sm">{customer.name}</div>
                          <div className="text-xs text-luxury-charcoal/50 lowercase leading-relaxed font-light">{customer.email}</div>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-medium text-luxury-charcoal text-xs">
                          {customer.ordersCount}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-right text-luxury-charcoal text-xs">
                          ${customer.totalSpent.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setExpandedCustomerEmail(expandedCustomerEmail === customer.email ? null : customer.email)}
                            className="px-3 py-1.5 border border-luxury-charcoal/30 hover:border-luxury-gold text-luxury-charcoal hover:text-luxury-gold tracking-widest font-mono text-[9.5px] uppercase rounded-sm duration-150 cursor-pointer"
                          >
                            {expandedCustomerEmail === customer.email ? 'Close Operations' : 'Purchase Logs →'}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Transactions log list */}
                      {expandedCustomerEmail === customer.email && (
                        <tr>
                          <td colSpan={4} className="bg-[#FAF7F2]/40 px-6 py-4">
                            <div className="space-y-4 max-w-4xl text-xs">
                              <div className="flex border-b border-[#EADFC9]/30 pb-2">
                                <span className="font-serif text-xs font-semibold text-luxury-charcoal uppercase">Purchase logs for {customer.name}</span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {customer.transactions.map(txn => (
                                  <div key={txn.id} className="bg-white p-3 border border-[#EADFC9]/25 rounded-xs flex justify-between items-center text-[11px]">
                                    <div className="space-y-0.5">
                                      <div className="font-mono font-bold text-luxury-gold">{txn.id}</div>
                                      <div className="text-luxury-charcoal/50">{txn.date}</div>
                                    </div>

                                    <div className="text-right space-y-1">
                                      <span className="font-mono font-bold text-luxury-charcoal block">${txn.amount.toFixed(2)}</span>
                                      <span className="inline-block px-1.5 py-0.5 rounded-full text-[8.5px] font-mono uppercase bg-neutral-100 text-neutral-700">status: {txn.status}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Automated recommendation triggers for marketing based on skin metrics purchase */}
                              <div className="bg-white/80 p-3.5 border border-luxury-gold/20 rounded-xs space-y-1">
                                <span className="text-[10px] font-mono text-luxury-gold uppercase font-bold tracking-wider block">Esthetician CRM Recommendation Note</span>
                                <p className="text-[11.5px] font-sans leading-relaxed text-luxury-charcoal/70 font-light">
                                  {customer.totalSpent >= 150 ? (
                                    <span>🌟 **Glow VIP Member**: Highly active loyalty complex. Recommend dispatching curated free miniatures of Luna Ceramide Retinol with their next order to activate cross-product hydration.</span>
                                  ) : (
                                    <span>🌿 **Standard apothecary client**: Segment for the standard monthly newsletter ritual. Focus on barrier renewal claims in seasonal beauty campaigns.</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB: GLOBAL BRANDING & MEDIA HQ CMS */}
        {/* ========================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease]">
            <div className="border-b border-[#EADFC9]/40 pb-4">
              <h2 className="text-xl font-serif text-luxury-charcoal flex items-center gap-2">
                <Sliders className="w-5 h-5 text-luxury-gold" /> Storefront Media & Parameters Control HQ
              </h2>
              <p className="text-xs text-luxury-charcoal/60 leading-relaxed font-light mt-1">
                Configure live site headlines, digital branding names, corporate support contacts, and Our Story marketing chronicles dynamically.
              </p>
            </div>

            <form onSubmit={handleSiteSettingsSubmit} className="space-y-8">
              {/* Layout Block 1: Digital Brand Branding */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono tracking-widest text-luxury-gold uppercase font-bold border-l-2 border-luxury-gold pl-2">
                  Digital Identity & Brand Branding
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF7F2]/40 p-4 rounded-sm border border-[#EADFC9]/20">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                      Header Primary Logo Title
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold rounded-xs"
                      value={logoTitleForm}
                      onChange={e => setLogoTitleForm(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                      Header Logo Subtitle / Descriptor
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold rounded-xs"
                      value={logoSubtitleForm}
                      onChange={e => setLogoSubtitleForm(e.target.value)}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                      Header Active Announcement Bar Message
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold rounded-xs"
                      value={announcementTextForm}
                      onChange={e => setAnnouncementTextForm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Layout Block 2: Corporate contact */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono tracking-widest text-luxury-gold uppercase font-bold border-l-2 border-luxury-gold pl-2">
                  Corporate Headquarters contact (Footer management)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF7F2]/40 p-4 rounded-sm border border-[#EADFC9]/20">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                      Corporate Brand Slogan
                    </label>
                    <textarea
                      rows={2}
                      className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold rounded-xs resize-none"
                      value={brandSloganForm}
                      onChange={e => setBrandSloganForm(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                      HQ Geographic Location
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold rounded-xs"
                      value={hqLocationForm}
                      onChange={e => setHqLocationForm(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                      Direct Support Call-line Phone
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold rounded-xs"
                      value={supportPhoneForm}
                      onChange={e => setSupportPhoneForm(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                      Operating Clock Timing (Hours timezone info)
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold rounded-xs"
                      value={supportHoursForm}
                      onChange={e => setSupportHoursForm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Layout Block 3: Narrative and Chronicles */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono tracking-widest text-luxury-gold uppercase font-bold border-l-2 border-luxury-gold pl-2">
                  Our Story Page Narrative Chronicles
                </h3>
                <div className="space-y-6 bg-[#FAF7F2]/40 p-4 rounded-sm border border-[#EADFC9]/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                        Editorial Story Heading Title
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold rounded-xs"
                        value={aboutStoryTitleForm}
                        onChange={e => setAboutStoryTitleForm(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                        Apothecary Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold rounded-xs"
                        value={aboutStorySubtitleForm}
                        onChange={e => setAboutStorySubtitleForm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                        Chronicles Narrative Paragraph A
                      </label>
                      <textarea
                        rows={3}
                        className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold rounded-xs resize-none"
                        value={aboutStoryPara1Form}
                        onChange={e => setAboutStoryPara1Form(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                        Chronicles Narrative Paragraph B
                      </label>
                      <textarea
                        rows={3}
                        className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold rounded-xs resize-none"
                        value={aboutStoryPara2Form}
                        onChange={e => setAboutStoryPara2Form(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                        Chronicles Narrative Paragraph C
                      </label>
                      <textarea
                        rows={3}
                        className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs outline-none focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold rounded-xs resize-none"
                        value={aboutStoryPara3Form}
                        onChange={e => setAboutStoryPara3Form(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 border-t border-[#EADFC9]/40 pt-6 font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    // Reset to initial values from context
                    if (siteSettings) {
                      setLogoTitleForm(siteSettings.logoTitle);
                      setLogoSubtitleForm(siteSettings.logoSubtitle);
                      setBrandSloganForm(siteSettings.brandSlogan);
                      setAnnouncementTextForm(siteSettings.announcementText);
                      setHqLocationForm(siteSettings.headquartersLocation);
                      setSupportPhoneForm(siteSettings.supportPhone);
                      setSupportHoursForm(siteSettings.supportHours);
                      setAboutStoryTitleForm(siteSettings.aboutStoryTitle);
                      setAboutStorySubtitleForm(siteSettings.aboutStorySubtitle);
                      setAboutStoryPara1Form(siteSettings.aboutStoryPara1);
                      setAboutStoryPara2Form(siteSettings.aboutStoryPara2);
                      setAboutStoryPara3Form(siteSettings.aboutStoryPara3);
                      triggerNotice('Form parameters reset back to live database state.');
                    }
                  }}
                  className="px-5 py-3 border border-luxury-charcoal/20 hover:border-luxury-charcoal text-luxury-charcoal text-xs font-mono tracking-widest uppercase rounded-sm duration-150 cursor-pointer text-center"
                >
                  Discard Changes
                </button>

                <button
                  type="submit"
                  className="px-6 py-3 bg-luxury-charcoal hover:bg-luxury-gold text-white text-xs font-mono tracking-widest uppercase rounded-sm duration-150 cursor-pointer shadow-sm text-center font-bold"
                >
                  Apply Configuration Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB: SECURITY TRANSMISSIONS & LOGS AUDIT */}
        {/* ========================================== */}
        {activeTab === 'security' && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease]">
            <div className="border-b border-[#EADFC9]/40 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-left">
                <h2 className="text-xl font-serif text-luxury-charcoal flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-luxury-gold" /> Administrative SMTP Audit Ledger
                </h2>
                <p className="text-xs text-luxury-charcoal/60 leading-relaxed font-light mt-1 text-left">
                  Compliance panel tracking real-time secure alerts dispatched to the registered partner. Transmissions are locked under decision standard <span className="font-mono font-bold text-luxury-gold text-[11px] bg-luxury-charcoal/5 px-1.5 py-0.5 rounded-sm">Sequence Option A</span>.
                </p>
              </div>

              {emailDispatches.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to purge the local transmission buffer? This will not affect delivered emails.')) {
                      setEmailDispatches([]);
                      localStorage.removeItem('glow_admin_email_dispatches');
                      triggerNotice('SMTP transmission logs purged successfully.');
                    }
                  }}
                  className="px-3 py-1.5 border border-[#EADFC9] text-luxury-charcoal/70 hover:border-red-400 hover:text-red-600 rounded-sm font-mono text-[10px] uppercase duration-150 cursor-pointer self-start md:self-auto"
                >
                  Clear Buffer
                </button>
              )}
            </div>

            {/* Micro status bento layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-[#FAF7F2]/60 p-4 border border-[#EADFC9]/30 rounded-xs flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 rounded-xs border border-emerald-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] font-mono tracking-wider text-luxury-charcoal/50 uppercase">AUDIT COMPLIANCE</div>
                  <div className="text-xs font-mono font-semibold text-emerald-700 uppercase">ACTIVE & SECURIZED</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#FAF7F2]/60 p-4 border border-[#EADFC9]/30 rounded-xs flex items-center gap-3">
                <div className="p-2.5 bg-luxury-gold/5 rounded-xs border border-luxury-gold/10">
                  <Mail className="w-5 h-5 text-luxury-gold" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] font-mono tracking-wider text-luxury-charcoal/50 uppercase">ACTIVE MONITOR</div>
                  <div className="text-[11.5px] font-mono font-medium text-luxury-charcoal truncate max-w-[140px]" title="sheriff09064212548@gmail.com">
                    sheriff09064212548@gmail.com
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#FAF7F2]/60 p-4 border border-[#EADFC9]/30 rounded-xs flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xs border border-[#EADFC9]/20">
                  <Send className="w-5 h-5 text-luxury-charcoal/70" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] font-mono tracking-wider text-luxury-charcoal/50 uppercase">DISPATCH STATE</div>
                  <div className="text-xs font-serif text-luxury-charcoal font-semibold">
                    {emailDispatches.length} Logs Saved
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-[#FAF7F2]/60 p-4 border border-[#EADFC9]/30 rounded-xs flex items-center gap-3">
                <div className="p-2.5 bg-[#1E1D1A] rounded-xs">
                  <Key className="w-5 h-5 text-luxury-gold animate-bounce" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] font-mono tracking-wider text-gray-500 uppercase">SECURITY METHOD</div>
                  <div className="text-xs font-mono text-luxury-gold font-bold">OPTION A // SECURE</div>
                </div>
              </div>
            </div>

            {/* Email Dispatcher Table */}
            <div className="bg-white border border-[#EADFC9]/30 rounded-sm overflow-hidden shadow-sm">
              <div className="bg-[#FAF7F2]/50 py-3.5 px-4 border-b border-[#EADFC9]/30 flex items-center justify-between">
                <div className="text-[11px] font-mono uppercase tracking-wider text-luxury-charcoal/70 font-semibold text-left">
                  MoniTron Real-time Transmission Queue
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[9px] font-semibold border border-emerald-200/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Connection Stable
                </span>
              </div>

              {emailDispatches.length === 0 ? (
                <div className="py-16 text-center space-y-3.5 px-4">
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#EADFC9]/40 flex items-center justify-center mx-auto text-luxury-charcoal/40 animate-pulse">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-luxury-charcoal/80">No security alerts dispatched yet</h4>
                    <p className="text-xs text-luxury-charcoal/50 max-w-sm mx-auto font-light mt-1.5">
                      Submitting settings corrections, updating inventory products, processing billing updates, or manipulating blog releases will automatically trigger secure alerts here.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[#FAF7F2]">
                  {emailDispatches.map((log) => {
                    const isExpanded = expandedLogId === log.id;
                    return (
                      <div key={log.id} className={`transition-colors duration-150 ${isExpanded ? 'bg-[#FAF7F2]/30' : 'hover:bg-[#FAF7F2]/10'}`}>
                        {/* Summary Row */}
                        <div
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left cursor-pointer"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[10px] font-bold text-luxury-gold tracking-wide px-1.5 py-0.5 bg-[#FAF7F2] rounded-xs border border-luxury-gold/25 uppercase shrink-0">
                                {log.actionType}
                              </span>
                              <span className="text-[11.5px] font-medium text-luxury-charcoal truncate">
                                {log.subject}
                              </span>
                            </div>
                            <div className="text-[10.5px] text-luxury-charcoal/50 flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span className="font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3 text-luxury-gold" /> {log.timestamp}
                              </span>
                              <span className="font-sans flex items-center gap-1 text-gray-500">
                                To: <span className="font-mono font-medium text-luxury-gold">{log.recipient}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-4">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100 uppercase shrink-0">
                                <Check className="w-3 h-3" /> {log.status}
                              </span>
                              <span className="text-[10px] font-mono text-gray-400 shrink-0 select-none">
                                {log.id}
                              </span>
                            </div>
                            <span className="text-luxury-gold hover:text-luxury-charcoal transition-colors">
                              <ChevronRight className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                            </span>
                          </div>
                        </div>

                        {/* Expandable SMTP Raw Mail Terminal */}
                        {isExpanded && (
                          <div className="px-4 pb-5 border-t border-[#FAF7F2] pt-4 bg-[#FAF7F2]/40 animate-[fadeIn_0.2s_ease]">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                              {/* Left column: SMTP headers */}
                              <div className="lg:col-span-5 space-y-2 text-left">
                                <div className="text-[9.5px] font-mono uppercase tracking-wider text-luxury-charcoal/60 font-bold flex items-center gap-1.5">
                                  <Key className="w-3 h-3 text-luxury-gold" /> Cryptographic SMTP Envelope Headers
                                </div>
                                <pre className="p-3.5 bg-[#FAF7F2] border border-[#EADFC9]/30 rounded-xs text-[10px] font-mono text-luxury-charcoal/80 overflow-x-auto leading-relaxed max-h-[220px]">
                                  {log.smtpHeader}
                                </pre>
                              </div>

                              {/* Right column: Raw Security email body content */}
                              <div className="lg:col-span-7 space-y-2 text-left">
                                <div className="text-[9.5px] font-mono uppercase tracking-wider text-luxury-charcoal/60 font-bold flex items-center gap-1.5">
                                  <Mail className="w-3 h-3 text-luxury-gold" /> Encrypted Safety Transmission Message Body
                                </div>
                                <pre className="p-3.5 bg-luxury-charcoal text-gray-200 border border-luxury-charcoal rounded-xs text-[10.5px] font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[220px]">
                                  {log.body}
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Disclaimer segment */}
            <div className="bg-red-50/50 border border-red-100 p-4 rounded-sm text-left flex gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-[11px] font-mono uppercase tracking-wider font-bold text-red-800">
                  HIGH AUTHORITY AUDIT MANDATE
                </h4>
                <p className="text-xs text-red-700/80 leading-relaxed font-light">
                  Active database configurations and administrator interactions are audited and triggered automatically. This interface demonstrates live SMTP delivery logs dispatched to <strong>sheriff09064212548@gmail.com</strong> according to security Option A rules.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB: EXTERNAL INTEGRATIONS & LOCAL TUNNELS */}
        {/* ========================================== */}
        {activeTab === 'integrations' && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease]">
            {/* Header section */}
            <div className="border-b border-[#EADFC9]/40 pb-4">
              <h2 className="text-xl font-serif text-luxury-charcoal flex items-center gap-2">
                <Globe className="w-5 h-5 text-luxury-gold" /> Cloud Deployment & Integrations Core
              </h2>
              <p className="text-xs text-luxury-charcoal/60 leading-relaxed font-light mt-1 text-left font-serif">
                Manage your live public hosting pipeline, configure public gateway URLs, and synchronize live Supabase transactional storage directly.
              </p>
            </div>

            {/* ========================================== */}
            {/* LIVE CLOUD PIPELINE: GITHUB + VERCEL + SUPABASE */}
            {/* ========================================== */}
            <div className="bg-white dark:bg-[#1A1916] p-6 rounded-sm border border-luxury-gold/30 shadow-md text-left space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EADFC9]/20 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-serif text-luxury-charcoal dark:text-gray-100 flex items-center gap-2 font-semibold">
                    <ShieldCheck className="w-5 h-5 text-luxury-gold" /> GitHub + Vercel + Supabase Production Pipeline
                  </h3>
                  <p className="text-xs text-luxury-charcoal/60 dark:text-gray-400">
                    Host your digital luxury apothecary permanently on the live web with instant updates and full transactional persistence.
                  </p>
                </div>
                
                {/* Connection Status Badge */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-mono font-bold uppercase border tracking-wider ${
                    isSupabaseConfigured
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-850'
                      : 'bg-[#FAF7F2] dark:bg-neutral-800 text-luxury-charcoal/40 dark:text-gray-400 border-neutral-300 dark:border-neutral-700'
                  }`}>
                    {isSupabaseConfigured ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block shrink-0" />
                        <span>Live Supabase: Connected</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shrink-0" />
                        <span>Local Sandbox: Standalone</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Seeding & SQL Setup block */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Seeding Engine Column */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-luxury-gold flex items-center gap-1.5">
                    <span>1. Synchronize / Bootstrap Live Tables</span>
                  </h4>
                  <p className="text-xs text-luxury-charcoal/70 dark:text-gray-300 leading-relaxed font-light">
                    If you just provisioned a fresh database, your live products store matches an empty state. Click below to load your current local apothecary formulation stock, user review archives, and blog chronicles to your live Supabase!
                  </p>
                  
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isSyncingToSupabase || !isSupabaseConfigured}
                      onClick={handleBootstrapSupabase}
                      className={`px-4 py-2.5 rounded-sm font-mono text-xs tracking-wider uppercase font-bold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                        !isSupabaseConfigured
                          ? 'bg-gray-100 dark:bg-neutral-800 text-gray-450 border border-gray-200 dark:border-neutral-750 cursor-not-allowed'
                          : 'bg-luxury-charcoal dark:bg-neutral-800 text-white dark:text-[#E0E0E0] hover:bg-luxury-gold hover:text-white border border-transparent'
                      }`}
                    >
                      {isSyncingToSupabase ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Piping Data to Cloud...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Bootstrap Live Supabase Db</span>
                        </>
                      )}
                    </button>
                    {!isSupabaseConfigured && (
                      <p className="text-[10px] text-red-650 dark:text-red-400 font-mono mt-2 leading-relaxed">
                        ⚠️ Standalone Mode Active: Run this app on localhost with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY specified in your environment backend variables to activate live database writes.
                      </p>
                    )}
                  </div>
                </div>

                {/* SQL Provisioning Column */}
                <div className="space-y-4 font-sans">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-luxury-gold flex items-center justify-between">
                    <span>2. PostgreSQL Table Schemas Setup</span>
                    <button
                      type="button"
                      onClick={() => setShowSqlCheatsheet(!showSqlCheatsheet)}
                      className="text-[10px] text-luxury-charcoal hover:text-luxury-gold underline lowercase font-normal cursor-pointer"
                    >
                      {showSqlCheatsheet ? '[Hide Schema]' : '[Reveal Schema Codes]'}
                    </button>
                  </h4>
                  <p className="text-xs text-luxury-charcoal/70 dark:text-gray-300 leading-relaxed font-light">
                    Supabase requires corresponding tables to receive and read orders, products, and articles. Copy our high-performance relational schema script, visit your Supabase SQL Editor page, and click run to allocate database tables in seconds!
                  </p>

                  {showSqlCheatsheet && (
                    <div className="space-y-2 mt-2 font-mono text-[10.5px]">
                      <div className="flex justify-between items-center text-[9px] text-[#A69B85] font-bold">
                        <span>POSTGRESQL SEED SCHEMA</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(SUPABASE_SQL_TRANSCRIPT);
                            triggerNotice('SQL Provisioning Script copied to clipboard!');
                          }}
                          className="px-2 py-0.5 bg-luxury-gold/10 text-luxury-gold rounded-sm hover:bg-luxury-gold hover:text-white transition-colors cursor-pointer"
                        >
                          Copy SQL Script
                        </button>
                      </div>
                      <textarea
                        readOnly
                        className="w-full h-40 bg-zinc-950 dark:bg-black border border-zinc-800 text-emerald-400 p-2.5 font-mono text-[10px] resize-none rounded-xs outline-none"
                        value={SUPABASE_SQL_TRANSCRIPT}
                      />
                    </div>
                  )}
                </div>

              </div>

              {/* Setup step-by-step visual map */}
              <div className="pt-4 border-t border-[#EADFC9]/25">
                <h4 className="text-[10.5px] font-mono font-bold uppercase tracking-widest text-[#9C8F7E] dark:text-[#A69B85] mb-4">
                  THREE-STEP DEPLOYMENT ARCHITECTURE GUIDE (GITHUB + VERCEL + SUPABASE)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-luxury-charcoal/85 dark:text-gray-200">
                  {/* Step 1 */}
                  <div className="p-4 bg-[#FAF7F2]/40 dark:bg-neutral-900/30 rounded-xs border border-[#EADFC9]/25 hover:border-luxury-gold/30 duration-150 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-luxury-gold text-white font-mono flex items-center justify-center font-bold text-[10px]">I</span>
                      <strong className="font-serif text-[13px] tracking-wide text-luxury-charcoal dark:text-gray-100">Safe Storage: GitHub</strong>
                    </div>
                    <p className="font-light leading-relaxed text-[11px] text-luxury-charcoal/70 dark:text-gray-300">
                      Export your workspace files locally. Log in to your GitHub account, create a new <strong>Private Repository</strong>, and push your code files to preserve changes safely and synchronize development.
                    </p>
                    <div className="bg-zinc-950 dark:bg-black p-2.5 rounded-sm text-gray-300 text-[9.5px] font-mono space-y-1 border border-zinc-800 select-all leading-relaxed">
                      <div>git init</div>
                      <div>git add .</div>
                      <div className="truncate">git commit -m "Init Apothecary"</div>
                      <div className="text-gray-500 font-light italic truncate">git remote add origin ...</div>
                      <div>git push -u origin main</div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 bg-[#FAF7F2]/40 dark:bg-neutral-900/30 rounded-xs border border-[#EADFC9]/25 hover:border-luxury-gold/30 duration-150 space-y-3 font-sans">
                    <div className="flex items-center gap-2 font-serif">
                      <span className="w-5 h-5 rounded-full bg-luxury-gold text-white font-mono flex items-center justify-center font-bold text-[10px]">II</span>
                      <strong className="font-serif text-[13px] tracking-wide text-luxury-charcoal dark:text-gray-100">Live Hosting: Vercel</strong>
                    </div>
                    <p className="font-light leading-relaxed text-[11px] text-luxury-charcoal/70 dark:text-gray-300">
                      Sign up for <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-luxury-gold hover:underline font-bold">Vercel.com</a>. Select <strong>Add New &gt; Project</strong> and import your fresh GitHub repository. Vercel automatically detects the Vite framework settings, builds static files on push events, and serves your boutique platform to the global internet on a high-speed CDN.
                    </p>
                    <ul className="space-y-1 text-[11px] text-luxury-charcoal/60 dark:text-gray-400 font-light font-mono bg-[#FAF7F2]/60 dark:bg-black/30 p-2 border border-[#EADFC9]/15">
                      <li>Framework: <strong>Vite</strong></li>
                      <li>Build Command: <strong>npm run build</strong></li>
                      <li>Publish Dir: <strong>dist</strong></li>
                    </ul>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 bg-[#FAF7F2]/40 dark:bg-neutral-900/30 rounded-xs border border-[#EADFC9]/25 hover:border-luxury-gold/30 duration-150 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-luxury-gold text-white font-mono flex items-center justify-center font-bold text-[10px]">III</span>
                      <strong className="font-serif text-[13px] tracking-wide text-luxury-charcoal dark:text-gray-100">Variables Mapping</strong>
                    </div>
                    <p className="font-light leading-relaxed text-[11px] text-luxury-charcoal/70 dark:text-gray-300">
                      Create an account in <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-luxury-gold hover:underline font-bold">Supabase.com</a> and setup your project. Copy the credentials and assign them as Vercel Environment variables to wire them permanently:
                    </p>
                    <div className="bg-zinc-950 dark:bg-black p-2.5 rounded-sm text-yellow-400 text-[9.5px] font-mono leading-relaxed border border-zinc-900 space-y-1">
                      <div className="font-bold flex justify-between"><span>VITE_SUPABASE_URL</span> <span className="text-gray-400 text-[8px]">(https://...)</span></div>
                      <div className="font-bold flex justify-between"><span>VITE_SUPABASE_ANON_KEY</span> <span className="text-gray-400 text-[8px]">(anon-key)</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sandbox Title Header */}
            <div className="border-b border-[#EADFC9]/40 pb-2 pt-4 text-left">
              <h3 className="text-sm font-mono tracking-widest uppercase text-luxury-gold font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4" /> LOCALHOSt WEBHOOKS & TELEMETRY SANDBOX
              </h3>
            </div>


            {/* Dashboard grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left column: tunnel address, cli guidelines, options */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 1. Local hosting tunnel */}
                <div className="bg-[#FAF7F2]/50 p-5 rounded-sm border border-[#EADFC9]/40 text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-mono tracking-widest text-luxury-gold uppercase font-bold flex items-center gap-1.5">
                      <Terminal className="w-4 h-4" /> LOCAL TUNNEL CONNECTION
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase border ${
                      tunnelUrl.includes('ngrok') || tunnelUrl.includes('cloudflare') || tunnelUrl.includes('trycloudflare')
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-500 border-amber-200'
                    }`}>
                      {tunnelUrl.includes('ngrok') || tunnelUrl.includes('cloudflare') || tunnelUrl.includes('trycloudflare') ? '🔴 active Tunnel' : '⚠️ Offline/localhost'}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-luxury-charcoal/70 leading-relaxed font-light">
                    Since Zendesk and Zapier live on the public web, they can only communicate with endpoints forwarded via a public URL. Creating a tunnel pipes requests safely back to your machine on custom port 3000.
                  </p>

                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <label className="block text-[9.5px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                        Your temporary public URL
                      </label>
                      <input
                        type="url"
                        placeholder="e.g., https://glowskincare-test.ngrok.io"
                        className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs font-mono outline-none focus:ring-1 focus:ring-luxury-gold rounded-xs"
                        value={tunnelUrl}
                        onChange={e => {
                          setTunnelUrl(e.target.value);
                          localStorage.setItem('glow_tunnel_url', e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  {/* CLI commands cheatsheet */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-[10px] font-mono font-bold text-luxury-charcoal/80 uppercase">Free Terminal Commands</h4>
                    
                    <div className="space-y-2">
                      {/* Ngrok command */}
                      <div className="p-3 bg-luxury-charcoal rounded-xs text-gray-300 font-mono text-[10.5px] space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] text-[#A69B85] font-bold">
                          <span>OPTION A: NGROK CLI</span>
                          <span className="text-[8.5px] bg-[#EADFC9]/10 px-1 py-0.5 rounded text-luxury-gold font-bold">Recommended</span>
                        </div>
                        <div className="text-white flex items-center justify-between">
                          <code>ngrok http 3000</code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('ngrok http 3000');
                              triggerNotice('Copied ngrok http 3000 command to clipboard!');
                            }}
                            className="text-[9px] text-luxury-gold hover:text-white uppercase transition-colors font-bold cursor-pointer"
                          >
                            Copy Command
                          </button>
                        </div>
                      </div>

                      {/* Cloudflare command */}
                      <div className="p-3 bg-luxury-charcoal rounded-xs text-gray-300 font-mono text-[10.5px] space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] text-[#A69B85] font-bold">
                          <span>OPTION B: CLOUDFLARE CLOUDFLARED</span>
                          <span className="text-[8.5px] bg-[#EADFC9]/10 px-1 py-0.5 rounded text-luxury-gold font-bold">No Register Needed</span>
                        </div>
                        <div className="text-white flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <code className="truncate max-w-[200px]">cloudflared tunnel --url http://localhost:3000</code>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('cloudflared tunnel --url http://localhost:3000');
                              triggerNotice('Copied Cloudflare tunnel command!');
                            }}
                            className="text-[9px] text-luxury-gold hover:text-white uppercase transition-colors shrink-0 font-bold cursor-pointer self-end"
                          >
                            Copy Command
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Target configs */}
                <div className="bg-[#FAF7F2]/50 p-5 rounded-sm border border-[#EADFC9]/40 text-left space-y-4">
                  <span className="text-[10.5px] font-mono tracking-widest text-luxury-gold uppercase font-bold flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" /> API Targets Setup
                  </span>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label id="zapier-wh-label" className="block text-[9.5px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                        Zapier Catch Webhook URL
                      </label>
                      <input
                        type="url"
                        aria-labelledby="zapier-wh-label"
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                        className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs font-mono outline-none focus:ring-1 focus:ring-luxury-gold rounded-xs"
                        value={zapierWebhookUrl}
                        onChange={e => {
                          setZapierWebhookUrl(e.target.value);
                          localStorage.setItem('glow_zapier_webhook_url', e.target.value);
                        }}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label id="zendesk-sub-label" className="block text-[9.5px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                        Zendesk Subdomain API Target
                      </label>
                      <input
                        type="text"
                        aria-labelledby="zendesk-sub-label"
                        placeholder="glowskincare.zendesk.com"
                        className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs font-mono outline-none focus:ring-1 focus:ring-luxury-gold rounded-xs"
                        value={zendeskDomain}
                        onChange={e => {
                          setZendeskDomain(e.target.value);
                          localStorage.setItem('glow_zendesk_domain', e.target.value);
                        }}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label id="zendesk-email-input-label" className="block text-[9.5px] font-mono tracking-wider uppercase text-luxury-charcoal/65 font-bold">
                        Zendesk Customer / Support channel
                      </label>
                      <input
                        type="email"
                        aria-labelledby="zendesk-email-input-label"
                        placeholder="support@glowskincare.zendesk.com"
                        className="w-full bg-white border border-[#EADFC9]/50 p-2.5 text-xs font-mono outline-none focus:ring-1 focus:ring-luxury-gold rounded-xs"
                        value={zendeskAgentEmail}
                        onChange={e => {
                          setZendeskAgentEmail(e.target.value);
                          localStorage.setItem('glow_zendesk_agent_email', e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right column: live simulators playground & logs */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Simulator dashboard */}
                <div className="bg-white p-5 rounded-sm border border-[#EADFC9]/40 text-left space-y-5">
                  <div className="flex items-center justify-between border-b border-[#FAF7F2] pb-3">
                    <span className="text-[10px] font-mono tracking-widest text-luxury-charcoal uppercase font-bold flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-luxury-gold animate-bounce" /> Live Payload Simulator Console
                    </span>
                    <span className="text-[9.5px] font-mono text-gray-400">Tunnel active: <strong className="text-luxury-charcoal">{tunnelUrl ? 'ACTIVE' : 'NONE'}</strong></span>
                  </div>

                  <p className="text-xs text-luxury-charcoal/65 leading-relaxed font-light">
                    Initiate live checkout, client sign-up, or zendesk support workflows. Clicking a button constructs a valid JSON transaction payload, forwards it (via mock routing parameters), and appends it immediately to the local verification logs ledger.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Simulator order.placed */}
                    <button
                      type="button"
                      disabled={isSimulatingWebhook}
                      onClick={() => triggerWebhookSimulation('order.placed')}
                      className="p-4 bg-[#FAF7F2]/40 hover:bg-[#FAF7F2] border border-[#EADFC9]/30 hover:border-luxury-gold duration-150 rounded-sm text-left flex flex-col justify-between h-[120px] group cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <Zap className="w-4.5 h-4.5 text-amber-500 shrink-0 group-hover:scale-110 duration-200" />
                        <span className="text-[8.5px] font-mono font-bold tracking-wider text-gray-400 uppercase">Zapier Webhook</span>
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-serif text-luxury-charcoal font-semibold">Emit order.placed</h4>
                        <p className="text-[10px] text-luxury-charcoal/50 font-light line-clamp-2">Alpine cellular sales check-out order object dispatched to Zapier.</p>
                      </div>
                    </button>

                    {/* Simulator client.registered */}
                    <button
                      type="button"
                      disabled={isSimulatingWebhook}
                      onClick={() => triggerWebhookSimulation('client.registered')}
                      className="p-4 bg-[#FAF7F2]/40 hover:bg-[#FAF7F2] border border-[#EADFC9]/30 hover:border-luxury-gold duration-150 rounded-sm text-left flex flex-col justify-between h-[120px] group cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <Zap className="w-4.5 h-4.5 text-amber-500 shrink-0 group-hover:scale-110 duration-200" />
                        <span className="text-[8.5px] font-mono font-bold tracking-wider text-gray-400 uppercase">Zapier Webhook</span>
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-serif text-luxury-charcoal font-semibold">Emit client.registered</h4>
                        <p className="text-[10px] text-luxury-charcoal/50 font-light line-clamp-2">Dispatches high-value skin questionnaire results to setup CRM contacts.</p>
                      </div>
                    </button>

                    {/* Simulator ticket */}
                    <button
                      type="button"
                      disabled={isSimulatingWebhook}
                      onClick={() => triggerWebhookSimulation('support.ticket_created')}
                      className="p-4 bg-[#FAF7F2]/40 hover:bg-[#FAF7F2] border border-[#EADFC9]/30 hover:border-luxury-gold duration-150 rounded-sm text-left flex flex-col justify-between h-[120px] group cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <LifeBuoy className="w-4.5 h-4.5 text-emerald-600 shrink-0 group-hover:scale-110 duration-200" />
                        <span className="text-[8.5px] font-mono font-bold tracking-wider text-gray-400 uppercase">Zendesk Bridge</span>
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-serif text-luxury-charcoal font-semibold">Create Ticket Enquiry</h4>
                        <p className="text-[10px] text-luxury-charcoal/50 font-light line-clamp-2">Pipes sample customer support query directly to registered agents inbox.</p>
                      </div>
                    </button>

                    {/* Simulator subscribers database sync */}
                    <button
                      type="button"
                      disabled={isSimulatingWebhook}
                      onClick={() => triggerWebhookSimulation('formula.active_sync')}
                      className="p-4 bg-[#FAF7F2]/40 hover:bg-[#FAF7F2] border border-[#EADFC9]/30 hover:border-luxury-gold duration-150 rounded-sm text-left flex flex-col justify-between h-[120px] group cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <ArrowRightLeft className="w-4.5 h-4.5 text-indigo-500 shrink-0 group-hover:scale-110 duration-200" />
                        <span className="text-[8.5px] font-mono font-bold tracking-wider text-gray-400 uppercase">Telemetry Broadcast</span>
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-serif text-luxury-charcoal font-semibold">Sync active.subscriber metrics</h4>
                        <p className="text-[10px] text-luxury-charcoal/50 font-light line-clamp-2">Triggers background statistics verification in Option A security rules.</p>
                      </div>
                    </button>
                  </div>

                  {isSimulatingWebhook && (
                    <div className="border border-luxury-gold/30 bg-[#FAF7F2] p-3 text-xs font-mono text-luxury-charcoal rounded-sm animate-pulse flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-luxury-gold animate-spin" />
                      <span>CONSTRUCTING SECURE ENVELOPE. DISPATCHING TO ENDPOINT VIA LOCAL TUNNEL...</span>
                    </div>
                  )}
                </div>

                {/* Ledger lists representing hook transactions */}
                <div className="bg-white border border-[#EADFC9]/40 rounded-sm overflow-hidden text-left shadow-xs">
                  <div className="bg-[#FAF7F2]/60 py-3.5 px-4 border-b border-[#EADFC9]/30 flex items-center justify-between">
                    <span className="text-[10.5px] font-mono uppercase tracking-widest font-bold text-luxury-charcoal/80">
                      Sandbox Webhook Delivery Logs Ledger
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setWebhookLogs([]);
                        localStorage.removeItem('glow_webhook_delivery_logs');
                        triggerNotice('Sandbox webhook delivery logs parsed and wiped successfully.');
                      }}
                      className="text-[9.5px] font-mono text-red-700 uppercase bg-red-50 hover:bg-red-100 font-semibold px-2.5 py-1 rounded-sm border border-red-200/20 cursor-pointer"
                    >
                      Purge History
                    </button>
                  </div>

                  <div className="divide-y divide-[#FAF7F2]">
                    {webhookLogs.length === 0 ? (
                      <div className="py-12 text-center text-xs font-mono text-gray-400">
                        No sandbox transmissions captured yet. Fire some triggers above.
                      </div>
                    ) : (
                      webhookLogs.map((log: any) => {
                        const isExpanded = selectedWebhookLogId === log.id;
                        return (
                          <div key={log.id} className="transition-colors duration-150">
                            {/* Summary row */}
                            <div
                              onClick={() => setSelectedWebhookLogId(isExpanded ? null : log.id)}
                              className="p-4 flex items-center justify-between gap-3 hover:bg-[#FAF7F2]/20 cursor-pointer text-xs"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                                  log.targetService.includes('Zapier') 
                                    ? 'bg-amber-50 text-amber-800 border-amber-200/50' 
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200/50'
                                }`}>
                                  {log.targetService}
                                </span>
                                <span className="font-mono text-luxury-gold font-bold text-[10px] uppercase shrink-0">#{log.id}</span>
                                <span className="font-sans font-medium text-luxury-charcoal">{log.event}</span>
                              </div>

                              <div className="flex items-center gap-3 font-mono">
                                <span className="text-[10px] text-luxury-charcoal/40 hidden sm:inline">{log.timestamp}</span>
                                <span className="bg-emerald-50 text-emerald-800 border border-emerald-25 text-[9.5px] font-bold px-1.5 py-0.3 rounded-xs shrink-0 flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-600" /> {log.code} {log.status}
                                </span>
                              </div>
                            </div>

                            {/* Raw payload viewer */}
                            {isExpanded && (
                              <div className="p-4 bg-[#FAF7F2]/30 border-t border-[#FAF7F2] animate-[fadeIn_0.2s_ease] space-y-2.5">
                                <div className="text-[9px] font-mono text-luxury-charcoal/50 uppercase flex items-center justify-between">
                                  <span>Secure JSON Package sent via temporary tunnel ({tunnelUrl})</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(JSON.stringify(log.payload, null, 2));
                                      triggerNotice('Payload code successfully copied to clipboard!');
                                    }}
                                    className="text-luxury-gold hover:text-luxury-charcoal font-bold transition-colors cursor-pointer uppercase"
                                  >
                                    Copy Packet
                                  </button>
                                </div>
                                <pre className="p-4 bg-luxury-charcoal text-gray-200 border border-luxury-charcoal rounded-xs font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[250px] text-left">
                                  {JSON.stringify(log.payload, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
