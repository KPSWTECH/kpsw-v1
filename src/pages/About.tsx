import { Shield, Users, Heart, Globe } from "lucide-react";

export const About = () => {
  return (
    <div className="bg-heritage-50">
      {/* Vision Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest mb-6"
              >
                Our Vision
              </motion.span>
              <h1 className="text-5xl font-serif font-bold text-heritage-900 leading-tight">
                Preserving the past to <br />
                <span className="text-accent italic">empower the future.</span>
              </h1>
              <p className="mt-8 text-xl text-heritage-600 leading-relaxed">
                KPSW Heritage Vault was born out of a simple but profound realization: in our rapidly digitizing world, family history and sensitive legacy documents are becoming increasingly fragmented and vulnerable.
              </p>
              <p className="mt-6 text-lg text-heritage-500 leading-relaxed">
                We are building the digital infrastructure for family continuity. Our mission is to provide every family with a secure, private, and permanent "bank vault" for their heritage, ensuring that the stories, documents, and values of today are preserved for the next 7 generations.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-white rounded-3xl border border-heritage-100 shadow-2xl p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
                    <Heart size={48} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-heritage-900">7 Generations</h3>
                  <p className="text-heritage-500 mt-2">Our commitment to continuity.</p>
                </div>
              </div>
              {/* Floating Accents */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-heritage-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Cultural Preservation", icon: Globe, desc: "We believe in the importance of maintaining Asian heritage, lineage, and cultural roots in a globalized world." },
              { title: "Privacy as a Right", icon: Shield, desc: "Family data is sacred. We believe privacy is not a feature, but a fundamental right that must be protected by design." },
              { title: "Long-term Continuity", icon: Users, desc: "We don't build for the next quarter; we build for the next century. Our systems are designed for multi-generational use." },
            ].map((v, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 bg-heritage-50 rounded-2xl flex items-center justify-center text-accent mx-auto">
                  <v.icon size={32} />
                </div>
                <h3 className="text-xl font-serif font-bold text-heritage-900">{v.title}</h3>
                <p className="text-heritage-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-heritage-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-heritage-900 mb-6">Get in Touch</h2>
          <p className="text-heritage-600 mb-12">Have questions about setting up your family vault? Our heritage consultants are here to help.</p>
          <div className="bg-white p-8 rounded-3xl border border-heritage-100 shadow-sm space-y-6">
            <div className="flex items-center justify-center gap-3 text-heritage-900 font-medium">
              <Shield className="text-accent" size={20} />
              support@kpswvault.com
            </div>
            <p className="text-sm text-heritage-500">Based in New Delhi, India. Serving families globally.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

import { motion } from "motion/react";
