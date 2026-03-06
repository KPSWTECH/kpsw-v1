import { Link } from "react-router-dom";
import { UserPlus, Users, Lock, Shield, Clock, ArrowRight } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      title: "Create Family Vault",
      icon: UserPlus,
      desc: "Register as a Family Admin and create your private family vault. This is the foundation of your digital heritage infrastructure.",
      details: "Set up your family name and secure your account with bank-grade encryption."
    },
    {
      title: "Add Members",
      icon: Users,
      desc: "Begin building your family tree. Add members with detailed profiles, including DOB, DOD, Native Village, and Gotra/Clan.",
      details: "Map relationships to visualize your lineage across generations."
    },
    {
      title: "Upload Documents",
      icon: Lock,
      desc: "Securely upload sensitive family records like property deeds, wills, and certificates to the Digital Vault.",
      details: "Tag documents for easy retrieval and set access levels for each file."
    },
    {
      title: "Assign Roles",
      icon: Shield,
      desc: "Invite other family members and assign roles. Control who can edit, view, or manage specific documents.",
      details: "Ensure total privacy and accountability with role-based access control."
    },
    {
      title: "Preserve & Protect",
      icon: Clock,
      desc: "Your family legacy is now secured. Receive ritual reminders, view historical timelines, and monitor audit logs.",
      details: "A living legacy that grows with your family for the next 7 generations."
    }
  ];

  return (
    <div className="bg-heritage-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-serif font-bold text-heritage-900">How It Works</h1>
          <p className="mt-6 text-xl text-heritage-600 max-w-3xl mx-auto">
            A simple, secure process to preserve your family's history and protect your most important records.
          </p>
        </div>

        <div className="relative space-y-24">
          {/* Vertical Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-heritage-200 -translate-x-1/2" />

          {steps.map((step, i) => (
            <div key={i} className={`flex flex-col lg:flex-row items-center gap-12 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-16 h-16 bg-accent text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-accent/20 relative z-10">
                  <step.icon size={32} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-heritage-900 mb-4">{step.title}</h3>
                <p className="text-lg text-heritage-600 leading-relaxed max-w-md">{step.desc}</p>
                <p className="mt-4 text-sm text-heritage-500 italic">{step.details}</p>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="w-full max-w-md aspect-video bg-white rounded-3xl border border-heritage-100 shadow-sm flex items-center justify-center text-heritage-200">
                  <step.icon size={64} className="opacity-20" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 text-center bg-white p-12 rounded-3xl border border-heritage-100 shadow-sm">
          <h2 className="text-3xl font-serif font-bold text-heritage-900 mb-6">Ready to begin your legacy?</h2>
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 bg-accent text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-accent/90 transition-all shadow-xl shadow-accent/20"
          >
            Create Your Family Vault
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};
