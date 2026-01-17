import React, { useRef, useState } from 'react';
import { CATEGORIES } from '../constants';
import { Icon } from './Icon';

interface CategoryCarouselProps {
  onSelectCategory: (id: string, subcategory?: string) => void;
  selectedId?: string | null;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ onSelectCategory, selectedId }) => {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number} | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (id: string) => {
    onSelectCategory(id);
    setHoveredCategory(null);
  };

  const handleSubcategoryClick = (e: React.MouseEvent, id: string, subcategory: string) => {
    e.stopPropagation();
    onSelectCategory(id, subcategory);
    setHoveredCategory(null);
  };

  const handleMouseEnter = (id: string, e: React.MouseEvent<HTMLLIElement>) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom, left: rect.left });
    setHoveredCategory(id);
  };

  const handleMouseLeave = () => {
     closeTimeoutRef.current = setTimeout(() => {
       setHoveredCategory(null);
     }, 100);
  };

  const handleDropdownEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  const activeCategory = CATEGORIES.find(c => c.id === hoveredCategory);

  return (
    <>
      <div className="bg-white border-b border-gray-200 relative z-40">
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <div className="max-w-[98%] mx-auto px-2 md:px-6 flex items-center h-16">
          <div className="flex-1 flex items-center relative max-w-full gap-2">
            
            <button 
              className="bg-white border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-lg text-gray-500 cursor-pointer shadow-sm z-20 shrink-0 hover:text-brand-red hover:border-brand-red transition-all"
              onClick={scrollLeft} 
              aria-label="Scroll Left"
            >
              ‹
            </button>
            
            <ul 
              className="no-scrollbar list-none flex gap-3 items-center overflow-x-auto scroll-smooth px-1 whitespace-nowrap w-full h-full" 
              ref={scrollContainerRef}
            >
              {/* Item fixo "Favoritos" */}
              <li className="whitespace-nowrap shrink-0 cursor-pointer group flex items-center relative">
                <button 
                  className="flex items-center gap-2 no-underline text-gray-600 text-sm py-2 px-4 rounded-full bg-white border border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all group-hover:bg-white group-hover:border-brand-red group-hover:text-brand-red group-hover:shadow-md h-10"
                  onClick={() => {}} 
                >
                  <span className="flex items-center justify-center">
                    <Icon name="Heart" size={18} />
                  </span>
                  <span>Favoritos</span>
                </button>
              </li>
              
              {/* Itens dinâmicos das categorias */}
              {CATEGORIES.map((cat) => (
                <li
                  key={cat.id}
                  className="whitespace-nowrap shrink-0 cursor-pointer group flex items-center relative"
                  onMouseEnter={(e) => handleMouseEnter(cat.id, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`flex items-center gap-2 no-underline text-sm py-2 px-4 rounded-full bg-white border shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all h-10 relative z-10
                      ${selectedId === cat.id 
                        ? 'border-brand-red text-brand-red shadow-md' 
                        : 'border-transparent text-gray-600 group-hover:border-brand-red group-hover:text-brand-red group-hover:shadow-md'
                      }`}
                  >
                    <span className="flex items-center justify-center">
                      <Icon name={cat.icon} size={18} />
                    </span>
                    <span>{cat.name}</span>
                    {cat.subcategories.length > 0 && (
                      <Icon name="ChevronDown" size={12} className={`ml-1 transition-transform ${hoveredCategory === cat.id ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
            
            <button 
              className="bg-white border border-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-lg text-gray-500 cursor-pointer shadow-sm z-20 shrink-0 hover:text-brand-red hover:border-brand-red transition-all"
              onClick={scrollRight} 
              aria-label="Scroll Right"
            >
              ›
            </button>

          </div>
        </div>
      </div>

      {/* Dropdown Rendered Outside of Overflow Container (Fixed Positioning) */}
      {hoveredCategory && activeCategory && activeCategory.subcategories.length > 0 && dropdownPos && (
        <div 
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-[60] animate-fadeIn text-left min-w-[200px]"
          style={{ top: dropdownPos.top + 4, left: dropdownPos.left }}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleMouseLeave}
        >
            {activeCategory.subcategories.map((sub, idx) => (
                <div 
                  key={idx}
                  onClick={(e) => handleSubcategoryClick(e, activeCategory.id, sub)}
                  className="px-4 py-2.5 text-sm text-gray-600 hover:text-brand-red hover:bg-gray-50 cursor-pointer transition-colors block"
                >
                  {sub}
                </div>
              ))}
        </div>
      )}
    </>
  );
};

export default CategoryCarousel;