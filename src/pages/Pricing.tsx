import { Check, Shield, Star, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export const Pricing = () => {
  const plans = [
    {
      name: "Free Plan",
      price: "₹0",
      desc: "For small families starting their journey.",
      icon: Shield,
      features: [
        "Up to 20 Family Members",
        "100MB Secure Storage",
        "Basic Family Tree",
        "Standard Support",
        "Role-Based Access (Basic)"
      ],
      cta: "Get Started",
      highlight: false
    },
    {
      name: "Premium Plan",
      price: "₹4,999",
      period: "/ year",
      desc: "Comprehensive heritage preservation for large families.",
      icon: Star,
      features: [
        "Unlimited Family Members",
        "10GB Encrypted Storage",
        "Advanced Family Tree Builder",
        "Ritual Reminder Engine",
        "Full Audit Logs",
        "Priority Support"
      ],
      cta: "Go Premium",
      highlight: true
    },
    {
      name: "NRI Plan",
      price: "$149",
      period: "/ year",
      desc: "Tailored for families living abroad preserving Asian roots.",
      icon: Globe,
      features: [
        "Everything in Premium",
        "50GB Encrypted Storage",
        "Native Village Mapping",
        "Cultural Metadata Support",
        "Multi-User Admin Roles",
        "Concierge Onboarding"
      ],
      cta: "Select NRI Plan",
      highlight: false
    }
  ];

  return (
    <div className="bg-heritage-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-serif font-bold text-heritage-900">Simple, Transparent Pricing</h1>
          <p className="mt-6 text-xl text-heritage-600 max-w-3xl mx-auto">
            Choose the plan that fits your family's needs. All plans include bank-grade security and privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-3xl border-2 p-8 flex flex-col ${
                plan.highlight ? 'border-accent shadow-xl shadow-accent/10 scale-105 relative z-10' : 'border-heritage-100 shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${plan.highlight ? 'bg-accent text-white' : 'bg-heritage-50 text-accent'}`}>
                  <plan.icon size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold text-heritage-900">{plan.name}</h3>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-serif font-bold text-heritage-900">{plan.price}</span>
                {plan.period && <span className="text-heritage-500 text-sm ml-1">{plan.period}</span>}
              </div>
              <p className="text-heritage-600 text-sm mb-8 leading-relaxed">{plan.desc}</p>
              
              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-heritage-700">
                    <Check size={18} className="text-accent shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link 
                to="/login" 
                className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
                  plan.highlight ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/20' : 'bg-heritage-50 text-heritage-900 hover:bg-heritage-100'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-heritage-500 text-sm">All prices are inclusive of taxes. Need a custom plan for a large clan? <Link to="/about" className="text-accent font-bold hover:underline">Contact us</Link>.</p>
        </div>
      </div>
    </div>
  );
};
