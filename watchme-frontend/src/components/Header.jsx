import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Detect scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`gradient-bg text-white py-4 sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'shadow-lg backdrop-blur-lg bg-opacity-80' : 'bg-opacity-95'
    }`}>
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements with mindful styling */}
        <div className="absolute -top-6 right-12 w-16 h-16 rounded-full bg-purple-500/10 blur-xl"></div>
        <div className="absolute top-4 left-8 w-24 h-24 rounded-full bg-yellow-300/5 blur-lg"></div>
        <div className="absolute bottom-0 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="flex justify-between items-center">
          <Link to="/" className="group flex items-center">
            <div className="relative mr-2 w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-purple-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <span className="relative text-xl">📽️</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight flex items-center">
              <span className="relative">
                WatchMe
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-300"></span>
              </span> 
              <span className="text-yellow-300 ml-1 transform group-hover:rotate-12 transition-transform">✦</span>
            </h1>
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="p-2 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-0.5 bg-white mb-1.5 transition-all" 
                style={{transform: menuOpen ? 'rotate(45deg) translate(2px, 6px)' : ''}}></div>
              <div className="w-6 h-0.5 bg-white mb-1.5 transition-all" 
                style={{opacity: menuOpen ? 0 : 1}}></div>
              <div className="w-6 h-0.5 bg-white transition-all" 
                style={{transform: menuOpen ? 'rotate(-45deg) translate(2px, -6px)' : ''}}></div>
            </button>
          </div>
          
          {/* Desktop menu */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 items-center">
              <li>
                <NavLink to="/" active={location.pathname === "/"}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/add" active={location.pathname === "/add"}>
                  Add Show
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Mobile menu dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <nav className="pt-2 pb-4 border-t border-white/10">
            <ul className="flex flex-col space-y-3">
              <li>
                <NavLink 
                  to="/" 
                  active={location.pathname === "/"} 
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/add" 
                  active={location.pathname === "/add"}
                  onClick={() => setMenuOpen(false)}
                >
                  Add Show
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children, active, onClick }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`relative px-2 py-1 transition-all ${
        active 
          ? 'text-yellow-300 font-medium' 
          : 'text-white hover:text-yellow-200'
      }`}
    >
      <span className="relative z-10">
        {children}
        {active && (
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-300 rounded-full"></span>
        )}
      </span>
    </Link>
  );
}

export default Header;