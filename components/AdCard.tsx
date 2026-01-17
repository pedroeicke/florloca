
import React, { useState, useEffect } from 'react';
import { Ad } from '../types';
import { Icon } from './Icon';

interface AdCardProps {
  ad: Ad;
  onClick: (id: string) => void;
}

const AdCard: React.FC<AdCardProps> = ({ ad, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Define default tier if not present
  const tier = ad.tier || 'free';

  useEffect(() => {
     // Check storage logic
     const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
     setIsFavorite(favorites.includes(ad.id));
  }, [ad.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    if (favorites.includes(ad.id)) {
        newFavorites = favorites.filter((fid: string) => fid !== ad.id);
        setIsFavorite(false);
    } else {
        newFavorites = [...favorites, ad.id];
        setIsFavorite(true);
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  }
  
  // Ensure we have an array to work with, fallback to single image if array is empty/undefined
  const images = ad.images && ad.images.length > 0 ? ad.images : [ad.image];
  const hasMultipleImages = images.length > 1;

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents navigating to detail page
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents navigating to detail page
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // --- STYLING LOGIC BASED ON TIER ---
  
  // Default Card Container Styles
  const containerStyles = {
    free: "bg-white border-gray-100 shadow-card hover:shadow-soft",
    highlight: "bg-white border-2 border-brand-red shadow-lg",
    premium: "bg-brand-red border border-brand-red shadow-lg"
  };

  // Text Colors
  const titleColor = tier === 'premium' ? 'text-white' : 'text-gray-700 group-hover:text-brand-red';
  const priceColor = tier === 'premium' ? 'text-white' : 'text-gray-900';
  const metaColor = tier === 'premium' ? 'text-white/80' : 'text-gray-400';
  const dividerColor = tier === 'premium' ? 'border-white/20' : 'border-gray-50';
  const arrowBgColor = tier === 'premium' ? 'bg-white/20 hover:bg-white/40 text-white' : 'bg-white/80 hover:bg-white text-gray-800';
  
  // --- ADULT CARD LAYOUT ---
  if (ad.category === 'adultos') {
    const isAdultPremium = tier === 'premium';
    
    // Override styles for Adult Premium to be Dark/Gold
    const adultContainerClass = isAdultPremium 
      ? "bg-zinc-900 border-2 border-yellow-500/50 shadow-xl shadow-black/20" 
      : containerStyles[tier];

    return (
      <div 
        className={`${adultContainerClass} rounded-xl transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col h-full relative`}
        onClick={() => onClick(ad.id)}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-900">
           <img 
            src={images[currentImageIndex]} 
            alt={ad.title} 
            className="w-full h-full object-cover object-top transform transition-transform duration-500"
            loading="lazy"
           />
           
           {/* Navigation Arrows */}
           {hasMultipleImages && (
             <>
               <button 
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 focus:outline-none"
                  onClick={handlePrevImage}
               >
                  <div className="bg-black/30 text-white rounded-full p-2 hover:bg-black/60 transition-colors backdrop-blur-sm">
                    <Icon name="ChevronLeft" size={20} />
                  </div>
               </button>
               
               <button 
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 focus:outline-none"
                  onClick={handleNextImage}
               >
                  <div className="bg-black/30 text-white rounded-full p-2 hover:bg-black/60 transition-colors backdrop-blur-sm">
                    <Icon name="ChevronRight" size={20} />
                  </div>
               </button>
             </>
           )}

           {/* Badges */}
           <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
             {tier === 'premium' && (
               <span className="bg-yellow-500 text-black border border-yellow-300 text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase flex items-center w-max tracking-wide">
                 <Icon name="Gem" size={10} className="mr-1 fill-black" /> LUXO
               </span>
             )}
             {ad.verified && (
               <span className={`${isAdultPremium ? 'bg-zinc-800/90 text-yellow-400 border border-yellow-500/30' : 'bg-green-500 text-white'} text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase flex items-center w-max backdrop-blur-sm`}>
                 <Icon name="Star" size={10} className={`mr-1 ${isAdultPremium ? 'fill-yellow-400' : 'fill-white'}`} /> Verificada
               </span>
             )}
           </div>
           
           {/* Favorite (Inside Image for Adult Layout) */}
           <button 
              className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all z-20 hover:scale-110 ${isFavorite ? 'bg-white text-brand-red shadow-md' : 'bg-black/30 text-white hover:bg-black/50'}`}
              onClick={toggleFavorite}
            >
              <Icon name="Heart" size={18} className={isFavorite ? "fill-brand-red" : ""} />
            </button>

           {ad.online && (
             <span className="absolute top-3 right-3 bg-green-600/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase flex items-center backdrop-blur-sm pointer-events-none">
               <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span> Online
             </span>
           )}
        </div>

        {/* Content Section - Respects Tier Coloring */}
        <div className={`p-3 flex-grow ${isAdultPremium ? 'bg-zinc-900 text-white' : (tier === 'premium' ? 'bg-brand-red text-white' : '')}`}>
          <div className="flex justify-between items-start mb-1">
             <h3 className={`text-lg font-extrabold leading-tight ${isAdultPremium ? 'text-yellow-50 font-serif tracking-wide' : (tier === 'premium' ? 'text-white' : 'text-gray-900 group-hover:text-brand-red')} transition-colors`}>
               {ad.title}
             </h3>
          </div>
          
          <div className={`flex justify-between items-center text-xs mb-2 ${isAdultPremium ? 'text-zinc-400' : (tier === 'premium' ? 'text-white/80' : 'text-gray-500')}`}>
             <span className="flex items-center truncate">
               <Icon name="MapPin" size={12} className="mr-1" /> {ad.location}
             </span>
             {ad.age && <span className="font-semibold">{ad.age} anos</span>}
          </div>

          <div className={`border-t pt-2 mt-1 ${isAdultPremium ? 'border-yellow-500/20' : (tier === 'premium' ? 'border-white/20' : 'border-gray-100')}`}>
             <p className={`text-[10px] uppercase tracking-wide ${isAdultPremium ? 'text-yellow-500/80' : (tier === 'premium' ? 'text-white/60' : 'text-gray-400')}`}>Cachê a partir de</p>
             <div className={`text-xl font-extrabold ${isAdultPremium ? 'text-yellow-400' : (tier === 'premium' ? 'text-white' : 'text-brand-red')}`}>
               {ad.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', 'R$ ')}
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DEFAULT LAYOUT (Imóveis, Autos, etc) ---
  return (
    <div 
      className={`${containerStyles[tier]} rounded-xl transition-all duration-300 overflow-hidden cursor-pointer group border flex flex-col h-full`}
      onClick={() => onClick(ad.id)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 group">
        <img 
          src={images[currentImageIndex]} 
          alt={ad.title} 
          className="w-full h-full object-cover transform transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Navigation */}
        {hasMultipleImages && (
             <>
               <button 
                  className={`absolute top-1/2 left-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1 rounded-full ${arrowBgColor}`}
                  onClick={handlePrevImage}
               >
                  <Icon name="ChevronLeft" size={16} />
               </button>
               <button 
                  className={`absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1 rounded-full ${arrowBgColor}`}
                  onClick={handleNextImage}
               >
                  <Icon name="ChevronRight" size={16} />
               </button>
             </>
        )}

        {/* Tier Badges */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {tier === 'premium' && (
            <span className="bg-white text-brand-red text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">
              Premium
            </span>
          )}
          {tier === 'highlight' && (
             <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">
              Destaque
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-sm z-20 ${isFavorite ? 'bg-white text-brand-red opacity-100' : 'bg-white/90 text-gray-400 hover:text-brand-red'}`}
          onClick={toggleFavorite}
        >
          <Icon name="Heart" size={16} className={isFavorite ? "fill-brand-red" : ""} />
        </button>
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex-grow">
            <h3 className={`text-sm font-medium line-clamp-2 mb-1 transition-colors leading-snug ${titleColor}`}>
              {ad.title}
            </h3>
            <div className={`text-xl font-bold mb-1 ${priceColor}`}>
               {ad.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
        </div>
        
        <div className={`mt-3 pt-3 border-t text-xs flex justify-between items-center ${dividerColor} ${metaColor}`}>
           <div className="flex items-center truncate max-w-[65%]">
              <span className="truncate">{ad.location}</span>
           </div>
           <div className="flex items-center whitespace-nowrap pl-2">
              <Icon name="Clock" size={10} className="mr-1" />
              <span>{ad.createdAt}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
