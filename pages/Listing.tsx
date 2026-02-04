
import { buildLocationSlug, extractRatesFromAttributes, getMinRateValue, slugify } from '../utils';
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Ad } from '../types';
import { CATEGORIES, CATEGORY_DB_MAPPING, STATE_DB_MAPPING, SUBCATEGORY_DB_MAPPING, STATES } from '../constants';
import AdCard from '../components/AdCard';
import { Icon } from '../components/Icon';
import SEO from '../components/SEO';

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

  const [sortOption, setSortOption] = useState<'recent' | 'relevance' | 'price_asc' | 'price_desc'>('recent');

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

  const [listingAds, setListingAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('listings')
          .select('*, slug, categories!inner(slug, name)');
        query = query.order('created_at', { ascending: false });

        if (filters.category) {
          const mappedSlugs = CATEGORY_DB_MAPPING[filters.category];
          if (mappedSlugs) {
            query = query.in('categories.slug', mappedSlugs);
          } else {
            query = query.eq('categories.slug', filters.category);
          }
        }

        const mappedSubSlug = filters.subcategory && filters.subcategory !== '' && filters.subcategory !== 'undefined'
          ? SUBCATEGORY_DB_MAPPING[filters.subcategory]
          : undefined;

        if (mappedSubSlug) {
          query = query.eq('categories.slug', mappedSubSlug);
        } else if (filters.subcategory && filters.subcategory !== '' && filters.subcategory !== 'undefined') {
          query = query.eq('subcategory', filters.subcategory);
        }

        if (filters.state) {
          const mappedState = STATE_DB_MAPPING[filters.state];
          if (mappedState) {
            query = query.in('state', [filters.state, mappedState]);
          } else {
            const reverseMapped = Object.entries(STATE_DB_MAPPING).find(([, full]) => full === filters.state)?.[0];
            if (reverseMapped) query = query.in('state', [filters.state, reverseMapped]);
            else query = query.eq('state', filters.state);
          }
        }

        if (filters.minPrice) {
          query = query.gte('price', Number(filters.minPrice));
        }
        if (filters.maxPrice) {
          query = query.lte('price', Number(filters.maxPrice));
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching filtered ads:', error);
          return;
        }

        if (data && data.length > 0) {
          const mappedAds: Ad[] = data.map((item: any) => {
            const attrs = (item.attributes as any) || {};
            const derivedRates = extractRatesFromAttributes(attrs);
            const derivedMinRate = derivedRates.length > 0 ? getMinRateValue(derivedRates) : null;
            const derivedPrice =
              typeof item.price === 'number' && item.price > 0
                ? item.price
                : (typeof derivedMinRate === 'number' ? derivedMinRate : 0);

            return {
            id: item.id,
            slug: item.slug || undefined,
            title: item.title,
            price: derivedPrice,
            category: item.categories?.slug || 'geral',
            subcategory: item.subcategory || undefined,
            location: item.city || item.location || '',
            state: item.state || 'SC',
            image: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/300',
            images: Array.isArray(item.images) ? item.images : [],
            description: item.description || '',
            attributes: (item.attributes as Record<string, string | number>) || {},
            createdAt: item.created_at || new Date().toISOString(),
            isVip: item.is_vip || false,
            tier: (item.tier as 'free' | 'highlight' | 'premium') || 'free',
            verified: item.verified || false,
            online: false,
            age: item.age || undefined
            };
          });

          // Client-side filtering for complex JSONB attributes if not done in DB
          let result = mappedAds;
          if (filters.minYear) result = result.filter(ad => Number(ad.attributes?.year || 0) >= Number(filters.minYear));
          if (filters.maxYear) result = result.filter(ad => Number(ad.attributes?.year || 0) <= Number(filters.maxYear));
          if (filters.bedrooms) result = result.filter(ad => Number(ad.attributes?.bedrooms || 0) >= Number(filters.bedrooms));

          const sorted = [...result].sort((a, b) => {
            if (sortOption === 'price_asc') return (a.price || 0) - (b.price || 0);
            if (sortOption === 'price_desc') return (b.price || 0) - (a.price || 0);
            if (sortOption === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

            const tierRank = (tier?: Ad['tier']) => (tier === 'premium' ? 3 : tier === 'highlight' ? 2 : 1);
            const verifiedRank = (v?: boolean) => (v ? 1 : 0);
            const vipRank = (v?: boolean) => (v ? 1 : 0);

            const tierDiff = tierRank(b.tier) - tierRank(a.tier);
            if (tierDiff !== 0) return tierDiff;

            const verifiedDiff = verifiedRank(b.verified) - verifiedRank(a.verified);
            if (verifiedDiff !== 0) return verifiedDiff;

            const vipDiff = vipRank(b.isVip) - vipRank(a.isVip);
            if (vipDiff !== 0) return vipDiff;

            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });

          setListingAds(sorted);
        } else {
          setListingAds([]);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [filters, sortOption]); // Re-run when filters/sort change

  // Fetch category counts dynamically
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('category_id, categories!inner(slug)');

        if (error) {
          console.error('Error fetching category counts:', error);
          return;
        }

        if (data) {
          const rawCounts: Record<string, number> = {};
          data.forEach((item: any) => {
            const slug = item.categories?.slug;
            if (slug) {
              rawCounts[slug] = (rawCounts[slug] || 0) + 1;
            }
          });

          // Aggregate counts for UI categories
          const aggregatedCounts: Record<string, number> = {};
          CATEGORIES.forEach(cat => {
            const slugs = CATEGORY_DB_MAPPING[cat.id] || [cat.id];
            let sum = 0;
            slugs.forEach(s => sum += rawCounts[s] || 0);
            aggregatedCounts[cat.id] = sum;
          });

          setCategoryCounts(aggregatedCounts);
        }
      } catch (err) {
        console.error('Unexpected error fetching counts:', err);
      }
    };

    fetchCounts();
  }, []);

  const filteredAds = listingAds; // Alias for compatibility with render

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
              <Icon name="Home" size={16} className="mr-2 text-gray-400" />
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
                    onClick={() => setFilters({ ...filters, bedrooms: String(num) })}
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
              <Icon name="Car" size={16} className="mr-2 text-gray-400" />
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
                  onChange={e => setFilters({ ...filters, minYear: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Até"
                  className="w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none"
                  value={filters.maxYear}
                  onChange={e => setFilters({ ...filters, maxYear: e.target.value })}
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
                  onChange={() => setFilters({ ...filters, condition: 'new' })}
                />
                Novo
              </label>
              <label className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                <input
                  type="radio"
                  name="condition"
                  className="mr-2 text-brand-red focus:ring-brand-red"
                  checked={filters.condition === 'used'}
                  onChange={() => setFilters({ ...filters, condition: 'used' })}
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

  // Dynamic SEO Title Construction
  let seoTitle = 'Anúncios de Classificados';
  let seoDesc = 'Encontre tudo o que precisa no Brick Certo.';
  const keywords = ['classificados', 'comprar', 'vender'];

  if (filters.category) {
    const catName = filters.subcategory && filters.subcategory !== 'undefined' ? filters.subcategory : selectedCategoryData?.name || filters.category;
    seoTitle = `${catName} ${filters.state ? `em ${filters.state}` : 'no Brasil'}`;
    seoDesc = `Encontre ${catName} ${filters.state ? `em ${filters.state}` : 'em todo o Brasil'}. As melhores opções de ${catName} você encontra aqui.`;
    keywords.push(catName.toLowerCase(), `comprar ${catName.toLowerCase()}`);

    if (filters.state) {
      keywords.push(`${catName.toLowerCase()} ${filters.state.toLowerCase()}`);
    }

    if (filters.category === 'acompanhantes') {
      seoTitle = `Acompanhantes e Garotas de Programa ${filters.state ? `em ${filters.state}` : ''} | Brick Certo`;
      keywords.push('garotas de programa', 'acompanhantes de luxo', 'massagem erótica');
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-16">
      <SEO
        title={seoTitle}
        description={seoDesc}
        keywords={keywords}
      />
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

              {/* Common Filters - MOVED UP */}
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
                    onChange={(e) => setFilters({ ...filters, state: e.target.value })}
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
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded text-sm focus:border-brand-red focus:outline-none"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
              </div>

              {/* DYNAMIC FILTERS AREA */}
              {renderDynamicFilters()}

              <button className="w-full bg-brand-red text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors mt-8 mb-8 shadow-sm">
                Aplicar Filtros
              </button>

              <div className="h-px bg-gray-200 mb-8"></div>


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
                  {CATEGORIES.map(cat => {
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
                            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{categoryCounts[cat.id] || 0}</span>
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
                <select
                  className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                >
                  <option value="relevance">Mais relevantes</option>
                  <option value="price_asc">Menor preço</option>
                  <option value="price_desc">Maior preço</option>
                  <option value="recent">Mais recentes</option>
                </select>
              </div>
            </div>

            {/* List */}
            {filteredAds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAds.map(ad => (
                  <AdCard
                    key={ad.id}
                    ad={ad}
                    onClick={(id, slug) => {
                      if (slug && ad.location && ad.category) {
                        const locationSlug = buildLocationSlug(ad.location, ad.state);
                        const categorySlug = slugify(ad.category);
                        onNavigate(`${locationSlug}/${categorySlug}/${slug}`);
                      } else if (slug) {
                        onNavigate('anuncio/' + slug);
                      } else {
                        onNavigate('detail', { id });
                      }
                    }}
                  />
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
