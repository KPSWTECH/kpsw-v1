import { useState, useEffect } from "react";
import { Plus, Search, FileText, Lock as LockIcon, Eye, Download, Trash2, Tag } from "lucide-react";
import { motion } from "motion/react";

export const Vault = ({ token, user }: { token: string, user: any }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "Property",
    access_level: "viewer"
  });

  const fetchDocuments = () => {
    fetch("/api/documents", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(setDocuments);
  };

  useEffect(fetchDocuments, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("title", formData.title);
    data.append("type", formData.type);
    data.append("access_level", formData.access_level);

    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`
      },
      body: data
    });

    if (res.ok) {
      setIsUploading(false);
      fetchDocuments();
      setFile(null);
      setFormData({
        title: "",
        type: "Property",
        access_level: "viewer"
      });
    }
  };

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase())
  );

  const getDocIcon = (type: string) => {
    switch(type) {
      case 'Property': return <Tag className="text-blue-500" />;
      case 'Will': return <LockIcon className="text-red-500" />;
      case 'Certificate': return <FileText className="text-green-500" />;
      default: return <FileText className="text-heritage-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-heritage-900">Digital Vault</h2>
          <p className="text-heritage-500">Securely store and manage sensitive family records.</p>
        </div>
        {user.role !== 'viewer' && (
          <button 
            onClick={() => setIsUploading(true)}
            className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            <Plus size={18} />
            Upload Document
          </button>
        )}
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-heritage-400" size={18} />
        <input 
          type="text"
          placeholder="Search by title or document type..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-heritage-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-heritage-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-heritage-50 border-b border-heritage-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-heritage-500 uppercase tracking-wider">Document</th>
                <th className="px-6 py-4 text-xs font-bold text-heritage-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-heritage-500 uppercase tracking-wider">Access Level</th>
                <th className="px-6 py-4 text-xs font-bold text-heritage-500 uppercase tracking-wider">Date Uploaded</th>
                <th className="px-6 py-4 text-xs font-bold text-heritage-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-heritage-100">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-heritage-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-heritage-100 rounded-lg">
                        {getDocIcon(doc.type)}
                      </div>
                      <span className="font-medium text-heritage-900">{doc.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-heritage-600">{doc.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                      doc.access_level === 'admin' ? 'bg-red-50 text-red-600' : 
                      doc.access_level === 'contributor' ? 'bg-blue-50 text-blue-600' : 
                      'bg-green-50 text-green-600'
                    }`}>
                      {doc.access_level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-heritage-500">{new Date(doc.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a 
                        href={doc.file_path} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 text-heritage-400 hover:text-accent transition-colors"
                      >
                        <Eye size={18} />
                      </a>
                      <a 
                        href={doc.file_path} 
                        download
                        className="p-2 text-heritage-400 hover:text-accent transition-colors"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDocs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-heritage-500">
                    No documents found in the vault.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isUploading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-heritage-100 flex items-center justify-between">
              <h3 className="text-xl font-serif font-bold">Upload Document</h3>
              <button onClick={() => setIsUploading(false)} className="text-heritage-400 hover:text-heritage-600">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-heritage-500 uppercase mb-1">Document Title</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2 border border-heritage-200 rounded-lg"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Property Deed - Sector 45"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-heritage-500 uppercase mb-1">Document Type</label>
                <select 
                  className="w-full px-4 py-2 border border-heritage-200 rounded-lg"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option>Property</option>
                  <option>Will</option>
                  <option>Certificate</option>
                  <option>Media</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-heritage-500 uppercase mb-1">Access Level</label>
                <select 
                  className="w-full px-4 py-2 border border-heritage-200 rounded-lg"
                  value={formData.access_level}
                  onChange={(e) => setFormData({...formData, access_level: e.target.value})}
                >
                  <option value="viewer">All Family Members (Viewer)</option>
                  <option value="contributor">Contributors & Admins Only</option>
                  <option value="admin">Admins Only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-heritage-500 uppercase mb-1">File</label>
                <input 
                  type="file" required
                  className="w-full px-4 py-2 border border-heritage-200 rounded-lg text-sm"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-6 py-2 text-heritage-600 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-accent text-white rounded-lg font-medium"
                >
                  Upload to Vault
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
