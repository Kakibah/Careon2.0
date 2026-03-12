'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  Zap, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  CreditCard,
  Sparkles,
  Clock,
  FileText,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';

const PricingTier = ({ 
  name, 
  price, 
  description, 
  features, 
  cta, 
  onClick,
  highlighted = false, 
  badge = "" 
}: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`relative flex flex-col p-8 rounded-[2.5rem] border transition-all duration-300 ${
      highlighted 
        ? 'bg-slate-900 text-white border-slate-800 shadow-2xl shadow-emerald-900/20 scale-105 z-10' 
        : 'bg-white text-slate-900 border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-100'
    }`}
  >
    {badge && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
        {badge}
      </div>
    )}
    
    <div className="mb-8">
      <h3 className={`text-xl font-bold mb-2 ${highlighted ? 'text-emerald-400' : 'text-slate-900'}`}>{name}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-4xl font-black">{price}</span>
      </div>
      <p className={`text-sm leading-relaxed ${highlighted ? 'text-slate-400' : 'text-slate-500'}`}>
        {description}
      </p>
    </div>

    <ul className="space-y-4 mb-10 flex-grow">
      {features.map((feature: string, i: number) => (
        <li key={i} className="flex items-start gap-3">
          <div className={`mt-1 shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${highlighted ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
            <Check className={`w-3 h-3 ${highlighted ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <span className={`text-sm font-medium ${highlighted ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
        </li>
      ))}
    </ul>

    <button 
      onClick={onClick}
      className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
      highlighted 
        ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' 
        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
    }`}>
      {cta}
      <ArrowRight className="w-4 h-4" />
    </button>
  </motion.div>
);

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

  const handleSelect = () => {
    // Simulate purchase and redirect back to roadmap
    router.push('/');
  };

  const tiers = [
    {
      name: "Basic Plan",
      price: "Free",
      description: "Perfect for exploring your initial options and getting a feel for your career trajectory.",
      features: [
        "Limited career path suggestions (2 paths)",
        "Basic skill roadmap",
        "Community access",
        "Public resource library"
      ],
      cta: "Get Started for Free",
      onClick: handleSelect
    },
    {
      name: "Career Pro",
      price: billingCycle === 'monthly' ? "€5/mo" : "€48/yr",
      description: "A comprehensive, deep-dive analysis for those ready to commit to a specific direction.",
      badge: "Best Value",
      highlighted: true,
      features: [
        "Full 5 career paths",
        "Detailed 12-month skill roadmap",
        "Internship strategy & target companies",
        "3 custom project ideas",
        "Interactive Career Galaxy access",
        "Downloadable PDF Report"
      ],
      cta: "Get Your Career Report",
      onClick: handleSelect
    },
    {
      name: "Premium Elite",
      price: billingCycle === 'monthly' ? "€10/mo" : "€96/yr",
      description: "Continuous growth and evolution. We update your path as the market and your skills change.",
      features: [
        "Unlimited career reports",
        "Real-time skill tracking dashboard",
        "AI Resume & Cover Letter generator",
        "Updated roadmaps every 3 months",
        "Priority AI support",
        "Interview prep simulator"
      ],
      cta: "Start Premium Subscription",
      onClick: handleSelect
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Compass className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Careon</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">Navigator</Link>
            <Link href="/pricing" className="text-sm font-bold text-emerald-600">Pricing</Link>
            <Link href="/" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-3 h-3" />
          Invest in your future
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6">
          Careon – Your AI <span className="text-emerald-600">Career Navigator</span>
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-12">
          Stop guessing and start growing. Get precision career roadmaps and expert guidance tailored to your unique potential.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-7 bg-slate-200 rounded-full p-1 relative transition-colors hover:bg-slate-300"
          >
            <motion.div 
              animate={{ x: billingCycle === 'monthly' ? 0 : 28 }}
              className="w-5 h-5 bg-emerald-600 rounded-full shadow-md"
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>Yearly</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-md">Save 20%</span>
          </div>
        </div>
      </header>

      {/* Pricing Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <PricingTier key={idx} {...tier} />
          ))}
        </div>

        {/* Add-ons */}
        <section className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Optional Add-ons</h2>
            <p className="text-slate-500">Specific tools for specific milestones.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-emerald-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Interview Prep Guide</h4>
                  <p className="text-xs text-slate-500">Master the most common industry questions.</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-slate-900">€9.00</span>
                <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700">Add to cart</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-emerald-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Monthly Career Updates</h4>
                  <p className="text-xs text-slate-500">Stay ahead with market trend alerts.</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-slate-900">€4/mo</span>
                <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700">Add to cart</button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-32 max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500">Everything you need to know about our plans and billing.</p>
          </div>
          <div className="space-y-6">
            {[
              {
                q: "Can I cancel my subscription at any time?",
                a: "Yes, you can cancel your subscription at any time from your account settings. Your access will remain active until the end of the current billing period."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal through our secure payment processor, Stripe."
              },
              {
                q: "Is there a discount for yearly billing?",
                a: "Yes! By choosing the yearly billing cycle, you save 20% compared to the monthly plan. The discount is automatically applied when you select Yearly."
              },
              {
                q: "Can I upgrade or downgrade my plan later?",
                a: "Absolutely. You can change your plan at any time. Upgrades are pro-rated and take effect immediately, while downgrades take effect at the start of your next billing cycle."
              }
            ].map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-100 transition-colors"
              >
                <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="mt-32 bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,#10b98122,transparent)]" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Your Success, Secured.</h2>
            <p className="text-slate-400 mb-8">
              We use industry-standard encryption and data-driven insights to ensure your career data is private and your roadmap is accurate.
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
              <div className="flex items-center gap-2 text-white font-bold">
                <Star className="w-4 h-4 fill-white" /> Trustpilot
              </div>
              <div className="flex items-center gap-2 text-white font-bold">
                <FileText className="w-4 h-4" /> ISO 27001
              </div>
              <div className="flex items-center gap-2 text-white font-bold">
                <CreditCard className="w-4 h-4" /> Stripe Verified
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Compass className="text-emerald-600 w-5 h-5" />
            <span className="font-bold text-lg tracking-tight">Careon</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 Careon AI Career Navigator. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest">Terms</a>
            <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
