import { Shield, Users, Lock, Clock, Calendar, Search, FileText, UserPlus } from "lucide-react";

export const Features = () => {
  const features = [
    {
      title: "Family Tree Builder",
      icon: Users,
      desc: "Visualize your lineage with a structured hierarchical view. Add members, map relationships (parent-child, spouse), and maintain deep cultural metadata for every individual.",
      details: ["Graph-based visualization", "Relationship mapping", "Cultural metadata (Gotra, Clan)", "Profile photos"]
    },
    {
      title: "Digital Vault",
      icon: Lock,
      desc: "A secure, encrypted repository for your family's most sensitive documents. Store property deeds, wills, birth certificates, and historical media with total peace of mind.",
      details: ["AES-256 encryption", "Document tagging", "PDF & Image support", "Signed URL access"]
    },
    {
      title: "Role-Based Access",
      icon: Shield,
      desc: "Granular control over who sees what. Assign roles like Admin, Contributor, or Viewer to ensure sensitive documents are only accessible to authorized family members.",
      details: ["Admin: Full control", "Contributor: Add/Edit", "Viewer: Read-only", "Document-level restrictions"]
    },
    {
      title: "Timeline View",
      icon: Clock,
      desc: "Automatically generate a chronological journey of your family's history. From births and marriages to significant milestones, see your legacy unfold over time.",
      details: ["Auto-event generation", "Custom milestones", "Historical journey", "Visual storytelling"]
    },
    {
      title: "Ritual Reminder Engine",
      icon: Calendar,
      desc: "Never miss an important family date. Our engine automatically tracks birth, death, and marriage anniversaries, sending reminders for rituals and celebrations.",
      details: ["Anniversary tracking", "Ritual alerts", "Custom reminders", "Family-wide notifications"]
    },
    {
      title: "Audit Logs",
      icon: Search,
      desc: "Total transparency and accountability. Track every document upload, member edit, and permission change with a detailed, immutable audit trail.",
      details: ["Access tracking", "Modification history", "Security monitoring", "Admin oversight"]
    }
  ];

  return (
    <div className="bg-heritage-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-serif font-bold text-heritage-900">Features built for legacy.</h1>
          <p className="mt-6 text-xl text-heritage-600 max-w-3xl mx-auto">
            KPSW Heritage Vault combines bank-grade security with intuitive family management tools to provide a complete digital infrastructure for your family.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-3xl border border-heritage-100 shadow-sm flex flex-col md:flex-row gap-8">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shrink-0">
                <f.icon size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-heritage-900 mb-4">{f.title}</h3>
                <p className="text-heritage-600 leading-relaxed mb-6">{f.desc}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {f.details.map((d, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-heritage-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
