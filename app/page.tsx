"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Define TypeScript interfaces for our interactive components
interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function Home() {
  // State for active tab in the AI Sandbox Demo
  const [activeSandboxTab, setActiveSandboxTab] = useState<"gmail" | "whatsapp" | "telegram" | "outlook">("gmail");
  
  // State for connection toggles
  const [connections, setConnections] = useState({
    gmail: true,
    whatsapp: false,
    telegram: false,
    outlook: false,
  });

  // State for connection loading states
  const [connectingId, setConnectingId] = useState<string | null>(null);

  // State for FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // State for automated replies compression level (Bento Card interactive slider)
  const [compressionRatio, setCompressionRatio] = useState<number>(65);

  // State for simulator chat logs (sandbox)
  const [simulatedNotes, setSimulatedNotes] = useState<string[]>([]);

  // Toggle connection with loading animation
  const handleToggleConnection = (id: "gmail" | "whatsapp" | "telegram" | "outlook") => {
    if (connections[id]) {
      // Instantly disconnect
      setConnections(prev => ({ ...prev, [id]: false }));
    } else {
      // Simulate OAuth connection flow
      setConnectingId(id);
      setTimeout(() => {
        setConnections(prev => ({ ...prev, [id]: true }));
        setConnectingId(null);
      }, 1500);
    }
  };

  // Content for the AI sandbox demo based on selected app
  const sandboxContent = {
    gmail: {
      appName: "Gmail",
      color: "from-red-500/20 to-red-600/10 border-red-500/30",
      textColor: "text-red-400",
      badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      incomingMessage: {
        sender: "Sarah Jenkins (Director of Ops)",
        subject: "Urgent: Q3 Launch Strategy Updates & Resource Allocation",
        body: "Hey Team, following our board meeting, we need to adjust the roadmap. The launch is pushed to October 15th to accommodate the new security audits. Also, marketing budget is increased by $45k, but engineering resources must be locked by Friday. Let me know your thoughts on the slide deck attached before tomorrow's standup.",
        time: "10:32 AM"
      },
      aiOutput: {
        summary: "Launch delayed to Oct 15th for security audits. Marketing budget increased by $45k. Engineering resource allocations must be finalized by Friday.",
        reminders: [
          { text: "Review Sarah's slide deck today", due: "By 6:00 PM" },
          { text: "Lock engineering resources & notify Ops", due: "Friday, 10:00 AM" }
        ],
        draftReply: "Hi Sarah, thanks for the update. I've noted the Oct 15th launch date. I will review the slide deck this afternoon and send my feedback before 6 PM. For engineering, I'll sync with team leads and lock resources by Friday morning."
      }
    },
    whatsapp: {
      appName: "WhatsApp",
      color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
      textColor: "text-emerald-400",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.76.46 3.42 1.25 4.89l-1.3 4.79 4.9-1.28c1.42.77 3.03 1.21 4.76 1.21 5.52 0 10.004-4.48 10.004-10.004C21.608 6.48 17.124 2 12.004 2zm5.72 13.06c-.25.7-1.42 1.3-1.95 1.38-.5.08-1.15.1-3.34-.8-2.8-1.15-4.6-4-4.74-4.2-.14-.17-1.12-1.5-1.12-2.84 0-1.35.7-2 1-2.3.24-.26.63-.38.98-.38.12 0 .23 0 .32.02.28.01.42.03.6.45.23.56.78 1.9.85 2.05.07.15.12.33.02.53-.1.2-.15.3-.3.48-.15.18-.3.3-.43.46-.15.15-.3.32-.13.6.17.3.75 1.25 1.6 2.03.95.83 1.76 1.08 2.07 1.23.3.15.47.13.65-.08.18-.2.8-1 1.02-1.33.08-.12.16-.1.28-.05.12.05.78.37 1.44.7.67.33 1.1.5 1.2.68.1.18.1 1.05-.15 1.75z"/>
        </svg>
      ),
      incomingMessage: {
        sender: "Marcus (Product Lead)",
        subject: "Direct Chat",
        body: "Hey! Can you review the API schema for the integration page? I left comments on the Figma board. Need it approved today so we can start backend scaffolding tomorrow morning. Also, coffee tomorrow at 9?",
        time: "1:15 PM"
      },
      aiOutput: {
        summary: "Marcus requested review of Figma API schema comments today to unblock backend scaffolding. Suggested coffee tomorrow at 9:00 AM.",
        reminders: [
          { text: "Review and approve API schema comments on Figma", due: "Today, 5:00 PM" },
          { text: "Coffee meeting with Marcus", due: "Tomorrow, 9:00 AM" }
        ],
        draftReply: "Sounds good, Marcus! I will review the API schema and address your comments on Figma within the hour. 9 AM tomorrow for coffee works perfectly for me. See you there!"
      }
    },
    telegram: {
      appName: "Telegram",
      color: "from-sky-500/20 to-sky-600/10 border-sky-500/30",
      textColor: "text-sky-400",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.12.82-1.88 8.16-2.24 9.7-.15.65-.4 1.15-.66 1.17-.56.05-1-.38-1.54-.73-.85-.55-1.33-.9-2.16-1.45-1-.62-.35-1.07.22-1.66.15-.15 2.7-2.48 2.75-2.7.01-.03.01-.15-.06-.21-.07-.06-.17-.04-.25-.02-.11.02-1.92 1.2-5.4 3.52-.5.35-.97.52-1.39.51-.47-.01-1.37-.27-2.04-.49-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.03-.75 4.02-1.75 6.7-2.9 8.04-3.46 3.82-1.6 4.62-1.88 5.14-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07 0 .15-.02.21z"/>
        </svg>
      ),
      incomingMessage: {
        sender: "Dev Team Channel (54 unread messages)",
        subject: "Scrum & Deployment Log Updates",
        body: "Dave: Docker container crashed on staging. \nElena: Fixing it, env variable PORT was missing. \nDave: Merged patch #109. Staging is live again. \nChris: Let's defer database migration to Thursday to prevent downtime during client demo. \nElena: Agreed, will schedule migration script for Thursday 4 AM UTC.",
        time: "2:40 PM"
      },
      aiOutput: {
        summary: "Staging server crashed and was resolved by Elena (missing PORT env variable). Patch #109 merged. Database migration deferred to Thursday 4 AM UTC to avoid downtime during client demo.",
        reminders: [
          { text: "Confirm staging environment stability with Dave", due: "Tomorrow" },
          { text: "Database migration window (check logs)", due: "Thursday, 4:00 AM UTC" }
        ],
        draftReply: "[Channel Broadcast Suggestion]: Thanks Elena and Dave for the quick fix on staging. Deferring the database migration to Thursday 4 AM UTC is the right call for the demo."
      }
    },
    outlook: {
      appName: "Outlook",
      color: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
      textColor: "text-blue-400",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      ),
      incomingMessage: {
        sender: "HR Operations Office",
        subject: "Mandatory Security & Compliance Verification 2026",
        body: "Dear Employee, you are required to complete the annual Information Security compliance training modules before the end of the quarter (June 30th). Failure to submit the certification will result in restricted VPN access. The training takes approximately 45 minutes to complete and is hosted on the internal LMS portal.",
        time: "Yesterday"
      },
      aiOutput: {
        summary: "Annual Information Security compliance training is due by June 30th. Completion is required to maintain VPN access. Takes ~45 minutes.",
        reminders: [
          { text: "Complete mandatory compliance training", due: "By June 30th" }
        ],
        draftReply: "Dear HR Operations, thank you for the reminder. I have added the security training to my calendar and will complete it well before the June 30th deadline."
      }
    }
  };

  const selectedData = sandboxContent[activeSandboxTab];

  // FAQ items list
  const faqs: FAQItem[] = [
    {
      question: "How does CosAI connect to my personal and work accounts?",
      answer: "CosAI uses official, secure OAuth 2.0 protocols for Google Workspace, Microsoft Outlook, Telegram API, and WhatsApp Cloud APIs. We do not store your passwords. You grant permission directly via the service provider, and you can revoke access instantly with a single click in your settings."
    },
    {
      question: "Is my personal data and chat content secure?",
      answer: "Security and privacy are our highest priorities. CosAI employs end-to-end encryption. You can choose to run processing on our secure, SOC2-certified cloud models or configure a local LLM through our desktop companion, meaning your private messages never leave your machine."
    },
    {
      question: "Can it write replies and send them automatically?",
      answer: "No. By default, CosAI acts as a co-pilot. It drafts context-aware replies based on your conversation history, but they are never sent without your review and approval. You maintain complete control over all outgoing communication."
    },
    {
      question: "Does it filter out spam and irrelevant messages?",
      answer: "Yes. Our intelligent relevance engine filters out newsletter spam, system alerts, verification codes, and casual banter. It prioritizes action items, scheduling conflicts, client inquiries, and team blockages so you only focus on what truly matters."
    },
    {
      question: "What platforms are supported?",
      answer: "Currently, we offer official integrations for Gmail, Microsoft Outlook, WhatsApp (both personal and business APIs), and Telegram. Support for Slack, Discord, and Apple iMessage is coming in Q3 2026."
    }
  ];

  return (
    <div className="bg-[#030303] text-zinc-100 min-h-screen font-sans selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">
      
      {/* Background glow graphics */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-[800px] right-10 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none -z-20"></div>

      {/* 1. HEADER SECTION */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-[#030303]/75 border-b border-zinc-800/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-zinc-400">CosAI</span>
              <span className="text-[10px] text-zinc-500 font-semibold tracking-wider uppercase -mt-1">Chief of Staff</span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors duration-200">Features</a>
            <a href="#sandbox" className="hover:text-white transition-colors duration-200">Interactive Demo</a>
            <a href="#integrations" className="hover:text-white transition-colors duration-200">Integrations</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-200">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
          </nav>

          {/* Action button */}
          <div className="flex items-center gap-4">
            <a href="#sandbox" className="hidden sm:inline-block text-xs font-semibold text-zinc-300 hover:text-white transition-colors">
              Sign In
            </a>
            <a href="#pricing" className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900">
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 rounded-full animate-pulse group-hover:opacity-100 transition-opacity"></span>
              <span className="relative block px-5 py-2.5 rounded-full bg-[#09090b] text-xs sm:text-sm font-bold text-white transition-colors duration-300 group-hover:bg-transparent">
                Launch Assistant
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          {/* Animated Promo Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-950/20 text-violet-400 text-xs font-medium mb-8 animate-fade-in backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping"></span>
            <span className="font-semibold">Introducing CosAI 1.0</span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-300">Unified Personal Agent</span>
            <svg className="w-3 h-3 text-violet-400 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.1]">
            Your AI Chief of Staff. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-emerald-400">
              Connected to your digital life.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-zinc-400 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Instantly sync Gmail, Outlook, WhatsApp, and Telegram. Let your personal AI agent draft replies, track reminders, summarize message floods, and schedule tasks automatically.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <a href="#pricing" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-violet-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-center">
              Get Started Free
            </a>
            <a href="#sandbox" className="w-full sm:w-auto px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-base hover:bg-zinc-800/80 hover:text-white transition-all text-center flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Interactive Demo
            </a>
          </div>

          {/* Hero Dashboard Preview / Account Connector Component */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 sm:p-6 backdrop-blur-xl shadow-2xl shadow-violet-950/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-emerald-500/0 rounded-2xl pointer-events-none"></div>
            
            {/* Window chrome */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
                <span className="text-xs text-zinc-500 ml-2 font-mono">cosai-agent-v1.0.sh</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] text-zinc-400 font-medium tracking-wide">SYSTEM ONLINE</span>
              </div>
            </div>

            {/* Content area: Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              
              {/* Left Column: Account Connections (Connector Simulation) */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100 mb-2">Connect Your Accounts</h3>
                  <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                    Securely bridge your messaging channels. Toggle on to grant CosAI background read authorization.
                  </p>

                  <div className="space-y-4">
                    {/* GMAIL */}
                    <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between transition-all hover:border-zinc-700/60">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-200">Gmail API</p>
                          <p className="text-[11px] text-zinc-500">Emails & Attachments</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggleConnection("gmail")}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                          connectingId === "gmail" ? "bg-zinc-800 text-zinc-400 cursor-not-allowed" :
                          connections.gmail ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/25" : 
                          "bg-zinc-800 hover:bg-zinc-700 text-white"
                        }`}
                        disabled={connectingId === "gmail"}
                      >
                        {connectingId === "gmail" ? "Connecting..." : connections.gmail ? "Disconnect" : "Connect"}
                      </button>
                    </div>

                    {/* OUTLOOK */}
                    <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between transition-all hover:border-zinc-700/60">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-200">Outlook API</p>
                          <p className="text-[11px] text-zinc-500">Office & Calendar</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggleConnection("outlook")}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                          connectingId === "outlook" ? "bg-zinc-800 text-zinc-400 cursor-not-allowed" :
                          connections.outlook ? "bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25" : 
                          "bg-zinc-800 hover:bg-zinc-700 text-white"
                        }`}
                        disabled={connectingId === "outlook"}
                      >
                        {connectingId === "outlook" ? "Connecting..." : connections.outlook ? "Disconnect" : "Connect"}
                      </button>
                    </div>

                    {/* WHATSAPP */}
                    <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between transition-all hover:border-zinc-700/60">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.76.46 3.42 1.25 4.89l-1.3 4.79 4.9-1.28c1.42.77 3.03 1.21 4.76 1.21 5.52 0 10.004-4.48 10.004-10.004C21.608 6.48 17.124 2 12.004 2zm5.72 13.06c-.25.7-1.42 1.3-1.95 1.38-.5.08-1.15.1-3.34-.8-2.8-1.15-4.6-4-4.74-4.2-.14-.17-1.12-1.5-1.12-2.84 0-1.35.7-2 1-2.3.24-.26.63-.38.98-.38.12 0 .23 0 .32.02.28.01.42.03.6.45.23.56.78 1.9.85 2.05.07.15.12.33.02.53-.1.2-.15.3-.3.48-.15.18-.3.3-.43.46-.15.15-.3.32-.13.6.17.3.75 1.25 1.6 2.03.95.83 1.76 1.08 2.07 1.23.3.15.47.13.65-.08.18-.2.8-1 1.02-1.33.08-.12.16-.1.28-.05.12.05.78.37 1.44.7.67.33 1.1.5 1.2.68.1.18.1 1.05-.15 1.75z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-200">WhatsApp</p>
                          <p className="text-[11px] text-zinc-500">Chats & Group Feeds</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggleConnection("whatsapp")}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                          connectingId === "whatsapp" ? "bg-zinc-800 text-zinc-400 cursor-not-allowed" :
                          connections.whatsapp ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25" : 
                          "bg-zinc-800 hover:bg-zinc-700 text-white"
                        }`}
                        disabled={connectingId === "whatsapp"}
                      >
                        {connectingId === "whatsapp" ? "Connecting..." : connections.whatsapp ? "Disconnect" : "Connect"}
                      </button>
                    </div>

                    {/* TELEGRAM */}
                    <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between transition-all hover:border-zinc-700/60">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.12.82-1.88 8.16-2.24 9.7-.15.65-.4 1.15-.66 1.17-.56.05-1-.38-1.54-.73-.85-.55-1.33-.9-2.16-1.45-1-.62-.35-1.07.22-1.66.15-.15 2.7-2.48 2.75-2.7.01-.03.01-.15-.06-.21-.07-.06-.17-.04-.25-.02-.11.02-1.92 1.2-5.4 3.52-.5.35-.97.52-1.39.51-.47-.01-1.37-.27-2.04-.49-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.03-.75 4.02-1.75 6.7-2.9 8.04-3.46 3.82-1.6 4.62-1.88 5.14-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07 0 .15-.02.21z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-200">Telegram</p>
                          <p className="text-[11px] text-zinc-500">Channels & Directs</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggleConnection("telegram")}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                          connectingId === "telegram" ? "bg-zinc-800 text-zinc-400 cursor-not-allowed" :
                          connections.telegram ? "bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/25" : 
                          "bg-zinc-800 hover:bg-zinc-700 text-white"
                        }`}
                        disabled={connectingId === "telegram"}
                      >
                        {connectingId === "telegram" ? "Connecting..." : connections.telegram ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-900">
                  <div className="bg-violet-950/10 border border-violet-900/30 rounded-xl p-3 flex gap-2.5 items-start">
                    <svg className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      <span className="font-semibold text-zinc-300 block">End-to-End Cryptography</span>
                      All data is locally decrypted and processed on-device or on a private server. Zero persistent indexing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Assistant Feed Simulation */}
              <div className="lg:col-span-8 bg-[#09090b]/55 border border-zinc-900/60 rounded-xl p-4 sm:p-6 flex flex-col justify-between">
                <div>
                  
                  {/* Status header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse"></div>
                      <span className="text-xs font-bold text-zinc-300">Unified Live AI Stream</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">updated 4s ago</span>
                  </div>

                  {/* Simulated Incoming Feed */}
                  <div className="space-y-4">
                    {connections.gmail && (
                      <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 h-full w-[3px] bg-red-500"></div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-300">Gmail: Sarah Jenkins</span>
                            <span className="text-[10px] text-zinc-500">• 10:32 AM</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-red-950/30 text-[10px] border border-red-500/20 text-red-400 font-mono font-medium">urgent_ops</span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-1 mb-2 font-mono">"Hey Team, following our board meeting, we need to adjust the roadmap..."</p>
                        
                        {/* Live AI output box inside stream */}
                        <div className="mt-3 p-3 bg-zinc-900/60 rounded-lg border border-zinc-800/40">
                          <div className="flex items-center gap-1.5 text-[11px] text-violet-400 font-bold mb-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            COSAI SUMMARY
                          </div>
                          <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">
                            Launch delayed to Oct 15th for security. Lock engineering budget/resources by Friday standup.
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-emerald-400"></span> Calendar Synced
                            </span>
                            <span className="text-[10px] text-violet-400 bg-violet-950/20 border border-violet-500/20 px-1.5 py-0.5 rounded">
                              📝 1 Reply Drafted
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {connections.whatsapp && (
                      <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 h-full w-[3px] bg-emerald-500"></div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-300">WhatsApp: Marcus</span>
                            <span className="text-[10px] text-zinc-500">• 1:15 PM</span>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-1 mb-2 font-mono">"Hey! Can you review the API schema for the integration page? I left comments..."</p>
                        
                        {/* Live AI output box inside stream */}
                        <div className="mt-3 p-3 bg-zinc-900/60 rounded-lg border border-zinc-800/40">
                          <div className="flex items-center gap-1.5 text-[11px] text-violet-400 font-bold mb-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            RELEVANT ACTIONS
                          </div>
                          <ul className="text-[11px] text-zinc-300 space-y-1">
                            <li className="flex items-start gap-1">
                              <span className="text-amber-400 font-bold">•</span>
                              Review Figma comments today before scaffold starting tomorrow.
                            </li>
                            <li className="flex items-start gap-1">
                              <span className="text-indigo-400 font-bold">•</span>
                              Coffee tomorrow @ 9:00 AM (Invite sent to Outlook calendar).
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {!connections.whatsapp && !connections.outlook && !connections.telegram && (
                      <div className="py-8 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
                        <svg className="w-8 h-8 text-zinc-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-zinc-400 font-medium">Connect more channels to see cross-channel live correlations</p>
                        <p className="text-[10px] text-zinc-600 mt-1">Try toggling WhatsApp, Telegram, or Outlook in the left panel</p>
                      </div>
                    )}

                    {connections.telegram && (
                      <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/40 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 h-full w-[3px] bg-sky-500"></div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-zinc-300">Telegram: Dev Team Channel</span>
                            <span className="text-[10px] text-zinc-500">• 2:40 PM</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-sky-950/30 text-[10px] border border-sky-500/20 text-sky-400 font-mono">scrum_chat</span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-1 mb-2 font-mono">Elena fixed the missing staging env variable. Dave merged patch...</p>
                        
                        <div className="mt-3 p-3 bg-zinc-900/60 rounded-lg border border-zinc-800/40">
                          <div className="flex items-center gap-1.5 text-[11px] text-violet-400 font-bold mb-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            DEFERRAL WARNING
                          </div>
                          <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">
                            DB Migration rescheduled to <span className="text-sky-400">Thursday 4 AM UTC</span> to prevent demo disruptions.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prompt bar */}
                <div className="mt-6 border-t border-zinc-900 pt-4 flex gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="Ask your assistant (e.g., 'Summarize today's client requests')" 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-300 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono"
                      readOnly
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5 items-center">
                      <span className="text-[10px] font-mono text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-900">Ctrl</span>
                      <span className="text-[10px] font-mono text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-900">K</span>
                    </div>
                  </div>
                  <button className="px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    Send
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN INTERACTIVE SANDBOX DEMO */}
      <section id="sandbox" className="py-20 border-t border-zinc-900 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Live Simulation</h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Test-Drive The AI Assistant
            </p>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
              Click the application tabs below to feed raw notifications into the CosAI engine and watch the agent isolate summaries, actions, and replies in real-time.
            </p>
          </div>

          <div className="max-w-4xl mx-auto border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/60 backdrop-blur-xl shadow-2xl">
            
            {/* Tabs Bar */}
            <div className="flex border-b border-zinc-800 bg-[#060608] overflow-x-auto">
              {(["gmail", "whatsapp", "telegram", "outlook"] as const).map((tab) => {
                const data = sandboxContent[tab];
                const isActive = activeSandboxTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveSandboxTab(tab)}
                    className={`flex-1 min-w-[120px] px-6 py-4 flex items-center justify-center gap-2 border-b-2 text-xs font-bold transition-all duration-300 ${
                      isActive 
                        ? `border-violet-500 bg-violet-500/5 text-white` 
                        : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                    }`}
                  >
                    <span className={isActive ? data.textColor : "text-zinc-500"}>{data.icon}</span>
                    <span>{data.appName}</span>
                  </button>
                );
              })}
            </div>

            {/* Sandbox Workspace */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-950/40">
              
              {/* Left Column: Raw Message Input */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Raw Input Notification</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${selectedData.badgeColor}`}>
                    {selectedData.appName} Feed
                  </span>
                </div>
                
                <div className="flex-1 rounded-xl border border-zinc-800/80 bg-zinc-900/20 p-5 font-mono text-xs text-zinc-300 flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="border-b border-zinc-800 pb-3 mb-3">
                      <p className="text-zinc-500 mb-1"><span className="text-zinc-400 font-semibold">From:</span> {selectedData.incomingMessage.sender}</p>
                      <p className="text-zinc-500"><span className="text-zinc-400 font-semibold">Subject:</span> {selectedData.incomingMessage.subject}</p>
                    </div>
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                      {selectedData.incomingMessage.body}
                    </p>
                  </div>
                  <div className="text-right text-[10px] text-zinc-600 mt-4">
                    Received: {selectedData.incomingMessage.time}
                  </div>
                </div>
              </div>

              {/* Right Column: AI Agent Processed output */}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">CosAI Structured Extraction</span>
                
                <div className="flex-1 rounded-xl border border-violet-900/20 bg-gradient-to-b from-violet-950/5 via-[#09090b] to-[#09090b] p-5 sm:p-6 space-y-5 min-h-[300px]">
                  
                  {/* Summary Block */}
                  <div>
                    <div className="flex items-center gap-2 text-violet-400 text-xs font-bold mb-2">
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Structured Summary
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
                      {selectedData.aiOutput.summary}
                    </p>
                  </div>

                  {/* Reminders & Calendar Action Items */}
                  <div>
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Extracted Reminders
                    </div>
                    <div className="space-y-2">
                      {selectedData.aiOutput.reminders.map((rem, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 text-xs">
                          <span className="text-zinc-300 font-medium">{rem.text}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50 shrink-0 font-mono ml-2">
                            Due: {rem.due}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Smart Reply Draft */}
                  <div>
                    <div className="flex items-center justify-between text-indigo-400 text-xs font-bold mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Contextual Reply Draft
                      </div>
                      <span className="text-[9px] text-zinc-500 font-normal italic">Matches your writing voice</span>
                    </div>
                    <div className="p-3 bg-indigo-950/10 border border-indigo-900/30 rounded-lg text-xs text-zinc-300 font-mono leading-relaxed relative">
                      {selectedData.aiOutput.draftReply}
                    </div>
                  </div>

                  {/* Action buttons inside Sandbox */}
                  <div className="pt-2 border-t border-zinc-900 flex gap-3">
                    <button className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs transition-colors">
                      Send Reply Draft
                    </button>
                    <button className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition-all">
                      Sync Reminders
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURE BENTO GRID */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Product Architecture</h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Designed for High-Consequence Workflows
            </p>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
              Say goodbye to information silos. CosAI runs intelligent micro-agents behind the scenes to synthesize communications and prepare your daily actions.
            </p>
          </div>

          {/* Bento Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-[250px] md:auto-rows-[280px]">
            
            {/* CARD 1: Unified Daily Briefing (Double Width, Double Height) */}
            <div className="md:col-span-2 md:row-span-2 rounded-3xl border border-zinc-800/80 bg-zinc-950/40 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700/60 transition-all duration-300">
              <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/5 rounded-full blur-[80px] pointer-events-none -z-10 group-hover:bg-violet-500/10 transition-colors duration-300"></div>
              
              <div>
                <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-medium inline-block mb-4">
                  Flagship Feature
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Unified Morning Digest</h3>
                <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mb-6">
                  Instead of checking 4 apps, wake up to one beautifully curated briefing. CosAI groups related conversations across Outlook, Telegram, and Gmail so you read them in context.
                </p>

                {/* Mock UI illustration for Digest */}
                <div className="rounded-xl border border-zinc-900 bg-black/60 p-4 font-mono text-xs text-zinc-400 max-w-md">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">TODAY'S TOP CORRELATION (Gmail + Telegram)</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      💡 <span className="font-bold text-white">Project Artemis Reschedule:</span>
                    </p>
                    <p className="text-[10px] pl-4 text-zinc-400 leading-relaxed">
                      - <span className="text-red-400">Gmail:</span> Client requested timeline delay of 2 days due to server migration. <br />
                      - <span className="text-sky-400">Telegram:</span> Lead dev confirmed database updates are already prepared for Wednesday. <br />
                      - <span className="text-emerald-400">Action:</span> Re-allocated standup scheduled for Wednesday 10 AM.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-violet-400">
                <span>Explore correlations engine</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>

            {/* CARD 2: Smart Reminders (Single Width, Single Height) */}
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/40 p-6 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700/60 transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none -z-10"></div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Zero-Click Reminders</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  "Let's catch up on Friday" in a chat is automatically extracted, cross-referenced with your calendar, and prepared as a pending reminder.
                </p>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">CALENDAR AUTO-SYNC ENABLED</span>
            </div>

            {/* CARD 3: Intelligent Reply Drafting (Single Width, Single Height) */}
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/40 p-6 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700/60 transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none -z-10"></div>
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Voice Matching Replies</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Replies are pre-drafted based on your historic messaging styles. They match your polite formality or concise execution perfectly.
                </p>
              </div>
              <span className="text-[10px] text-indigo-400 font-mono">ADAPTIVE LEARNING ACTIVE</span>
            </div>

            {/* CARD 4: Interactive Compression Slider (Single Width, Single Height) */}
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/40 p-6 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700/60 transition-all duration-300">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-2">Message Compression</span>
                <h3 className="text-lg font-bold text-white mb-2">Dynamic Summaries</h3>
                <p className="text-zinc-400 text-xs mb-4">
                  Slide to adjust the compression depth of long threads and group conversations.
                </p>
                
                {/* Interactive Slider representation */}
                <div className="space-y-2 bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>Verbose</span>
                    <span className="text-violet-400 font-bold">{compressionRatio}% Compressed</span>
                    <span>Bullet Digest</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="95" 
                    value={compressionRatio} 
                    onChange={(e) => setCompressionRatio(Number(e.target.value))}
                    className="w-full accent-violet-500 cursor-ew-resize bg-zinc-800 h-1 rounded-lg"
                  />
                  <p className="text-[9px] text-zinc-500 font-mono truncate">
                    {compressionRatio > 70 
                      ? "• Staging crashed (Elena fixed). Migration is Thursday. Standup @ Wednesday."
                      : compressionRatio > 40
                      ? "• Docker staging env crashed due to missing PORT.Elena fixed with patch #109. Defer migration to Thursday."
                      : "• Elena resolved the staging environment server crash caused by a missing PORT environment variable. Elena merged patch #109 to bring it back live."
                    }
                  </p>
                </div>
              </div>
              <span className="text-[9px] text-zinc-500">DRAG SLIDER TO TEST DEPTHTHRESHOLD</span>
            </div>

            {/* CARD 5: Privacy Shield (Double Width, Single Height) */}
            <div className="md:col-span-2 rounded-3xl border border-zinc-800/80 bg-zinc-950/40 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700/60 transition-all duration-300">
              <div className="absolute inset-y-0 right-0 w-80 bg-gradient-to-l from-emerald-500/5 to-transparent rounded-r-3xl pointer-events-none -z-10"></div>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Enterprise-Grade Privacy Vault
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm max-w-xl">
                    We do not sell, store, or train standard AI models on your private communications. You can enforce a custom retention period, and all data decays automatically based on your compliance guidelines.
                  </p>
                </div>
                
                <div className="flex gap-2 items-center bg-emerald-950/10 border border-emerald-900/30 px-3.5 py-2 rounded-xl text-xs text-emerald-400 font-bold shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  SOC-2 COMPLIANT
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-900 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-zinc-500 font-mono">
                <span>AES-256 ENCRYPTION</span>
                <span>•</span>
                <span>ZERO RETENTION STORAGE</span>
                <span>•</span>
                <span>BYOK (BRING YOUR OWN KEY) SUPPORT</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. INTEGRATIONS DIRECTORY */}
      <section id="integrations" className="py-20 bg-zinc-950/20 border-y border-zinc-900 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Integrations</h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Your Entire Stack, Synchronized
            </p>
            <p className="text-zinc-400 text-sm sm:text-base">
              CosAI integrates natively with the tools you use daily. Setup takes less than 60 seconds with no complex configuration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Gmail Integration Card */}
            <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-900/20 hover:border-red-500/20 hover:bg-red-950/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Gmail</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Reads incoming mail, extracts scheduling parameters, auto-drafts replies, and correlates attachments.
              </p>
              <span className="text-[10px] font-bold text-red-400 bg-red-950/20 border border-red-500/20 px-2 py-0.5 rounded">
                OAuth 2.0 Verified
              </span>
            </div>

            {/* WhatsApp Integration Card */}
            <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-900/20 hover:border-emerald-500/20 hover:bg-emerald-950/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.76.46 3.42 1.25 4.89l-1.3 4.79 4.9-1.28c1.42.77 3.03 1.21 4.76 1.21 5.52 0 10.004-4.48 10.004-10.004C21.608 6.48 17.124 2 12.004 2zm5.72 13.06c-.25.7-1.42 1.3-1.95 1.38-.5.08-1.15.1-3.34-.8-2.8-1.15-4.6-4-4.74-4.2-.14-.17-1.12-1.5-1.12-2.84 0-1.35.7-2 1-2.3.24-.26.63-.38.98-.38.12 0 .23 0 .32.02.28.01.42.03.6.45.23.56.78 1.9.85 2.05.07.15.12.33.02.53-.1.2-.15.3-.3.48-.15.18-.3.3-.43.46-.15.15-.3.32-.13.6.17.3.75 1.25 1.6 2.03.95.83 1.76 1.08 2.07 1.23.3.15.47.13.65-.08.18-.2.8-1 1.02-1.33.08-.12.16-.1.28-.05.12.05.78.37 1.44.7.67.33 1.1.5 1.2.68.1.18.1 1.05-.15 1.75z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">WhatsApp</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Listens to group threads or direct chats. Pulls actions, schedules coffee, alerts on task delegation requests.
              </p>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded">
                Cloud API Secure
              </span>
            </div>

            {/* Telegram Integration Card */}
            <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-900/20 hover:border-sky-500/20 hover:bg-sky-950/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.12.82-1.88 8.16-2.24 9.7-.15.65-.4 1.15-.66 1.17-.56.05-1-.38-1.54-.73-.85-.55-1.33-.9-2.16-1.45-1-.62-.35-1.07.22-1.66.15-.15 2.7-2.48 2.75-2.7.01-.03.01-.15-.06-.21-.07-.06-.17-.04-.25-.02-.11.02-1.92 1.2-5.4 3.52-.5.35-.97.52-1.39.51-.47-.01-1.37-.27-2.04-.49-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.03-.75 4.02-1.75 6.7-2.9 8.04-3.46 3.82-1.6 4.62-1.88 5.14-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07 0 .15-.02.21z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Telegram</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Monitors high-volume developers channels and crypto signals. Groups and summarizes multi-user debates.
              </p>
              <span className="text-[10px] font-bold text-sky-400 bg-sky-950/20 border border-sky-500/20 px-2 py-0.5 rounded">
                E2EE Optional
              </span>
            </div>

            {/* Outlook Integration Card */}
            <div className="p-6 rounded-2xl border border-zinc-850 bg-zinc-900/20 hover:border-blue-500/20 hover:bg-blue-950/5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Outlook</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Syncs corporate email servers, calendars, and contacts. Detects corporate task deadlines and triggers notifications.
              </p>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-950/20 border border-blue-500/20 px-2 py-0.5 rounded">
                Graph API Secure
              </span>
            </div>

          </div>

          <div className="mt-12 text-center">
            <span className="text-xs text-zinc-500 font-mono">
              Coming in Q3: Slack • Discord • Notion Workspace • Apple iMessage • Zoom transcripts
            </span>
          </div>

        </div>
      </section>

      {/* 6. PRICING SECTION */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Pricing Plans</h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Simple, Transparent Pricing
            </p>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
              Start for free, upgrade as you scale. All plans are backed by our zero-data retention promise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Free Tier */}
            <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950/40 flex flex-col justify-between hover:border-zinc-700/60 transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold text-zinc-200 mb-2">Sandbox</h3>
                <p className="text-xs text-zinc-500 mb-6">Perfect for evaluating capabilities and local usage.</p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-zinc-500">/ forever</span>
                </div>
                <div className="border-t border-zinc-900 pt-6 space-y-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Connect 2 channels (Gmail + 1 other)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>100 AI processing actions / month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic summary cards</span>
                  </div>
                  <div className="text-zinc-600 line-through flex items-center gap-3">
                    <svg className="w-4 h-4 text-zinc-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Custom writing voice matching</span>
                  </div>
                </div>
              </div>
              <button className="mt-8 w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-850 hover:text-white transition-all">
                Start Free Trial
              </button>
            </div>

            {/* Pro Tier (Popular) */}
            <div className="p-8 rounded-3xl border-2 border-violet-500 bg-zinc-950/80 flex flex-col justify-between relative shadow-2xl shadow-violet-500/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-500 text-white text-[10px] font-bold tracking-widest uppercase">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Chief Pro</h3>
                <p className="text-xs text-violet-300 mb-6">Built for founders, managers, and power professionals.</p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$19</span>
                  <span className="text-xs text-zinc-500">/ month</span>
                </div>
                <div className="border-t border-zinc-800 pt-6 space-y-4 text-xs text-zinc-300">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Connect UNLIMITED channels</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited AI summaries & correlations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Adaptive personal writing voice model</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-violet-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Priority background index (15s latency)</span>
                  </div>
                </div>
              </div>
              <button className="mt-8 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-500/20 transition-all">
                Get Started
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-950/40 flex flex-col justify-between hover:border-zinc-700/60 transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold text-zinc-200 mb-2">HQ Enterprise</h3>
                <p className="text-xs text-zinc-500 mb-6">Designed for secure organizations with custom policies.</p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$49</span>
                  <span className="text-xs text-zinc-500">/ user / mo</span>
                </div>
                <div className="border-t border-zinc-900 pt-6 space-y-4 text-xs text-zinc-400">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Everything in Pro tier</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>On-Premise / Local LLM hosting support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>SAML Single Sign-On (SSO) & Audit Logs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Dedicated account success representative</span>
                  </div>
                </div>
              </div>
              <button className="mt-8 w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-300 hover:text-white font-bold text-xs transition-all">
                Contact Sales
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="py-20 md:py-32 border-t border-zinc-900 bg-zinc-950/20">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">Answers</h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl border border-zinc-850 bg-zinc-900/10 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-sm sm:text-base text-zinc-200 hover:text-white transition-colors duration-200"
                  >
                    <span>{faq.question}</span>
                    <svg 
                      className={`w-5 h-5 text-zinc-500 transition-transform duration-300 shrink-0 ml-4 ${isOpen ? "rotate-180 text-violet-400" : ""}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div 
                    className={`transition-all duration-350 ease-in-out ${
                      isOpen ? "max-h-[300px] border-t border-zinc-900" : "max-h-0"
                    } overflow-hidden`}
                  >
                    <p className="px-6 py-5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. FOOTER SECTION */}
      <footer className="border-t border-zinc-900 bg-[#030303] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            
            {/* Footer Left: Branding */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                  <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span className="font-bold text-lg text-white tracking-tight">CosAI</span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed max-w-sm mb-6">
                CosAI is the first unified context-aware digital chief of staff, linking personal messaging and enterprise workspaces into a secure workspace of intelligence.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-4">
                <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.478-10-10-10z" clipRule="evenodd"/></svg>
                </a>
              </div>
            </div>

            {/* Footer Middle Links */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
              
              <div>
                <h4 className="font-bold text-zinc-200 mb-4 tracking-wider uppercase">Product</h4>
                <ul className="space-y-2.5 text-zinc-500">
                  <li><a href="#features" className="hover:text-zinc-300 transition-colors">Features</a></li>
                  <li><a href="#sandbox" className="hover:text-zinc-300 transition-colors">Interactive Demo</a></li>
                  <li><a href="#integrations" className="hover:text-zinc-300 transition-colors">Integrations</a></li>
                  <li><a href="#pricing" className="hover:text-zinc-300 transition-colors">Pricing Plans</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-zinc-200 mb-4 tracking-wider uppercase">Company</h4>
                <ul className="space-y-2.5 text-zinc-500">
                  <li><a href="#" className="hover:text-zinc-300 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-zinc-300 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-zinc-300 transition-colors">Privacy Vault Policy</a></li>
                  <li><a href="#" className="hover:text-zinc-300 transition-colors">Security Audit Report</a></li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <h4 className="font-bold text-zinc-200 mb-4 tracking-wider uppercase">Contact</h4>
                <p className="text-zinc-500 leading-relaxed mb-3">
                  Questions? Reach out to support or schedule a demo call.
                </p>
                <a href="mailto:support@cosai.com" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">
                  support@cosai.com
                </a>
              </div>

            </div>

          </div>

          {/* Footer Bottom copyright */}
          <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
            <span>© {new Date().getFullYear()} CosAI Inc. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-zinc-400 transition-colors">Cookie Controls</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
