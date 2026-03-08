import { useState, useEffect, useMemo } from "react";
import { Plus, Search, User, MapPin, Calendar, Info, Network, List as ListIcon, Download } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Members = ({ token }: { token: string }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree");
  const [formData, setFormData] = useState({
    full_name: "",
    dob: "",
    dod: "",
    marriage_anniversary: "",
    gender: "Male",
    native_village: "",
    gotra: "",
    bio: "",
    parentId: "",
    spouseId: ""
  });

  const fetchData = async () => {
    try {
      const [memRes, relRes] = await Promise.all([
        fetch("/api/members", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/relationships", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const membersData = await memRes.json();
      const relData = relRes.ok ? await relRes.json() : [];
      setMembers(membersData);
      setRelationships(relData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchData() }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        const newMemberId = data.id;

        // Create Relationships
        if (formData.parentId) {
          await fetch("/api/relationships", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ member_id: newMemberId, relative_id: formData.parentId, type: "parent" })
          });
        }
        if (formData.spouseId) {
          await fetch("/api/relationships", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ member_id: newMemberId, relative_id: formData.spouseId, type: "spouse" })
          });
        }

        setIsAdding(false);
        fetchData();
        setFormData({
          full_name: "", dob: "", dod: "", marriage_anniversary: "",
          gender: "Male", native_village: "", gotra: "", bio: "",
          parentId: "", spouseId: ""
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ members, relationships }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "family_tree_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const filteredMembers = members.filter(m =>
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    m.native_village?.toLowerCase().includes(search.toLowerCase()) ||
    m.gotra?.toLowerCase().includes(search.toLowerCase())
  );

  // Tree Building Logic
  const treeData = useMemo(() => {
    const nodesMap = new Map();

    // Initialize nodes
    members.forEach(m => {
      nodesMap.set(m.id, { ...m, children: [], spouses: [] });
    });

    const rootNodes: any[] = [];
    const childIds = new Set();

    relationships.forEach(rel => {
      // member_id has relative_id as type
      if (rel.type === "parent") {
        const child = nodesMap.get(rel.member_id);
        const parent = nodesMap.get(rel.relative_id);
        if (child && parent) {
          parent.children.push(child);
          childIds.add(child.id);
        }
      } else if (rel.type === "child") { // inverse
        const parent = nodesMap.get(rel.member_id);
        const child = nodesMap.get(rel.relative_id);
        if (child && parent) {
          parent.children.push(child);
          childIds.add(child.id);
        }
      } else if (rel.type === "spouse") {
        const p1 = nodesMap.get(rel.member_id);
        const p2 = nodesMap.get(rel.relative_id);
        if (p1 && p2) {
          p1.spouses.push(p2);
          // prevent cyclic spouse display by simple logic handled in render
        }
      }
    });

    members.forEach(m => {
      if (!childIds.has(m.id)) {
        rootNodes.push(nodesMap.get(m.id));
      }
    });

    return rootNodes;
  }, [members, relationships]);

  const renderTree = (nodes: any[]) => {
    return (
      <div className="flex justify-center gap-8 py-8" style={{ minWidth: 'max-content' }}>
        {nodes.map(node => (
          <div key={node.id} className="flex flex-col items-center">
            {/* Card wrapper */}
            <div className="flex items-center gap-4">
              {/* Main Node */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-48 bg-white border border-heritage-200 rounded-2xl p-4 shadow-lg shadow-heritage-900/5 relative z-10"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-3 border-2 border-white shadow-sm overflow-hidden">
                  {node.photo_url ? <img src={node.photo_url} alt="" className="w-full h-full object-cover" /> : <User size={20} />}
                </div>
                <h4 className="text-center font-serif font-bold text-sm text-heritage-900 line-clamp-1">{node.full_name}</h4>
                <p className="text-center text-[10px] text-heritage-500 uppercase tracking-wider font-semibold mt-1">{node.gender}</p>
                {node.dob && <p className="text-center text-[10px] text-heritage-400 mt-1">{new Date(node.dob).getFullYear()}</p>}
              </motion.div>

              {/* Spouses */}
              {node.spouses.length > 0 && (
                <div className="flex items-center">
                  <div className="w-8 h-px bg-accent/40" />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-40 bg-accent/5 border border-accent/20 rounded-2xl p-3 shadow-md relative z-10"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mx-auto mb-2 border-2 border-white overflow-hidden">
                      {node.spouses[0].photo_url ? <img src={node.spouses[0].photo_url} alt="" className="w-full h-full object-cover" /> : <User size={16} />}
                    </div>
                    <h4 className="text-center font-serif font-bold text-xs text-heritage-900 line-clamp-1">{node.spouses[0].full_name}</h4>
                    <p className="text-center text-[9px] text-heritage-500 mt-1">Spouse</p>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Children Line & Recursive Children */}
            {node.children && node.children.length > 0 && (
              <div className="flex flex-col items-center mt-[-4px]">
                <div className="w-px h-8 bg-accent/40 relative z-0" />
                <div className="border-t-2 border-accent/40 pt-6 relative" style={{ width: `${(node.children.length - 1) * 220}px` }}>
                  {/* Vertical lines down to children handled individually */}
                  <div className="absolute top-0 flex justify-between w-full" style={{ left: 0 }}>
                    {node.children.map((_: any, i: number) => (
                      <div key={i} className="w-px h-6 bg-accent/40 mx-auto" style={{ marginLeft: i === 0 ? '0' : 'auto', marginRight: i === node.children.length - 1 ? '0' : 'auto' }} />
                    ))}
                  </div>
                </div>
                {renderTree(node.children)}
              </div>
            )}
          </div>
        ))
        }
      </div >
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-serif font-bold text-heritage-900">Family Lineage</h2>
          <p className="text-heritage-500 mt-1">Visually build and explore your multi-generational roots.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-lg border border-heritage-200 inline-flex shadow-sm">
            <button
              onClick={() => setViewMode("tree")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'tree' ? 'bg-accent/10 text-accent' : 'text-heritage-500 hover:text-heritage-900'}`}
            >
              <Network size={16} /> Tree
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-accent/10 text-accent' : 'text-heritage-500 hover:text-heritage-900'}`}
            >
              <ListIcon size={16} /> List
            </button>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white text-heritage-600 border border-heritage-200 px-4 py-2 rounded-lg font-medium hover:bg-heritage-50 transition-colors shadow-sm"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors shadow-md shadow-accent/20"
          >
            <Plus size={18} />
            Add Member
          </button>
        </div >
      </header >

      {/* Main Content Area */}
      < AnimatePresence mode="wait" >
        {viewMode === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage-400" size={18} />
              <input
                type="text"
                placeholder="Search ancestors by name, village, or gotra..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-heritage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <motion.div
                  layout
                  key={member.id}
                  className="bg-white rounded-2xl border border-heritage-200 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-24 bg-gradient-to-br from-heritage-100 to-heritage-200 relative">
                    <div className="absolute -bottom-6 left-6 w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-sm flex items-center justify-center text-accent overflow-hidden">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                  </div>
                  <div className="p-6 pt-10">
                    <h3 className="text-xl font-serif font-bold text-heritage-900 line-clamp-1">{member.full_name}</h3>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-heritage-600">
                        <Calendar size={14} className="text-accent" />
                        <span>{member.dob ? new Date(member.dob).toLocaleDateString() : 'Unknown'} {member.dod ? `- ${new Date(member.dod).toLocaleDateString()}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-heritage-600">
                        <MapPin size={14} className="text-accent" />
                        <span>{member.native_village || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-heritage-600">
                        <Info size={14} className="text-accent" />
                        <span>{member.gotra || 'Gotra not specified'}</span>
                      </div>
                    </div>
                    {member.bio && (
                      <p className="mt-4 text-xs text-heritage-500 line-clamp-3 italic leading-relaxed bg-heritage-50 p-3 rounded-lg border border-heritage-100">"{member.bio}"</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="tree"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
            className="bg-heritage-50/50 rounded-2xl border border-heritage-200 shadow-inner overflow-auto min-h-[600px] p-8 custom-scrollbar"
          >
            {members.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-heritage-400 mt-20">
                <Network size={64} className="mb-4 opacity-20" />
                <p className="text-lg font-serif">Your family tree is empty.</p>
                <p className="text-sm">Click "Add Member" to start building your legacy.</p>
              </div>
            ) : (
              renderTree(treeData)
            )}
          </motion.div>
        )}
      </AnimatePresence >

      {/* Add Member Modal */}
      {
        isAdding && (
          <div className="fixed inset-0 bg-heritage-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-heritage-100 flex items-center justify-between bg-heritage-50 shrink-0">
                <h3 className="text-2xl font-serif font-bold text-heritage-900">Add Ancestor</h3>
                <button type="button" onClick={() => setIsAdding(false)} className="text-heritage-400 hover:text-heritage-600 transition-colors bg-white p-2 rounded-full shadow-sm">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              <div className="overflow-y-auto p-6 custom-scrollbar">
                <form id="addMemberForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Core Info */}
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-4 border-b border-heritage-100 pb-2">Core details</h4>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-heritage-600 uppercase mb-1.5">Full Name *</label>
                    <input
                      type="text" required
                      className="w-full px-4 py-2.5 bg-heritage-50 border border-heritage-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                      value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-heritage-600 uppercase mb-1.5">Gender</label>
                    <select
                      className="w-full px-4 py-2.5 bg-heritage-50 border border-heritage-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                      value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-heritage-600 uppercase mb-1.5">Native Village</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-heritage-50 border border-heritage-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                      value={formData.native_village} onChange={(e) => setFormData({ ...formData, native_village: e.target.value })}
                    />
                  </div>

                  {/* Timeline */}
                  <div className="md:col-span-2 mt-4">
                    <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-4 border-b border-heritage-100 pb-2">Timeline</h4>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-heritage-600 uppercase mb-1.5">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 bg-heritage-50 border border-heritage-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-heritage-700"
                      value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-heritage-600 uppercase mb-1.5">Date of Death</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2.5 bg-heritage-50 border border-heritage-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-heritage-700"
                      value={formData.dod} onChange={(e) => setFormData({ ...formData, dod: e.target.value })}
                    />
                  </div>

                  {/* Relationships section for MVP */}
                  <div className="md:col-span-2 mt-4">
                    <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-4 border-b border-heritage-100 pb-2">Relationships</h4>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-heritage-600 uppercase mb-1.5">Parent in Tree</label>
                    <select
                      className="w-full px-4 py-2.5 bg-heritage-50 border border-heritage-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                      value={formData.parentId} onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    >
                      <option value="">-- No Parent Selected --</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.full_name}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-heritage-500 mt-1 pl-1">Link to an existing member</p>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-heritage-600 uppercase mb-1.5">Spouse in Tree</label>
                    <select
                      className="w-full px-4 py-2.5 bg-heritage-50 border border-heritage-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                      value={formData.spouseId} onChange={(e) => setFormData({ ...formData, spouseId: e.target.value })}
                    >
                      <option value="">-- No Spouse Selected --</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.full_name}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-heritage-500 mt-1 pl-1">Link to an existing member</p>
                  </div>

                  {/* Extra Details */}
                  <div className="md:col-span-2 mt-4">
                    <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-4 border-b border-heritage-100 pb-2">Additional</h4>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-heritage-600 uppercase mb-1.5">Gotra / Clan</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-heritage-50 border border-heritage-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                      value={formData.gotra} onChange={(e) => setFormData({ ...formData, gotra: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-heritage-600 uppercase mb-1.5">Biography & Memories</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2.5 bg-heritage-50 border border-heritage-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                      value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Write a brief life story..."
                    />
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-heritage-100 flex justify-end gap-3 bg-white shrink-0">
                <button
                  type="button" onClick={() => setIsAdding(false)}
                  className="px-6 py-2.5 text-heritage-600 font-bold hover:bg-heritage-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" form="addMemberForm"
                  className="px-8 py-2.5 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:bg-accent/90 hover:shadow-accent/40 hover:-translate-y-0.5 transition-all"
                >
                  Save into Vault
                </button>
              </div>
            </motion.div>
          </div>
        )
      }
    </div >
  );
};
