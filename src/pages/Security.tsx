import { Shield, Lock, EyeOff, UserCheck, Key, Server } from "lucide-react";

export const Security = () => {
  const securityFeatures = [
    {
      title: "AES-256 Encryption at Rest",
      icon: Lock,
      desc: "All files and sensitive data stored in the KPSW Heritage Vault are encrypted using industry-standard AES-256 encryption. Even in the unlikely event of a data breach, your information remains unreadable without the decryption keys."
    },
    {
      title: "Secure Cloud Storage",
      icon: Server,
      desc: "We utilize world-class cloud infrastructure with multi-region redundancy. Your documents are stored across multiple secure data centers to ensure 99.99% durability and availability."
    },
    {
      title: "No Public Search",
      icon: EyeOff,
      desc: "Unlike social media or public genealogy sites, KPSW Heritage Vault is invisible to search engines and the public. Your family vault is a private island, accessible only to those you explicitly invite."
    },
    {
      title: "Invite-Only Access",
      icon: UserCheck,
      desc: "Access to a family vault is strictly controlled by the Family Admin. New members can only join via a secure invitation link, ensuring that only verified family members gain access."
    },
    {
      title: "Role-Based Permissions",
      icon: Shield,
      desc: "Granular control at the user and document level. Admins can restrict specific sensitive documents (like Wills or Property Deeds) to themselves while allowing other members to view general family history."
    },
    {
      title: "Signed URL Access",
      icon: Key,
      desc: "Documents are never directly exposed via a public URL. We use time-limited, cryptographically signed URLs for every file access, ensuring that links cannot be shared or reused outside of a secure session."
    }
  ];

  return (
    <div className="bg-heritage-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Shield size={14} />
            Bank-Grade Security
          </motion.div>
          <h1 className="text-5xl font-serif font-bold text-heritage-900">Security & Privacy</h1>
          <p className="mt-6 text-xl text-heritage-600 max-w-3xl mx-auto">
            Your family's history and documents are your most precious assets. We protect them with the same rigor as a financial institution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-heritage-100 shadow-sm">
              <div className="w-12 h-12 bg-heritage-50 rounded-xl flex items-center justify-center text-accent mb-6">
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-heritage-900 mb-4">{f.title}</h3>
              <p className="text-heritage-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 bg-heritage-900 text-white p-12 rounded-3xl border border-heritage-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Our Commitment to Privacy</h2>
              <div className="space-y-4 text-heritage-400">
                <p>KPSW Heritage Vault was founded on the principle that family history is private. We do not sell your data, we do not use it for advertising, and we do not allow third-party tracking.</p>
                <p>Your data belongs to your family. We are simply the custodians of the infrastructure that keeps it safe for the next 7 generations.</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full border-8 border-accent/20 flex items-center justify-center relative">
                <Shield size={64} className="text-accent" />
                <div className="absolute inset-0 border-4 border-accent rounded-full animate-ping opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { motion } from "motion/react";
