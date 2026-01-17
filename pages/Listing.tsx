
import React, { useState, useEffect } from 'react';
import { MOCK_ADS, CATEGORIES, STATES, RESTRICTED_CATEGORIES } from '../constants';
import AdCard from '../components/AdCard';
import { Icon } from '../components/Icon';

interface ListingProps {
  onNavigate: (page: string, params?: any) => void;
  params?: any;
}

const Listing: React.FC<ListingProps> = ({ onNavigate, params }) => {
  // Helper to safely get string value, handling "undefined" string artifact
  const safeParam = (val: any) => {
    if (!val || val === 'undefined' || val === 'null') return '';
    return val;
  };

  const [filters, setFilters] = useState({
    search: safeParam(params?.query),
    category: safeParam(params?.category),
    subcategory: safeParam(params?.subcategory),
    minPrice: '',
    maxPrice: '',
    state: safeParam(params?.state),
    // Dynamic fields state holder
    minYear: '',
    maxYear: '',
    bedrooms: '',
    condition: ''
  });

  // Update filters when params change
  useEffect(() => {
    if (params) {
      setFilters(prev => ({
        ...prev,
        category: safeParam(params.category || prev.category),
        subcategory: safeParam(params.subcategory), // Always prioritize URL param
        state: safeParam(params.state || prev.state)
      }));
    }
  }, [params]);

  const filteredAds = MOCK_ADS.filter(ad => {
    // CATEGORY FILTERING
    if (filters.category) {
      // If a specific category is selected, only show ads from that category
      if (ad.category !== filters.category) return false;
    } else {
      // If NO category is selected (viewing "All"), EXCLUDE restricted categories
      if (RESTRICTED_CATEGORIES.includes(ad.category)) return false;
    }

    // SUBCATEGORY FILTERING
    // If filters.subcategory is '' (Ver todos), this check is skipped.
    // We also explicitly check against 'undefined' string just in case.
    if (filters.subcategory && filters.subcategory !== '' && filters.subcategory !== 'undefined' && ad.subcategory !== filters.subcategory) return false;

    if (filters.state && ad.state !== filters.state) return false;
    
    // Note: In a real app, you would filter by attributes here
    return true;
  });

  const handleCategoryChange = (catId: string) => {
    const isSameCategory = filters.category === catId;
    
    // Explicitly set subcategory to empty string to trigger "View All"
    const newParams = {
        ...params,
        category: catId,
        subcategory: '' // Force empty string
    };

    if (catId === '') {
        // Clearing category
        delete newParams.category;
    }

    setFilters({ ...filters, category: catId, subcategory: '' });
    onNavigate('listing', newParams);
  };

  const handleSubcategoryChange = (e: React.MouseEvent, sub: string) => {
    e.stopPropagation(); // Prevent triggering the category click
    setFilters({ ...filters, subcategory: sub });
    onNavigate('listing', { ...params, subcategory: sub });
  }

  const renderDynamicFilters = () => {
    switch (filters.category) {
      case 'imoveis':
        return (
          <div className="border-t border-gray-100 pt-6 mt-6 animate-fadeIn">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Icon name="Home" size={16} className="mr-2 text-gray-400"/> 
              Detalhes do Imóvel
            </h3>
            
            {/* Quartos */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quartos</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(num => (
                  <button 
                    key={num} 
                    className={`w-10 h-10 border rounded text-sm transition-colors font-medium ${filters.bedrooms === String(num) ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 hover:border-brand-red text-gray-600'}`}
                    onClick={() => setFilters({...filters, bedrooms: String(num)})}
                  >
                    {num}+
                  </button>
                ))}
              </div>
            </div>
            
            {/* Area */}
             <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Área (m²)</label>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" className="w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none" />
                  <input type="number" placeholder="Max" className="w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none" />
                </div>
              </div>

             <div className="mb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Vagas de Garagem</label>
                <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none">
                  <option>Qualquer</option>
                  <option>1 ou mais</option>
                  <option>2 ou mais</option>
                </select>
             </div>
          </div>
        );

      case 'autos':
        return (
          <div className="border-t border-gray-100 pt-6 mt-6 animate-fadeIn">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center">
               <Icon name="Car" size={16} className="mr-2 text-gray-400"/>
               Detalhes do Veículo
             </h3>
             
             {/* Year */}
             <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ano</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="De" 
                    className="w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none" 
                    value={filters.minYear}
                    onChange={e => setFilters({...filters, minYear: e.target.value})}
                  />
                  <input 
                    type="number" 
                    placeholder="Até" 
                    className="w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none"
                    value={filters.maxYear}
                    onChange={e => setFilters({...filters, maxYear: e.target.value})}
                  />
                </div>
              </div>

              {/* Gearbox */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Câmbio</label>
                <div className="space-y-2">
                  <label className="flex items-center text-sm text-gray-600">
                     <input type="checkbox" className="rounded text-brand-red focus:ring-brand-red mr-2" /> Automático
                  </label>
                  <label className="flex items-center text-sm text-gray-600">
                     <input type="checkbox" className="rounded text-brand-red focus:ring-brand-red mr-2" /> Manual
                  </label>
                </div>
              </div>

              {/* Fuel */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Combustível</label>
                <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none">
                  <option>Todos</option>
                  <option>Flex</option>
                  <option>Gasolina</option>
                  <option>Diesel</option>
                  <option>Elétrico</option>
                </select>
              </div>

               <div className="mb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quilometragem</label>
                <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none">
                  <option>Qualquer</option>
                  <option>Até 30.000 km</option>
                  <option>Até 60.000 km</option>
                  <option>Até 100.000 km</option>
                </select>
             </div>
          </div>
        );

      case 'eletronicos':
      case 'casa':
      case 'moda':
      case 'musica':
      case 'esportes':
         return (
           <div className="border-t border-gray-100 pt-6 mt-6 animate-fadeIn">
             <h3 className="font-bold text-gray-900 mb-4">Condição</h3>
             <div className="space-y-2">
               <label className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                 <input 
                   type="radio" 
                   name="condition" 
                   className="mr-2 text-brand-red focus:ring-brand-red"
                   checked={filters.condition === 'new'}
                   onChange={() => setFilters({...filters, condition: 'new'})}
                 /> 
                 Novo
               </label>
               <label className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                 <input 
                   type="radio" 
                   name="condition"
                   className="mr-2 text-brand-red focus:ring-brand-red"
                   checked={filters.condition === 'used'}
                   onChange={() => setFilters({...filters, condition: 'used'})}
                 /> 
                 Usado
               </label>
             </div>
           </div>
         );
      
      case 'empregos':
          return (
            <div className="border-t border-gray-100 pt-6 mt-6 animate-fadeIn">
             <h3 className="font-bold text-gray-900 mb-4">Tipo de Contrato</h3>
             <div className="space-y-2">
                {['CLT (Efetivo)', 'PJ', 'Temporário', 'Estágio', 'Freelance'].map(type => (
                   <label key={type} className="flex items-center text-sm text-gray-600">
                     <input type="checkbox" className="rounded text-brand-red focus:ring-brand-red mr-2" /> {type}
                   </label>
                ))}
             </div>
             <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Salário Mínimo</label>
                <input type="number" placeholder="R$ 0,00" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none" />
             </div>
            </div>
          );

      default:
        return null;
    }
  };

  const selectedCategoryData = CATEGORIES.find(c => c.id === filters.category);

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-16">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span onClick={() => onNavigate('home')} className="cursor-pointer hover:text-brand-red">Home</span>
            <Icon name="ChevronRight" size={14} className="mx-2" />
            <span className="font-medium text-gray-900">Anúncios</span>
            {filters.subcategory && filters.subcategory !== 'undefined' && (
              <>
                <Icon name="ChevronRight" size={14} className="mx-2" />
                <span className="font-medium text-brand-red">{filters.subcategory}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {filters.category 
              ? (filters.subcategory && filters.subcategory !== 'undefined' ? `${filters.subcategory}` : selectedCategoryData?.name)
              : 'Todos os Anúncios'}
            <span className="text-lg font-normal text-gray-500 ml-3">{filteredAds.length} resultados</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
              
              {/* Category Navigation (Accordion Style) */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gray-900">Categorias</h2>
                  {filters.category && (
                    <button 
                      onClick={() => handleCategoryChange('')}
                      className="text-xs text-brand-red font-medium hover:underline"
                    >
                      Limpar filtro
                    </button>
                  )}
                </div>
                
                <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {CATEGORIES.filter(cat => {
                    // Hide restricted categories from sidebar unless actively viewing that category
                    if (RESTRICTED_CATEGORIES.includes(cat.id)) {
                      return filters.category === cat.id;
                    }
                    return true;
                  }).map(cat => {
                    const isSelected = filters.category === cat.id;
                    
                    return (
                      <div key={cat.id} className="w-full">
                        {/* Main Category Button */}
                        <button 
                          onClick={() => handleCategoryChange(cat.id)}
                          className={`w-full text-left flex items-center justify-between text-sm p-2 rounded transition-colors ${isSelected ? 'text-brand-red font-bold bg-red-50' : 'text-gray-600 hover:text-brand-red hover:bg-gray-50'}`}
                        >
                          <div className="flex items-center">
                            <Icon name={cat.icon} size={16} className={`mr-2 ${isSelected ? 'text-brand-red' : 'opacity-70'}`} />
                            {cat.name}
                          </div>
                          {isSelected ? (
                             <Icon name="ChevronDown" size={14} />
                          ) : (
                             <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{cat.count}</span>
                          )}
                        </button>
                        
                        {/* Subcategories Expansion */}
                        {isSelected && cat.subcategories.length > 0 && (
                          <div className="ml-2 pl-4 border-l-2 border-red-100 mt-1 space-y-1 animate-fadeIn">
                             {/* "Ver todos" Option - Always Active if subcategory is empty or undefined */}
                             <button
                                onClick={(e) => handleSubcategoryChange(e, '')}
                                className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors flex items-center justify-between ${!filters.subcategory || filters.subcategory === 'undefined' ? 'text-brand-red font-bold bg-white shadow-sm' : 'text-gray-500 hover:text-brand-red'}`}
                             >
                               <span>Ver todos em {cat.name}</span>
                               {(!filters.subcategory || filters.subcategory === 'undefined') && <Icon name="CheckCircle" size={14} className="text-brand-red" />}
                             </button>

                             {/* List of Subcategories */}
                             {cat.subcategories.map(sub => (
                               <button
                                 key={sub}
                                 onClick={(e) => handleSubcategoryChange(e, sub)}
                                 className={`w-full text-left text-sm py-1.5 px-2 rounded transition-colors flex items-center justify-between ${filters.subcategory === sub ? 'text-brand-red font-bold bg-white shadow-sm' : 'text-gray-500 hover:text-brand-red'}`}
                               >
                                 <span>{sub}</span>
                                 {filters.subcategory === sub && <Icon name="CheckCircle" size={14} className="text-brand-red" />}
                               </button>
                             ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-gray-200 my-6"></div>

              {/* Common Filters */}
              <div className="flex justify-between items-center mb-6">
                 <h2 className="font-bold text-gray-900">Filtrar por</h2>
                 <button 
                    onClick={() => setFilters({ ...filters, minPrice: '', maxPrice: '', state: '', minYear: '', maxYear: '', bedrooms: '', condition: '' })}
                    className="text-xs text-brand-red font-medium"
                 >
                   Limpar
                 </button>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Localização</label>
                <div className="relative">
                  <Icon name="MapPin" size={16} className="absolute left-3 top-3 text-gray-400" />
                  <select 
                    className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none appearance-none"
                    value={filters.state}
                    onChange={(e) => setFilters({...filters, state: e.target.value})}
                  >
                    <option value="">Todo Brasil</option>
                    {STATES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                  <Icon name="ChevronDown" size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Preço (R$)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
              </div>

              {/* DYNAMIC FILTERS AREA */}
              {renderDynamicFilters()}

              <button className="w-full bg-brand-red text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors mt-8 shadow-sm">
                Aplicar Filtros
              </button>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="w-full lg:w-3/4">
            
            {/* Sort & View Options */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div className="text-sm text-gray-500">
                Mostrando <span className="font-bold text-gray-900">1-{filteredAds.length}</span> de {filteredAds.length}
              </div>
              <div className="flex items-center gap-4">
                <select className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer">
                  <option>Mais relevantes</option>
                  <option>Menor preço</option>
                  <option>Maior preço</option>
                  <option>Mais recentes</option>
                </select>
              </div>
            </div>

            {/* List */}
            {filteredAds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad} onClick={(id) => onNavigate('detail', { id })} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                <Icon name="Search" className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-700">Nenhum anúncio encontrado</h3>
                <p className="text-gray-500">Tente ajustar seus filtros de busca.</p>
                <button 
                  onClick={() => handleCategoryChange('')}
                  className="mt-4 text-brand-red font-semibold hover:underline"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}

            {/* Pagination Mock */}
            {filteredAds.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                     &lt;
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-red text-white font-bold shadow-md">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">2</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium">3</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50">
                     &gt;
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Listing;
