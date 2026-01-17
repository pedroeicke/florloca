
export interface Ad {
  id: string;
  title: string;
  price: number;
  category: string;
  subcategory?: string;
  location: string;
  state: string;
  image: string;
  images: string[];
  description: string;
  attributes: Record<string, string | number>;
  createdAt: string;
  isVip?: boolean; // Mantido para compatibilidade, mas o visual será guiado pelo 'tier'
  tier?: 'free' | 'highlight' | 'premium'; 
  // Adult Specific Fields
  age?: number;
  verified?: boolean;
  online?: boolean;
  ethnicity?: string;
  gender?: string;
  languages?: string[];
  targetAudience?: string[]; // "Atendo"
  services?: string[];
  rates?: { time: string; value: number }[];
  locationType?: string; // "Local próprio, Hoteis..."
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  image: string;
  subcategories: string[];
}

export interface FilterState {
  search: string;
  category: string;
  subcategory?: string;
  minPrice: number | '';
  maxPrice: number | '';
  location: string;
}
