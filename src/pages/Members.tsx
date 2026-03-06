import { useState, useEffect } from "react";
import { Plus, Search, User, MapPin, Calendar, Info } from "lucide-react";
import { motion } from "motion/react";

export const Members = ({ token }: { token: string }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    dob: "",
    dod: "",
    marriage_anniversary: "",
    gender: "Male",
    native_village: "",
    gotra: "",
    bio: ""
  });

  const fetchMembers = () => {
    fetch("/api/members", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(setMembers);
  };

  useEffect(fetchMembers, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setIsAdding(false);
      fetchMembers();
      setFormData({
        full_name: "",
        dob: "",
        dod: "",
        marriage_anniversary: "",
        gender: "Male",
        native_village: "",
        gotra: "",
        bio: ""
      });
    }
  };

  const filteredMembers = members.filter(m => 
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    m.native_village?.toLowerCase().includes(search.toLowerCase()) ||
    m.gotra?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-heritage-900">Family Members</h2>
          <p className="text-heritage-500">Manage and view all members of your lineage.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus size={18} />
          Add Member
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-heritage-400" size={18} />
        <input 
          type="text"
          placeholder="Search by name, village, or gotra..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-heritage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <motion.div 
            layout
            key={member.id}
            className="bg-white rounded-2xl border border-heritage-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="h-24 bg-heritage-100 relative">
              <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-sm flex items-center justify-center text-accent overflow-hidden">
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.full_name} className="w-full h-full object-cover" />
                ) : (
                  <User size={32} />
                )}
              </div>
            </div>
            <div className="p-6 pt-10">
              <h3 className="text-xl font-serif font-bold text-heritage-900">{member.full_name}</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-heritage-600">
                  <Calendar size={14} className="text-heritage-400" />
                  <span>{member.dob ? new Date(member.dob).toLocaleDateString() : 'Unknown'} {member.dod ? `- ${new Date(member.dod).toLocaleDateString()}` : ''}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-heritage-600">
                  <MapPin size={14} className="text-heritage-400" />
                  <span>{member.native_village || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-heritage-600">
                  <Info size={14} className="text-heritage-400" />
                  <span>{member.gotra || 'Gotra not specified'}</span>
                </div>
              </div>
              {member.bio && (
                <p className="mt-4 text-sm text-heritage-500 line-clamp-2 italic">"{member.bio}"</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-heritage-100 flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold">Add Family Member</h3>
              <button onClick={() => setIsAdding(false)} className="text-heritage-400 hover:text-heritage-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-heritage-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2 border border-heritage-200 rounded-lg"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-heritage-500 uppercase mb-1">Date of Birth</label>
                <input 
                  type="date"
                  className="w-full px-4 py-2 border border-heritage-200 rounded-lg"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-heritage-500 uppercase mb-1">Date of Death (Optional)</label>
                <input 
                  type="date"
                  className="w-full px-4 py-2 border border-heritage-200 rounded-lg"
                  value={formData.dod}
                  onChange={(e) => setFormData({...formData, dod: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-heritage-500 uppercase mb-1">Marriage Anniversary (Optional)</label>
                <input 
                  type="date"
                  className="w-full px-4 py-2 border border-heritage-200 rounded-lg"
                  value={formData.marriage_anniversary}
                  onChange={(e) => setFormData({...formData, marriage_anniversary: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-heritage-500 uppercase mb-1">Gender</label>
                <select 
                  className="w-full px-4 py-2 border border-heritage-200 rounded-lg"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-heritage-500 uppercase mb-1">Native Village</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 border border-heritage-200 rounded-lg"
                  value={formData.native_village}
                  onChange={(e) => setFormData({...formData, native_village: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-heritage-500 uppercase mb-1">Gotra / Clan</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 border border-heritage-200 rounded-lg"
                  value={formData.gotra}
                  onChange={(e) => setFormData({...formData, gotra: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-heritage-500 uppercase mb-1">Biography</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-2 border border-heritage-200 rounded-lg"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2 text-heritage-600 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-accent text-white rounded-lg font-medium"
                >
                  Save Member
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
