import { Check, X } from 'lucide-react';

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Basic trend monitoring for individuals.',
      features: [
        { name: 'Up to 3 basic reports', included: true },
        { name: 'Standard trend tracking', included: true },
        { name: 'Daily email alerts', included: true },
        { name: 'Export to PDF', included: false },
        { name: 'Advanced AI insights', included: false },
        { name: 'Custom data sources', included: false }
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'PRO',
      price: '$25',
      period: '/report',
      description: 'Professional insights and complete export tools.',
      features: [
        { name: 'Unlimited comprehensive reports', included: true },
        { name: 'Real-time trend tracking', included: true },
        { name: 'Instant customized alerts', included: true },
        { name: 'Export to PDF, Excel, JSON', included: true },
        { name: 'Advanced AI insights', included: true },
        { name: 'Custom data sources', included: false }
      ],
      cta: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Dedicated solutions for large research teams.',
      features: [
        { name: 'Unlimited comprehensive reports', included: true },
        { name: 'Real-time trend tracking', included: true },
        { name: 'Instant customized alerts', included: true },
        { name: 'Export to PDF, Excel, JSON', included: true },
        { name: 'Advanced AI insights', included: true },
        { name: 'Custom data sources integrations', included: true }
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 lg:px-8 z-10 relative transition-colors">
      <div className="mb-16 text-center border-b border-gray-200 dark:border-slate-800 pb-12 relative flex flex-col items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none transition-colors"></div>
        <div className="relative z-10 max-w-2xl">
           <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">Simple, transparent pricing</h2>
           <p className="text-xl text-gray-600 dark:text-gray-400">Unlock expert-level market analysis and accelerate your research from months to minutes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className={`relative bg-white dark:bg-slate-900/50 rounded-3xl p-8 border ${plan.popular ? 'border-amber-500 shadow-xl shadow-amber-500/10 md:-translate-y-4' : 'border-gray-200 dark:border-slate-800 shadow-sm'} transition-all flex flex-col`}>
             {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md z-20">
                   Most Popular
                </div>
             )}
             
             <div className="mb-8 relative z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm h-10">{plan.description}</p>
             </div>
             
             <div className="mb-8 relative z-10">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                {plan.period && <span className="text-gray-500 dark:text-gray-400 font-medium"> {plan.period}</span>}
             </div>
             
             <button className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm mb-8 transition-colors ${plan.popular ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/20' : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700'}`}>
                {plan.cta}
             </button>

             <ul className="space-y-4 flex-1 relative z-10">
                {plan.features.map((feature, j) => (
                   <li key={j} className="flex items-start gap-3 text-sm">
                      {feature.included ? (
                         <Check className="w-5 h-5 text-green-500 dark:text-green-400 shrink-0" />
                      ) : (
                         <X className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-400 dark:text-gray-500'}>{feature.name}</span>
                   </li>
                ))}
             </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
