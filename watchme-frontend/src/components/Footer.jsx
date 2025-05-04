import { useState, useEffect } from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [quote, setQuote] = useState('');
  
  // Small quotes about films to add a personal touch
  const quotes = [
    "Film is a dream you experience with your eyes wide open.",
    "A good movie is never too long; a bad movie is never too short.",
    "A good story can change how we see the world.",
    "Film is the art of storytelling through light, space, and time.",
    "In films, we discover parts of ourselves we never knew existed."
  ];
  
  useEffect(() => {
    // Get a random quote when the component loads
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <footer className="gradient-bg text-white py-10 mt-auto relative overflow-hidden">
      {/* Mindful decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute -top-24 right-0 w-48 h-48 rounded-full bg-white/5"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Quote section */}
          <div className="text-center mb-8 py-3 px-6 bg-white/5 rounded-lg backdrop-blur-sm">
            <p className="text-white/80 italic text-sm md:text-base">"{quote}"</p>
          </div>
          
          {/* Main footer section */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-black tracking-tight flex items-center">
                WatchMe <span className="text-yellow-300 ml-1">✦</span>
              </h2>
              <p className="text-white/70 text-sm mt-1 font-light">Track all your watches in one place</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-white/70">© {currentYear} WatchMe! </p>
              <p className="text-xs mt-1 text-white/50 font-light">Made with ♥ by Film Lovers</p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-wrap justify-center md:justify-start gap-8 text-sm">
                <a href="#" className="hover:text-yellow-300 transition-colors flex items-center gap-2 opacity-80 hover:opacity-100">
                  <span className="w-1 h-1 bg-yellow-300 rounded-full"></span> About Us
                </a>
                <a href="#" className="hover:text-yellow-300 transition-colors flex items-center gap-2 opacity-80 hover:opacity-100">
                  <span className="w-1 h-1 bg-yellow-300 rounded-full"></span> Privacy
                </a>
                <a href="#" className="hover:text-yellow-300 transition-colors flex items-center gap-2 opacity-80 hover:opacity-100">
                  <span className="w-1 h-1 bg-yellow-300 rounded-full"></span> Terms
                </a>
                <a href="#" className="hover:text-yellow-300 transition-colors flex items-center gap-2 opacity-80 hover:opacity-100">
                  <span className="w-1 h-1 bg-yellow-300 rounded-full"></span> Help
                </a>
              </div>
              <div className="flex gap-4">
                <a href="#" className="social-btn group" aria-label="Twitter">
                  <div className="social-btn-bg"></div>
                  <span className="group-hover:scale-110 transition-transform">🐦</span>
                </a>
                <a href="#" className="social-btn group" aria-label="Instagram">
                  <div className="social-btn-bg"></div>
                  <span className="group-hover:scale-110 transition-transform">📸</span>
                </a>
                <a href="#" className="social-btn group" aria-label="Email">
                  <div className="social-btn-bg"></div>
                  <span className="group-hover:scale-110 transition-transform">✉️</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .social-btn {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
        }
        
        .social-btn-bg {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.1);
          transition: transform 0.3s ease, opacity 0.3s ease;
          opacity: 0.5;
        }
        
        .social-btn:hover .social-btn-bg {
          transform: scale(1.2);
          opacity: 0.8;
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </footer>
  );
}

export default Footer;