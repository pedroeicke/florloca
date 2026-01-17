import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { STATES } from '../constants';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

const TYPEWRITER_PHRASES = ['"Celular"', '"Apartamento"', '"Notebook"', '"Sofá"', '"Emprego"'];

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState('SC');

  // Typewriter effect state
  const [placeholderText, setPlaceholderText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPEWRITER_PHRASES[phraseIndex % TYPEWRITER_PHRASES.length];
    
    const typeSpeed = isDeleting ? 50 : 100;
    const delay = isDeleting && charIndex === 0 ? 500 : (charIndex === currentPhrase.length ? 2000 : typeSpeed);

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentPhrase.length) {
        setPlaceholderText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (!isDeleting && charIndex === currentPhrase.length) {
        setIsDeleting(true);
      } else if (isDeleting && charIndex > 0) {
        setPlaceholderText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex(phraseIndex + 1);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer shrink-0" 
          onClick={() => onNavigate('home')}
        >
          <span className="text-2xl md:text-3xl font-extrabold text-brand-red tracking-tighter">FloripaLocal</span>
        </div>

        {/* Search Bar - FloripaLocal Style (Input | Divider | Location | Search Icon) */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-auto">
          <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors focus-within:border-brand-red focus-within:ring-1 focus-within:ring-brand-red bg-white h-12 shadow-sm">
            <input 
              type="text" 
              className="flex-1 pl-4 pr-2 py-2 text-gray-700 placeholder-gray-400 outline-none bg-transparent"
              placeholder={`Buscar ${placeholderText}`}
            />
            
            {/* Divider */}
            <div className="w-[1px] bg-gray-200 my-2"></div>
            
            {/* Location Selector */}
            <div className="relative flex items-center px-2 cursor-pointer hover:bg-gray-50 group transition-colors">
               <Icon name="MapPin" size={16} className="text-brand-red mr-1" />
               <select 
                 className="appearance-none bg-transparent text-sm font-semibold text-gray-700 outline-none pr-6 cursor-pointer"
                 value={location}
                 onChange={(e) => setLocation(e.target.value)}
               >
                 {STATES.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
               <Icon name="ChevronDown" size={14} className="absolute right-1 text-gray-400 pointer-events-none group-hover:text-gray-600" />
            </div>

            <button className="px-4 text-gray-500 hover:text-brand-red transition-colors flex items-center justify-center">
              <Icon name="Search" size={20} />
            </button>
          </div>
        </div>

        {/* Actions - FloripaLocal Style */}
        <div className="hidden lg:flex items-center space-x-6 shrink-0">
          <button className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
            <Icon name="ClipboardList" className="mr-2 text-gray-500" size={20} />
            Meus Anúncios
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
            <Icon name="MessageCircle" className="mr-2 text-gray-500" size={20} />
            Chat
          </button>
          <button className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
            <Icon name="Bell" className="mr-2 text-gray-500" size={20} />
            Notificações
          </button>
          
          <button className="text-gray-900 font-bold px-6 py-2.5 rounded-full border border-gray-300 hover:bg-gray-50 transition-all text-sm">
            Entrar
          </button>

          <button 
            onClick={() => onNavigate('publish')}
            className="bg-brand-red hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow hover:shadow-md text-sm"
          >
            Anunciar grátis
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 lg:hidden ml-auto">
           <Icon name="Search" size={24} className="text-gray-700" />
           <button 
            className="text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-20 shadow-lg z-50 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="p-4 space-y-6">
             <button 
               onClick={() => {onNavigate('publish'); setMobileMenuOpen(false)}}
               className="w-full bg-brand-red text-white font-bold py-3 rounded-lg text-center shadow-md"
            >
              Anunciar grátis
            </button>

            <button className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg text-center">
              Entrar
            </button>

            <div className="space-y-4 pt-4 border-t border-gray-100">
               <button className="flex items-center text-gray-600 font-medium w-full py-2">
                 <Icon name="ClipboardList" className="mr-3" size={20} /> Meus Anúncios
               </button>
               <button className="flex items-center text-gray-600 font-medium w-full py-2">
                 <Icon name="MessageCircle" className="mr-3" size={20} /> Chat
               </button>
               <button className="flex items-center text-gray-600 font-medium w-full py-2">
                 <Icon name="Bell" className="mr-3" size={20} /> Notificações
               </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;