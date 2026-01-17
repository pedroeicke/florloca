
import React, { useState } from 'react';
import { MOCK_ADS, RESTRICTED_CATEGORIES } from '../constants';
import { Icon } from '../components/Icon';
import AdCard from '../components/AdCard';
import CategoryCarousel from '../components/CategoryCarousel';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategorySelect = (id: string, subcategory?: string) => {
    // If clicking same main category without subcategory, toggle off (optional behavior, usually we just navigate)
    if (selectedCategory === id && !subcategory) {
      // Keep selected or navigate
      onNavigate('listing', { category: id });
    } else {
      setSelectedCategory(id);
      onNavigate('listing', { category: id, subcategory: subcategory });
    }
  };

  // Filter out restricted categories from the Recent Ads list
  const recentAds = MOCK_ADS.filter(ad => !RESTRICTED_CATEGORIES.includes(ad.category));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* Category Carousel (FloripaLocal Style) */}
      <CategoryCarousel onSelectCategory={handleCategorySelect} selectedId={selectedCategory} />

      <div className="container mx-auto px-4 py-8 space-y-10">
        
        {/* Banner Ad / Feature */}
        <section className="bg-brand-dark rounded-xl overflow-hidden shadow-lg relative h-40 md:h-64 flex items-center">
           {/* Gradient: Black on left to transparent on right */}
           <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900/90 to-transparent z-10"></div>
           
           {/* Image: Transaction/Selling context */}
           <img 
             src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1200&q=80" 
             className="absolute inset-0 w-full h-full object-cover object-center" 
             alt="Pessoas fazendo negócios"
           />
           
           <div className="relative z-20 px-8 md:px-12 max-w-xl">
              <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-3 inline-block">Destaque</span>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">Venda ou compre com segurança e rapidez.</h2>
              <button onClick={() => onNavigate('publish')} className="bg-white text-brand-dark font-bold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors">
                Anunciar Agora
              </button>
           </div>
        </section>

        {/* Recent Ads - Feed Style */}
        <section>
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-2">
            <h2 className="text-xl font-bold text-gray-800">Anúncios Recentes em SC</h2>
            <button onClick={() => onNavigate('listing')} className="text-brand-red text-sm font-semibold hover:underline flex items-center">
              Ver todos <Icon name="ChevronRight" size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {recentAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} onClick={(id) => onNavigate('detail', { id })} />
            ))}
            {/* Duplicate for visual fullness - filtered */}
            {recentAds.map((ad) => (
              <AdCard key={`${ad.id}-dup`} ad={{...ad, id: `${ad.id}-dup`}} onClick={(id) => onNavigate('detail', { id })} />
            ))}
          </div>

          <div className="mt-12 text-center">
             <button onClick={() => onNavigate('listing')} className="bg-white border border-gray-300 text-gray-600 font-bold py-3 px-8 rounded-full hover:bg-gray-50 shadow-sm transition-all transform hover:-translate-y-0.5">
               Carregar mais anúncios
             </button>
          </div>
        </section>

        {/* Official Stores / Partners */}
        <section className="pb-10">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Lojas Parceiras</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="min-w-[160px] bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-md transition-all">
                 <div className="w-20 h-20 bg-gray-50 rounded-full mb-4 flex items-center justify-center overflow-hidden border border-gray-100">
                    <img src={`https://picsum.photos/id/${i*33}/100/100`} className="w-full h-full object-cover" />
                 </div>
                 <h3 className="text-sm font-bold text-gray-800 mb-1">Loja Exemplo {i}</h3>
                 <span className="text-xs text-brand-red font-medium">Ver Loja</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
