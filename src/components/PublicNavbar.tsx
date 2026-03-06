import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

export const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Features", path: "/features" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Security", path: "/security" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-heritage-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="text-accent" size={32} />
            <span className="text-2xl font-serif font-bold tracking-tight text-heritage-900">KPSW</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-sm font-medium text-heritage-600 hover:text-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-4">
              <Link to="/login" className="text-sm font-medium text-heritage-600 hover:text-accent">Login</Link>
              <Link 
                to="/login" 
                className="bg-accent text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
              >
                Create Vault
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-heritage-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-heritage-100 p-4 space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className="block text-base font-medium text-heritage-600"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-heritage-100 flex flex-col gap-4">
            <Link to="/login" className="text-base font-medium text-heritage-600" onClick={() => setIsOpen(false)}>Login</Link>
            <Link 
              to="/login" 
              className="bg-accent text-white px-5 py-3 rounded-xl text-center font-medium"
              onClick={() => setIsOpen(false)}
            >
              Create Vault
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
