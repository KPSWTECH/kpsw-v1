import { useState, useEffect } from "react";
import { Search, Clock, User, Shield } from "lucide-react";

interface AuditLog {
  id: number;
  email: string;
  action: string;
  details: string;
  created_at: string;
}

export const AuditLogs = ({ token }: { token: string }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/audit-logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-heritage-900">Audit Logs</h1>
          <p className="text-heritage-500">Track all activities within your family vault.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-heritage-400" size={18} />
          <input 
            type="text"
            placeholder="Search logs..."
            className="pl-10 pr-4 py-2 border border-heritage-200 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-accent/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-heritage-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-heritage-50 border-b border-heritage-200">
                <th className="px-6 py-4 text-xs font-bold text-heritage-500 uppercase">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-heritage-500 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-bold text-heritage-500 uppercase">Action</th>
                <th className="px-6 py-4 text-xs font-bold text-heritage-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-heritage-100">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-heritage-400">Loading logs...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-heritage-400">No logs found.</td></tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-heritage-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-heritage-600">
                        <Clock size={14} className="text-heritage-400" />
                        {new Date(log.created_at).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-heritage-900">
                        <User size={14} className="text-heritage-400" />
                        {log.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        log.action.includes('DELETE') ? 'bg-red-50 text-red-600' :
                        log.action.includes('CREATE') ? 'bg-green-50 text-green-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-heritage-600">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-heritage-100 p-6 rounded-2xl flex items-start gap-4">
        <Shield className="text-heritage-400 shrink-0" size={24} />
        <div>
          <h4 className="text-sm font-bold text-heritage-900 mb-1">Security Notice</h4>
          <p className="text-xs text-heritage-600 leading-relaxed">
            Audit logs are immutable and cannot be deleted. They provide a permanent record of all administrative and contributor actions within the KPSW Heritage Vault to ensure total accountability and security.
          </p>
        </div>
      </div>
    </div>
  );
};
