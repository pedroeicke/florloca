
import React, { useEffect, useState } from 'react';
import { MOCK_ADS } from '../constants';
import { Ad } from '../types';
import { Icon } from '../components/Icon';

interface DetailProps {
  onNavigate: (page: string, params?: any) => void;
  id?: string;
}

const Detail: React.FC<DetailProps> = ({ onNavigate, id }) => {
  const [ad, setAd] = useState<Ad | null>(null);
  
  // Gallery State
  const [galleryStartIndex, setGalleryStartIndex] = useState(0); // For Adult Strip
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // For Default Layout Main Image
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Premium Specific State
  const [viewersCount, setViewersCount] = useState(12);

  useEffect(() => {
    // Simulate fetch logic
    const realId = id?.endsWith('-dup') ? id.replace(/-dup$/, '') : id;
    const found = MOCK_ADS.find(a => a.id === realId);
    if (found) {
      setAd(found);
      setGalleryStartIndex(0);
      setSelectedImageIndex(0);
      // Random viewers for social proof effect
      setViewersCount(Math.floor(Math.random() * 20) + 5);
    }
  }, [id]);

  if (!ad) return <div className="p-20 text-center text-gray-500">Carregando anúncio...</div>;

  // --- GALLERY LOGIC ---
  const images = ad.images && ad.images.length > 0 ? ad.images : [ad.image];
  
  // Adult specific strip logic
  const handleNextGallery = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryStartIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevGallery = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGalleryStartIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Default layout Main Image logic
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Lightbox Logic
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleLightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const handleLightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const closeLightbox = () => {
      setIsLightboxOpen(false);
      // Sync back the main view to what was viewed in lightbox
      setSelectedImageIndex(lightboxIndex); 
  };

  // Helper to get the 3 visible images for the adult strip
  const getVisibleImages = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(images[(galleryStartIndex + i) % images.length]);
    }
    return visible;
  };

  // --- SHARED LIGHTBOX COMPONENT ---
  const renderLightbox = () => (
    isLightboxOpen && (
      <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center animate-fadeIn">
        <button 
          className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-50 bg-black/50 rounded-full"
          onClick={closeLightbox}
        >
          <Icon name="X" size={32} />
        </button>
        
        <div className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center px-4 md:px-12">
           <button 
             className="absolute left-2 md:left-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors backdrop-blur-sm z-50"
             onClick={handleLightboxPrev}
           >
             <Icon name="ChevronLeft" size={32} />
           </button>
           
           <img 
             src={images[lightboxIndex]} 
             className="max-w-full max-h-full object-contain shadow-2xl" 
             alt={`Foto ${lightboxIndex + 1}`}
           />
           
           <button 
             className="absolute right-2 md:right-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors backdrop-blur-sm z-50"
             onClick={handleLightboxNext}
           >
             <Icon name="ChevronRight" size={32} />
           </button>
        </div>
        
        <div className="absolute bottom-6 flex gap-2 overflow-x-auto max-w-full px-4 scrollbar-hide">
          {images.map((img, idx) => (
            <div 
              key={idx}
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
              className={`w-16 h-16 md:w-20 md:h-20 shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all ${idx === lightboxIndex ? 'border-brand-red opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
            >
              <img src={img} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    )
  );

  // --- ADULT PREMIUM LAYOUT (Dark Mode / Exclusive) ---
  if (ad.category === 'adultos' && ad.tier === 'premium') {
    return (
      <div className="bg-zinc-950 min-h-screen pb-24 font-sans text-gray-200">
        {renderLightbox()}

        {/* Exclusive Floating Action Bar (Mobile) */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-zinc-800 p-3 flex gap-3 z-50 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.8)]">
           <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all shadow-lg shadow-green-900/50">
              <Icon name="MessageCircle" size={20} className="mr-2" /> WhatsApp
           </button>
           <button className="flex-1 bg-gradient-to-r from-red-600 to-brand-red hover:from-red-500 hover:to-red-600 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all shadow-lg shadow-red-900/50">
              <Icon name="Phone" size={20} className="mr-2" /> Ligar
           </button>
        </div>

        {/* Hero Section */}
        <div className="relative">
          {/* Main Hero Image - Cinematic Mode (Blurred BG + Contained Image) */}
          <div 
             className="w-full h-[60vh] md:h-[75vh] relative cursor-pointer group bg-zinc-900 overflow-hidden"
             onClick={() => openLightbox(selectedImageIndex)}
          >
             {/* 1. BACKGROUND LAYER (Ambiance) */}
             <div className="absolute inset-0 z-0">
                <img 
                  src={images[selectedImageIndex]} 
                  className="w-full h-full object-cover opacity-40 blur-2xl scale-125 saturate-150"
                  alt="Background Ambiance" 
                />
                <div className="absolute inset-0 bg-black/30"></div>
             </div>

             {/* 2. FOREGROUND LAYER (Full Image without cropping) */}
             <div className="absolute inset-0 z-10 flex items-center justify-center p-4 pb-20 md:pb-0">
                <img 
                  src={images[selectedImageIndex]} 
                  className="max-w-full max-h-full object-contain drop-shadow-2xl shadow-black"
                  alt="Modelo Premium" 
                />
             </div>

             {/* 3. OVERLAY GRADIENTS */}
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-20 pointer-events-none"></div>
             <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 via-transparent to-zinc-950/50 z-20 pointer-events-none md:hidden"></div>

             {/* Exclusive Badge */}
             <div className="absolute top-4 left-4 z-30">
                <span className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-yellow-500/20 flex items-center">
                  <Icon name="Gem" size={12} className="mr-2 fill-black" /> Black Premium
                </span>
             </div>

             {/* Gallery Navigation (Desktop) */}
             <div className="hidden md:flex absolute inset-0 items-center justify-between px-4 z-30 pointer-events-none">
                <button onClick={handlePrevImage} className="pointer-events-auto bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/10 hover:border-white/30">
                   <Icon name="ChevronLeft" size={32} />
                </button>
                <button onClick={handleNextImage} className="pointer-events-auto bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all border border-white/10 hover:border-white/30">
                   <Icon name="ChevronRight" size={32} />
                </button>
             </div>
          </div>

          {/* Overlapping Info Content */}
          <div className="container mx-auto px-4 relative z-30 -mt-24 md:-mt-32 pointer-events-none">
             <div className="flex flex-col md:flex-row items-end md:items-start gap-6 pointer-events-auto">
                
                {/* Thumbnails (Desktop floating) */}
                <div className="hidden md:flex flex-col gap-3 absolute left-4 bottom-8">
                   {images.slice(0, 4).map((img, idx) => (
                      <div 
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(idx); }}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-all shadow-lg ${idx === selectedImageIndex ? 'border-yellow-500 scale-110' : 'border-zinc-700 hover:border-white'}`}
                      >
                         <img src={img} className="w-full h-full object-cover" />
                      </div>
                   ))}
                </div>

                {/* Main Profile Info */}
                <div className="flex-1 w-full md:pl-24">
                   <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6">
                      <div className="text-white drop-shadow-xl">
                         <h1 className="text-4xl md:text-6xl font-serif italic mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400">
                           {ad.title}
                         </h1>
                         <div className="flex items-center gap-4 text-sm md:text-base font-light">
                            <span className="flex items-center text-yellow-400">
                               <Icon name="MapPin" size={16} className="mr-1" /> {ad.location}
                            </span>
                            <span className="flex items-center text-green-400 bg-green-900/30 px-2 py-0.5 rounded border border-green-500/30 backdrop-blur-md shadow-lg">
                               <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> Online Agora
                            </span>
                         </div>
                      </div>
                      <div className="hidden md:block">
                         <div className="text-right">
                            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Investimento</p>
                            <p className="text-4xl font-light text-white drop-shadow-lg">
                               {ad.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                         </div>
                      </div>
                   </div>

                   {/* Stats Bar */}
                   <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-4 md:p-6 rounded-2xl shadow-2xl flex flex-wrap justify-between gap-4 md:gap-8">
                      <div className="text-center flex-1 min-w-[80px]">
                         <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Idade</p>
                         <p className="text-xl md:text-2xl text-white font-serif">{ad.age} Anos</p>
                      </div>
                      <div className="w-px bg-zinc-800"></div>
                      <div className="text-center flex-1 min-w-[80px]">
                         <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Etnia</p>
                         <p className="text-xl md:text-2xl text-white font-serif">{ad.ethnicity}</p>
                      </div>
                      <div className="w-px bg-zinc-800"></div>
                      <div className="text-center flex-1 min-w-[80px]">
                         <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Altura</p>
                         <p className="text-xl md:text-2xl text-white font-serif">1.70m</p>
                      </div>
                      <div className="w-px bg-zinc-800"></div>
                      <div className="text-center flex-1 min-w-[80px]">
                         <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Verificada</p>
                         <div className="flex justify-center mt-1">
                            <Icon name="ShieldCheck" className="text-yellow-500" size={28} />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="container mx-auto px-4 mt-12">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Content */}
              <div className="lg:col-span-8 space-y-12">
                 
                 {/* About */}
                 <div>
                    <h2 className="text-2xl text-white font-serif italic mb-6 flex items-center">
                       <span className="w-8 h-px bg-yellow-500 mr-4"></span>
                       Sobre Mim
                    </h2>
                    <div className="prose prose-invert prose-lg max-w-none text-zinc-300 font-light leading-relaxed">
                       <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-yellow-500 first-letter:float-left first-letter:mr-3">
                         {ad.description}
                       </p>
                    </div>
                 </div>

                 {/* Services */}
                 <div>
                    <h2 className="text-2xl text-white font-serif italic mb-6 flex items-center">
                       <span className="w-8 h-px bg-yellow-500 mr-4"></span>
                       Serviços & Preferências
                    </h2>
                    <div className="flex flex-wrap gap-3">
                       {ad.services?.map((service, idx) => (
                          <span key={idx} className="bg-zinc-900 border border-zinc-800 hover:border-yellow-500/50 text-zinc-300 px-4 py-2 rounded-full text-sm transition-colors cursor-default">
                             {service}
                          </span>
                       ))}
                       {['Jantares', 'Viagens', 'Eventos'].map((s, i) => (
                          <span key={`extra-${i}`} className="bg-zinc-900 border border-zinc-800 hover:border-yellow-500/50 text-zinc-300 px-4 py-2 rounded-full text-sm transition-colors cursor-default">
                             {s}
                          </span>
                       ))}
                    </div>
                 </div>

                 {/* Rates Table */}
                 {ad.rates && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-6">
                       <h3 className="text-xl text-white font-serif mb-6 text-center">Investimento</h3>
                       <div className="space-y-4">
                          {ad.rates.map((rate, idx) => (
                             <div key={idx} className="flex justify-between items-center border-b border-zinc-800 pb-4 last:border-0 last:pb-0">
                                <span className="text-zinc-400 font-light text-lg">{rate.time}</span>
                                <span className="text-yellow-500 font-serif text-2xl">R$ {rate.value}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}
              </div>

              {/* Right Sidebar (Sticky) */}
              <div className="lg:col-span-4 hidden md:block">
                 <div className="sticky top-24 space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                       
                       <div className="text-center mb-8">
                          <p className="text-zinc-400 text-sm uppercase tracking-widest mb-2">Contato Direto</p>
                          <h3 className="text-3xl font-serif text-white">{ad.title}</h3>
                       </div>

                       <div className="space-y-4">
                          <button className="w-full group bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-green-900/30 flex items-center justify-center relative overflow-hidden">
                             <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                             <Icon name="MessageCircle" className="mr-3" size={24} />
                             Chamar no WhatsApp
                          </button>
                          
                          <button className="w-full bg-zinc-800 hover:bg-brand-red text-white font-bold py-4 rounded-xl transition-all border border-zinc-700 hover:border-brand-red flex items-center justify-center">
                             <Icon name="Phone" className="mr-3" size={24} />
                             Ver Telefone
                          </button>
                       </div>

                       <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                          <p className="text-zinc-500 text-xs flex items-center justify-center">
                             <Icon name="ShieldCheck" size={14} className="mr-2 text-yellow-600" />
                             Perfil Verificado e Seguro
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    );
  }

  // --- GENERAL PREMIUM LAYOUT (Sales Page / High Conversion) ---
  if (ad.tier === 'premium' && ad.category !== 'adultos') {
    return (
      <div className="bg-white min-h-screen font-sans">
        {renderLightbox()}
        
        {/* PREMIUM HERO SECTION - Dark & Immersive */}
        <div className="bg-gray-900 text-white pb-12 pt-6">
          <div className="container mx-auto px-4">
            
            {/* Top Bar: Breadcrumb + Social Proof */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
              <nav className="text-xs md:text-sm text-gray-400 flex items-center overflow-x-auto whitespace-nowrap">
                <span onClick={() => onNavigate('home')} className="cursor-pointer hover:text-white transition-colors">Início</span>
                <Icon name="ChevronRight" size={14} className="mx-2 shrink-0" />
                <span onClick={() => onNavigate('listing', {category: ad.category})} className="cursor-pointer hover:text-white transition-colors capitalize">{ad.category}</span>
                <Icon name="ChevronRight" size={14} className="mx-2 shrink-0" />
                <span className="text-white font-medium truncate max-w-[200px]">{ad.title}</span>
              </nav>
              <div className="flex items-center text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md animate-pulse">
                <Icon name="Users" size={14} className="mr-2 text-brand-red" />
                {viewersCount} pessoas vendo agora
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left: Gallery (Cinema Mode) */}
              <div className="lg:col-span-8">
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group border border-gray-700">
                   <img 
                     src={images[selectedImageIndex]} 
                     alt={ad.title} 
                     className="w-full h-full object-contain cursor-pointer"
                     onClick={() => openLightbox(selectedImageIndex)}
                   />
                   
                   <div className="absolute top-4 left-4 bg-brand-red text-white text-xs font-bold px-3 py-1 rounded shadow-lg uppercase tracking-wider z-20">
                      Oportunidade Premium
                   </div>

                   {/* Nav Buttons */}
                   {images.length > 1 && (
                     <>
                        <button 
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all z-20"
                        >
                          <Icon name="ChevronLeft" size={24} />
                        </button>
                        <button 
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all z-20"
                        >
                          <Icon name="ChevronRight" size={24} />
                        </button>
                     </>
                   )}

                   {/* Thumbs Overlay */}
                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/40 backdrop-blur-md rounded-xl max-w-[90%] overflow-x-auto no-scrollbar">
                      {images.map((img, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${idx === selectedImageIndex ? 'border-brand-red opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                          <img src={img} className="w-full h-full object-cover" />
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Right: Sticky Sales Box */}
              <div className="lg:col-span-4 relative">
                <div className="lg:sticky lg:top-24 bg-white text-gray-900 rounded-xl shadow-2xl p-6 md:p-8 border-t-4 border-brand-red">
                   
                   <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">{ad.title}</h1>
                   <div className="flex items-center text-gray-500 text-sm mb-6">
                      <Icon name="MapPin" size={16} className="mr-1 text-brand-red" />
                      {ad.location}
                      <span className="mx-2">•</span>
                      <span className="text-green-600 font-bold flex items-center">
                        <Icon name="CheckCircle" size={14} className="mr-1" /> Verificado
                      </span>
                   </div>

                   <div className="mb-8">
                     <p className="text-sm text-gray-500 uppercase font-bold tracking-wide mb-1">Valor à vista</p>
                     <div className="flex items-baseline">
                       <span className="text-5xl font-black text-gray-900 tracking-tighter">
                         {ad.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(',00', '')}
                       </span>
                       <span className="text-xl text-gray-400 font-semibold ml-1">,00</span>
                     </div>
                     <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded flex items-center">
                       <Icon name="ShieldCheck" size={14} className="mr-2 text-green-600" />
                       Melhor preço garantido na região.
                     </p>
                   </div>

                   {/* CTAs - High Contrast */}
                   <div className="space-y-3">
                     <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center animate-shimmer">
                       <Icon name="MessageCircle" className="mr-2" size={24} />
                       Negociar Agora
                     </button>
                     <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 rounded-xl transition-colors flex items-center justify-center">
                       <Icon name="Phone" className="mr-2" size={20} />
                       Ver Telefone
                     </button>
                   </div>

                   {/* Seller Info */}
                   <div className="mt-8 pt-6 border-t border-gray-100">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden ring-2 ring-brand-red p-0.5">
                           <img src="https://i.pravatar.cc/150?img=33" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Loja Oficial Premium</p>
                          <div className="flex text-yellow-400 text-xs">
                             <Icon name="Star" size={12} fill="currentColor" />
                             <Icon name="Star" size={12} fill="currentColor" />
                             <Icon name="Star" size={12} fill="currentColor" />
                             <Icon name="Star" size={12} fill="currentColor" />
                             <Icon name="Star" size={12} fill="currentColor" />
                             <span className="text-gray-400 ml-1">(142 vendas)</span>
                          </div>
                        </div>
                     </div>
                   </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="container mx-auto px-4 py-12">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                 
                 {/* Feature Highlights Grid */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {Object.entries(ad.attributes).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center text-center hover:border-brand-red hover:shadow-md transition-all">
                        <span className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">{key}</span>
                        <span className="text-gray-900 font-bold text-lg">{value}</span>
                      </div>
                    ))}
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col items-center text-center">
                       <Icon name="ShieldCheck" className="text-brand-red mb-1" size={24} />
                       <span className="text-brand-red font-bold text-sm">Garantia Ativa</span>
                    </div>
                 </div>

                 {/* Description - Copywriting Style */}
                 <div className="mb-12">
                   <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                     <span className="w-1.5 h-8 bg-brand-red rounded-full mr-3"></span>
                     Por que este é o negócio ideal?
                   </h2>
                   <div className="prose prose-lg text-gray-700 max-w-none leading-relaxed">
                      <p className="mb-4 font-medium text-xl text-gray-900 italic">"{ad.description.split('.')[0]}."</p>
                      <p>{ad.description}</p>
                      <p>Este item foi rigorosamente inspecionado por nossa equipe de especialistas. A oportunidade perfeita para quem busca qualidade superior sem comprometer o orçamento.</p>
                      
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6 rounded-r-lg">
                        <h4 className="font-bold text-blue-900 text-lg mb-2">Destaques Exclusivos</h4>
                        <ul className="list-disc pl-5 space-y-1 text-blue-800">
                          <li>Documentação 100% verificada</li>
                          <li>Entrega facilitada para todo estado de {ad.state}</li>
                          <li>Condição impecável de conservação</li>
                        </ul>
                      </div>
                   </div>
                 </div>
              </div>

              {/* Sidebar Content (Safety) */}
              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Icon name="ShieldCheck" className="text-green-600 mr-2" /> 
                      Compra Segura
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Este anúncio possui o selo de verificação Premium. Seus dados e a transação estão protegidos.
                    </p>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center text-gray-700">
                        <Icon name="CheckCircle" size={16} className="text-green-500 mr-2" /> Vendedor Identificado
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Icon name="CheckCircle" size={16} className="text-green-500 mr-2" /> Histórico limpo
                      </li>
                      <li className="flex items-center text-gray-700">
                        <Icon name="CheckCircle" size={16} className="text-green-500 mr-2" /> Suporte Prioritário
                      </li>
                    </ul>
                 </div>
              </div>
           </div>
        </div>

        {/* Mobile Sticky CTA for Premium */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4">
           <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Total à vista</p>
              <p className="text-2xl font-black text-brand-red">{ad.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(',00', '')}</p>
           </div>
           <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center">
              Comprar Agora
           </button>
        </div>

      </div>
    );
  }

  // --- RENDER FOR ADULT CATEGORY (Standard/Highlight) ---
  if (ad.category === 'adultos') {
    return (
      <div className="bg-gray-100 min-h-screen pb-24 md:pb-12 font-sans">
        
        {renderLightbox()}

        {/* Mobile Sticky Action Bar */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 flex gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
           <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-colors">
              <Icon name="MessageCircle" size={20} className="mr-2" /> WhatsApp
           </button>
           <button className="flex-1 bg-brand-red hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-colors">
              <Icon name="Phone" size={20} className="mr-2" /> Ligar
           </button>
        </div>

        <div className="container mx-auto px-4 pt-4 md:pt-6 max-w-7xl">
            
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500 mb-4 flex items-center overflow-x-auto whitespace-nowrap pb-2">
                <span onClick={() => onNavigate('home')} className="cursor-pointer hover:text-brand-red transition-colors">Início</span>
                <Icon name="ChevronRight" size={14} className="mx-2 shrink-0" />
                <span onClick={() => onNavigate('listing', {category: 'adultos'})} className="cursor-pointer hover:text-brand-red transition-colors">Acompanhantes</span>
                <Icon name="ChevronRight" size={14} className="mx-2 shrink-0" />
                <span className="font-medium text-gray-900 truncate">{ad.title}</span>
            </nav>

            {/* GALLERY STRIP - 3 IMAGES (Webmotors Style) */}
            <div className="relative group mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-2 h-72 md:h-96 overflow-hidden rounded-lg">
                    {getVisibleImages().map((img, idx) => {
                        const actualIndex = (galleryStartIndex + idx) % images.length;
                        return (
                          <div 
                              key={`${galleryStartIndex}-${idx}`} 
                              className="relative h-full bg-gray-200 cursor-pointer overflow-hidden group/image"
                              onClick={() => openLightbox(actualIndex)}
                          >
                              <img 
                                  src={img} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105" 
                                  alt=""
                              />
                              {/* Overlay icon on hover */}
                              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-all flex items-center justify-center">
                                  <Icon name="Search" className="text-white opacity-0 group-hover/image:opacity-100 transform scale-0 group-hover/image:scale-100 transition-all duration-300 drop-shadow-lg" size={40} />
                              </div>
                              
                              {/* Badges (only on first image of strip) */}
                              {idx === 0 && (
                                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                                      {ad.verified && (
                                          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded uppercase flex items-center shadow-lg">
                                              <Icon name="Star" size={12} className="mr-1 fill-white" /> Verificada
                                          </span>
                                      )}
                                  </div>
                              )}
                          </div>
                        );
                    })}
                </div>

                {/* Navigation Buttons (Overlapping the strip) */}
                {images.length > 3 && (
                    <>
                        <button 
                            onClick={handlePrevGallery}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                            <Icon name="ChevronLeft" size={24} />
                        </button>
                        <button 
                            onClick={handleNextGallery}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
                        >
                            <Icon name="ChevronRight" size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tight mb-1">{ad.title}</h1>
                                <p className="text-gray-500 text-sm flex items-center">
                                    {ad.subcategory} &bull; {ad.location}
                                </p>
                            </div>
                            <button className="text-gray-400 hover:text-brand-red transition-colors">
                                <Icon name="Heart" size={28} />
                            </button>
                        </div>
                        {/* Stats Grid */}
                        <div className="mt-6 border-t border-gray-100 pt-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Detalhes</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">Idade</span>
                                    <span className="block text-lg font-bold text-gray-900">{ad.age || '--'} anos</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">Etnia</span>
                                    <span className="block text-lg font-bold text-gray-900">{ad.ethnicity || '--'}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">Gênero</span>
                                    <span className="block text-lg font-bold text-gray-900">{ad.gender || '--'}</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">Status</span>
                                    <span className={`block text-lg font-bold ${ad.online ? 'text-green-600' : 'text-gray-400'}`}>
                                        {ad.online ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Description */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Sobre</h3>
                        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                            {ad.description}
                        </div>
                    </div>
                     {/* Rates */}
                     {ad.rates && (
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Valores</h3>
                            <div className="space-y-3">
                                {ad.rates.map((rate, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                        <span className="text-gray-600 font-medium">{rate.time}</span>
                                        <span className="text-gray-900 font-bold text-lg">R$ {rate.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white rounded-lg shadow-card border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <span className="block text-sm text-gray-500 mb-1">Cachê a partir de</span>
                                <div className="flex items-baseline justify-between mb-6">
                                    <h2 className="text-4xl font-black text-gray-900">
                                        {ad.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </h2>
                                </div>
                                <button className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3.5 rounded-md transition-colors flex items-center justify-center mb-3 shadow-sm">
                                    <Icon name="MessageCircle" className="mr-2" size={20} />
                                    Enviar Mensagem
                                </button>
                                <button className="w-full bg-white border-2 border-brand-red text-brand-red font-bold py-3.5 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center">
                                    <Icon name="Phone" className="mr-2" size={20} />
                                    Ver Telefone
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- DEFAULT LAYOUT (Standard Ads) ---
  return (
    <div className="bg-gray-50/50 min-h-screen pb-24 md:pb-12">
      
      {renderLightbox()}

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-3 flex gap-3 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <button className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center">
          <Icon name="MessageCircle" size={20} className="mr-2" /> Chat
        </button>
        <button className="flex-1 bg-brand-red text-white font-bold py-3 rounded-lg flex items-center justify-center">
          <Icon name="Phone" size={20} className="mr-2" /> Ligar
        </button>
      </div>

      <div className="container mx-auto px-4 py-6">
        
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center overflow-x-auto whitespace-nowrap pb-2">
          <span onClick={() => onNavigate('home')} className="cursor-pointer hover:text-brand-red">Início</span>
          <Icon name="ChevronRight" size={14} className="mx-2 shrink-0" />
          <span onClick={() => onNavigate('listing')} className="cursor-pointer hover:text-brand-red capitalize">{ad.state}</span>
          <Icon name="ChevronRight" size={14} className="mx-2 shrink-0" />
          <span onClick={() => onNavigate('listing')} className="cursor-pointer hover:text-brand-red capitalize">{ad.category}</span>
          <Icon name="ChevronRight" size={14} className="mx-2 shrink-0" />
          <span className="font-medium text-gray-900 truncate">{ad.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column (Images + Desc) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Gallery Section */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              
              {/* Main Image with Navigation Arrows */}
              <div 
                className="relative aspect-video bg-black group cursor-pointer"
                onClick={() => openLightbox(selectedImageIndex)}
              >
                 <img 
                   src={images[selectedImageIndex]} 
                   alt={ad.title} 
                   className="w-full h-full object-contain" 
                 />
                 
                 {/* Index Counter */}
                 <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                   {selectedImageIndex + 1} / {images.length}
                 </div>
                 
                 {/* Zoom Indicator */}
                 <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm pointer-events-none">
                   <Icon name="Search" size={16} />
                 </div>

                 {/* Navigation Arrows (On top of image) */}
                 {images.length > 1 && (
                   <>
                     <button 
                       className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-10"
                       onClick={handlePrevImage}
                     >
                       <Icon name="ChevronLeft" size={24} />
                     </button>
                     <button 
                       className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm z-10"
                       onClick={handleNextImage}
                     >
                       <Icon name="ChevronRight" size={24} />
                     </button>
                   </>
                 )}
              </div>
              
              {/* Thumbnail Strip (Updates Main Image) */}
              <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide">
                 {images.map((img, idx) => (
                   <div 
                     key={idx} 
                     onClick={() => setSelectedImageIndex(idx)}
                     className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${idx === selectedImageIndex ? 'border-brand-red opacity-100 ring-2 ring-red-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                   >
                     <img src={img} className="w-full h-full object-cover" />
                   </div>
                 ))}
              </div>
            </div>

            {/* Main Info */}
            <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                 <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight flex-1 mr-4">{ad.title}</h1>
                 <button className="text-gray-400 hover:text-red-500 transition-colors bg-gray-50 p-2 rounded-full">
                   <Icon name="Heart" size={24} />
                 </button>
              </div>
              
              <div className="text-3xl md:text-4xl font-bold text-brand-red mb-4">
                {ad.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-6">
                 <span className="flex items-center"><Icon name="Clock" size={16} className="mr-1.5" /> Publicado {ad.createdAt}</span>
                 <span className="flex items-center"><Icon name="MapPin" size={16} className="mr-1.5" /> {ad.location}</span>
                 <span className="flex items-center"><Icon name="AlertTriangle" size={16} className="mr-1.5" /> Cód. {ad.id}9384</span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                 {Object.entries(ad.attributes).map(([key, value]) => (
                   <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                     <span className="block text-xs text-gray-500 uppercase tracking-wide mb-1">{key}</span>
                     <span className="block font-semibold text-gray-900">{value}</span>
                   </div>
                 ))}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-4">Descrição</h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p>{ad.description}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit.</p>
              </div>
            </div>
            
            {/* Location Map Mock */}
            <div className="bg-white rounded-2xl shadow-card p-6">
               <h2 className="text-xl font-bold text-gray-900 mb-4">Localização</h2>
               <div className="aspect-[21/9] bg-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden group">
                  <div className="text-center z-10">
                     <Icon name="MapPin" size={32} className="mx-auto text-brand-red mb-2" />
                     <span className="font-semibold text-gray-700">{ad.location}</span>
                  </div>
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" />
               </div>
            </div>

          </div>

          {/* Sidebar (Seller Info & CTAs) */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden border-2 border-green-400 p-0.5">
                      <img src="https://i.pravatar.cc/150?img=11" className="w-full h-full rounded-full object-cover" />
                   </div>
                   <div>
                      <h3 className="font-bold text-lg text-gray-900">João da Silva</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span> Online agora
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Na ClassiWeb desde 2019</p>
                   </div>
                </div>

                <div className="space-y-3 hidden md:block">
                   <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center transform hover:-translate-y-0.5">
                     <Icon name="MessageCircle" className="mr-2" /> Conversar no Chat
                   </button>
                   <button className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center transform hover:-translate-y-0.5">
                     <Icon name="Phone" className="mr-2" /> Ver Telefone
                   </button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                   <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-500">Tempo de resposta</span>
                      <span className="font-semibold text-green-600">~ 15 minutos</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Anúncios ativos</span>
                      <span className="font-semibold text-gray-900">12</span>
                   </div>
                </div>
             </div>

             <div className="bg-white rounded-2xl shadow-card p-6 border-l-4 border-blue-500">
               <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                 <Icon name="ShieldCheck" className="text-blue-500 mr-2" size={20} />
                 Dicas de Segurança
               </h3>
               <ul className="text-sm text-gray-600 space-y-2.5">
                 <li className="flex items-start"><span className="mr-2 text-blue-500">•</span> Evite pagamentos antecipados.</li>
                 <li className="flex items-start"><span className="mr-2 text-blue-500">•</span> Prefira locais públicos.</li>
                 <li className="flex items-start"><span className="mr-2 text-blue-500">•</span> Verifique bem o produto.</li>
               </ul>
               <button className="text-blue-600 text-xs font-bold mt-4 hover:underline">Ver todas as dicas</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
