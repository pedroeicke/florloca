

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
  storeId?: string; // ID for linking to a store
  verified?: boolean;
  online?: boolean;
  age?: number;
  services?: string[];
  rates?: { time: string; value: number }[];
  ethnicity?: string;
  gender?: string;
}

export interface Store {
  id: string;
  name: string;
  slug?: string;
  description: string;
  logo: string;
  cover: string;
  whatsapp?: string;
  address?: string;
  verified: boolean;
  rating: number;
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
