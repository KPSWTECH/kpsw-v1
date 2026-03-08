import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Members } from "./pages/Members";
import { Home } from "./pages/Home";
import { Features } from "./pages/Features";
import { Security } from "./pages/Security";
import { Pricing } from "./pages/Pricing";
import { About } from "./pages/About";
import { PublicNavbar } from "./components/PublicNavbar";

// --- Context & Types ---
interface User {
  id: number;
  mobile: string;
  role: "admin" | "contributor" | "viewer";
  familyId: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- Components ---

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Family Tree Creation", icon: Users, path: "/members" },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={toggle}
      />
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-heritage-200 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-heritage-100">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-accent">7Janam</h1>
          <p className="text-xs text-heritage-500 uppercase tracking-widest mt-1">Family Heritage Vault</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-heritage-600 rounded-lg hover:bg-heritage-50 hover:text-accent transition-colors"
            >
              <item.icon size={18} />
              {item.name}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-heritage-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
              {user?.mobile ? user.mobile[0].toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-heritage-900 truncate">{user?.mobile}</p>
              <p className="text-xs text-heritage-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-heritage-50">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-heritage-200 h-16 flex items-center justify-between px-6">
          <button className="lg:hidden text-heritage-600" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-heritage-500 bg-heritage-100 px-2 py-1 rounded">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

// --- Pages ---

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister ? { mobile, password, familyName } : { mobile, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (isRegister) {
        setIsRegister(false);
        alert("Registration successful! Please login.");
      } else {
        login(data.token, data.user);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-heritage-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-heritage-200"
      >
        <div className="p-8 text-center bg-heritage-50 border-b border-heritage-200">
          <h1 className="text-4xl font-serif font-bold text-accent">7Janam</h1>
          <p className="text-heritage-500 mt-2">Secure Family Heritage Vault</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-heritage-500 uppercase tracking-wider mb-1">Family Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-heritage-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="e.g. The Sharma Family"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-heritage-500 uppercase tracking-wider mb-1">Mobile Number</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 rounded-lg border border-heritage-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. +91 9876543210"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-heritage-500 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-heritage-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
            {isRegister ? "Create Family Vault" : "Access Vault"}
          </button>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-sm text-heritage-500 hover:text-accent transition-colors"
            >
              {isRegister ? "Already have a vault? Login" : "New family? Register as Admin"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Dashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setStats);
  }, [token]);

  if (!stats) return <div className="animate-pulse space-y-4">
    <div className="h-32 bg-white rounded-xl" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="h-24 bg-white rounded-xl" />
      <div className="h-24 bg-white rounded-xl" />
      <div className="h-24 bg-white rounded-xl" />
      <div className="h-24 bg-white rounded-xl" />
    </div>
  </div>;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-serif font-bold text-heritage-900">Welcome back, {user?.mobile}</h2>
        <p className="text-heritage-500 mt-1">Your family legacy is secure in the KPSW Heritage Vault.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-heritage-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <Users size={24} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-3xl font-serif font-bold text-heritage-900">{stats?.memberCount || 0}</p>
          <p className="text-sm text-heritage-500 font-medium">Family Members</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-heritage-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-heritage-100 flex items-center justify-between">
            <h3 className="text-lg font-serif font-bold">Recent Activity</h3>
          </div>
          <div className="divide-y divide-heritage-100">
            {stats?.recentLogs?.map((log: any) => (
              <div key={log.id} className="p-4 flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-heritage-900">{log.action.replace(/_/g, ' ')}</p>
                    <span className="text-[10px] text-heritage-400">by {log.mobile || log.email || 'User'}</span>
                  </div>
                  <p className="text-xs text-heritage-500">{log.details}</p>
                  <p className="text-[10px] text-heritage-400 mt-1 uppercase tracking-wider">{new Date(log.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {(!stats?.recentLogs || stats.recentLogs.length === 0) && (
              <div className="p-4 text-sm text-heritage-500">No recent activity</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-heritage-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-heritage-100">
            <h3 className="text-lg font-serif font-bold">Quick Actions</h3>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <Link to="/members" className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-heritage-100 hover:border-accent hover:bg-heritage-50 transition-all group col-span-2">
              <Users className="text-heritage-400 group-hover:text-accent" />
              <span className="text-sm font-medium">Create Family Tree</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("kpsw_token");
    const savedUser = localStorage.getItem("kpsw_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("kpsw_token", newToken);
    localStorage.setItem("kpsw_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("kpsw_token");
    localStorage.removeItem("kpsw_user");
    window.location.href = "/";
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, user } = useAuth();
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const MainContent = () => {
  const { token, user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/features" element={<PublicLayout><Features /></PublicLayout>} />
        <Route path="/security" element={<PublicLayout><Security /></PublicLayout>} />
        <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/members" element={<PrivateRoute><Members token={token!} /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
