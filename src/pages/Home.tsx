import { Link } from "react-router-dom";
import { Shield, Users, Lock, Clock, Calendar, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export const Home = () => {
  return (
    <div className="bg-heritage-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-6"
            >
              The Gold Standard in Family Heritage
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-serif font-bold text-heritage-900 leading-tight"
            >
              Preserving Generations. <br />
              <span className="text-accent italic">Protecting Legacy.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-xl text-heritage-600 leading-relaxed"
            >
              KPSW Heritage Vault is a private, secure, and encrypted digital infrastructure designed for families to preserve their lineage, store sensitive documents, and maintain cultural continuity for the next 7 generations.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link 
                to="/login" 
                className="w-full sm:w-auto bg-accent text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
              >
                Create Your Family Vault
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/features" 
                className="w-full sm:w-auto text-heritage-600 hover:text-accent font-medium flex items-center gap-2"
              >
                Explore Features
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-heritage-50 rounded-2xl flex items-center justify-center text-accent mx-auto">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-heritage-900">Privacy First</h3>
              <p className="text-heritage-600">No public search. No social feeds. Your family data is visible only to those you invite.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-heritage-50 rounded-2xl flex items-center justify-center text-accent mx-auto">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-heritage-900">Bank-Grade Security</h3>
              <p className="text-heritage-600">AES-256 encryption at rest and signed URL access ensures your documents remain private.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-heritage-50 rounded-2xl flex items-center justify-center text-accent mx-auto">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-heritage-900">Cultural Continuity</h3>
              <p className="text-heritage-600">Maintain lineage-specific metadata like Gotra, Clan, and Native Village for future generations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-24 bg-heritage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-heritage-900">Everything your family needs</h2>
            <p className="text-heritage-600 mt-4 max-w-2xl mx-auto">A comprehensive suite of tools designed specifically for heritage preservation and secure document management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Family Tree Builder", icon: Users, desc: "Visualize your lineage with a structured hierarchical view." },
              { title: "Digital Vault", icon: Lock, desc: "Store property deeds, wills, and certificates securely." },
              { title: "Role-Based Access", icon: Shield, desc: "Assign Admin, Contributor, or Viewer roles to family members." },
              { title: "Timeline View", icon: Clock, desc: "Auto-generate chronological events of family milestones." },
              { title: "Ritual Reminders", icon: Calendar, desc: "Never miss a birth or death anniversary or family ritual." },
              { title: "Audit Logs", icon: Shield, desc: "Track every access and modification for total transparency." },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-heritage-100 shadow-sm hover:shadow-md transition-shadow">
                <f.icon className="text-accent mb-6" size={28} />
                <h4 className="text-xl font-serif font-bold text-heritage-900 mb-2">{f.title}</h4>
                <p className="text-heritage-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-accent text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold">Start your family legacy today.</h2>
          <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">Create your private vault in minutes and begin the journey of preserving your family's history.</p>
          <div className="mt-12">
            <Link 
              to="/login" 
              className="bg-white text-accent px-10 py-4 rounded-full text-lg font-bold hover:bg-heritage-50 transition-all shadow-2xl"
            >
              Create Your Family Vault
            </Link>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 border-4 border-white rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 border-4 border-white rounded-full" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-heritage-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Shield className="text-accent" size={24} />
              <span className="text-xl font-serif font-bold tracking-tight">KPSW Heritage Vault</span>
            </div>
            <div className="flex gap-8 text-sm text-heritage-400">
              <Link to="/security" className="hover:text-white">Privacy Policy</Link>
              <Link to="/security" className="hover:text-white">Terms of Service</Link>
              <Link to="/about" className="hover:text-white">Contact Us</Link>
            </div>
            <p className="text-sm text-heritage-500">© 2026 KPSW Heritage Vault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
