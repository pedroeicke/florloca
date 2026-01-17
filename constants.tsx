
import { Category, Ad } from './types';
import React from 'react';

export const RESTRICTED_CATEGORIES = ['adultos', 'relacionamentos'];

// Categories matching the user request with subcategories
export const CATEGORIES: Category[] = [
  { 
    id: 'imoveis', 
    name: 'Imóveis', 
    icon: 'Home', 
    count: 1240, 
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Apartamentos', 'Casas', 'Aluguel de quartos', 'Temporada', 'Terrenos, sítios e fazendas', 'Comércio e indústria']
  },
  { 
    id: 'autos', 
    name: 'Autos e Peças', 
    icon: 'Car', 
    count: 850, 
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Carros, vans e utilitários', 'Motos', 'Ônibus', 'Caminhões', 'Barcos e aeronaves', 'Autopeças']
  },
  { 
    id: 'casa', 
    name: 'Para a sua casa', 
    icon: 'Armchair', 
    count: 540, 
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Móveis', 'Eletrodomésticos', 'Materiais de construção', 'Jardinagem e construção', 'Cama, mesa e banho', 'Decoração']
  },
  { 
    id: 'eletronicos', 
    name: 'Eletrônicos e Celulares', 
    icon: 'Smartphone', 
    count: 2100, 
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Celulares e Smartphones', 'Computadores e Desktops', 'Notebooks', 'Videogames', 'TVs e Vídeo', 'Áudio', 'Câmeras']
  },
  { 
    id: 'empregos', 
    name: 'Vagas de Emprego', 
    icon: 'Briefcase', 
    count: 320, 
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Administrativo', 'Vendas', 'Construção', 'Saúde', 'TI', 'Outras Vagas']
  },
  { 
    id: 'servicos', 
    name: 'Serviços', 
    icon: 'Wrench', 
    count: 540, 
    image: 'https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Serviços Domésticos', 'Manutenção', 'Saúde e Beleza', 'Informática', 'Transporte', 'Turismo']
  },
  { 
    id: 'musica', 
    name: 'Música e Hobbies', 
    icon: 'Music', 
    count: 120, 
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Instrumentos musicais', 'Livros e revistas', 'Antiguidades', 'Coleções']
  },
  { 
    id: 'esportes', 
    name: 'Esportes e Lazer', 
    icon: 'Dumbbell', 
    count: 210, 
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Ciclismo', 'Fitness', 'Esportes Aquáticos', 'Camping']
  },
  { 
    id: 'moda', 
    name: 'Moda e Beleza', 
    icon: 'Shirt', 
    count: 50, 
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Roupas e calçados', 'Bolsas e acessórios', 'Beleza e saúde', 'Relógios e joias']
  },
  { 
    id: 'infantil', 
    name: 'Artigos Infantis', 
    icon: 'Baby', 
    count: 150, 
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Roupas', 'Brinquedos', 'Carrinhos', 'Berços e móveis']
  },
  { 
    id: 'animais', 
    name: 'Animais', 
    icon: 'Dog', 
    count: 80, 
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Cachorros', 'Gatos', 'Acessórios', 'Outros']
  },
  { 
    id: 'agro', 
    name: 'Agro e Indústria', 
    icon: 'Tractor', 
    count: 45, 
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Máquinas agrícolas', 'Produção rural', 'Indústria']
  },
  { 
    id: 'relacionamentos', 
    name: 'Relacionamentos', 
    icon: 'Heart', 
    count: 200, 
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Homens', 'Mulheres', 'Amizades']
  },
  { 
    id: 'adultos', 
    name: 'Acompanhantes', 
    icon: 'Users', 
    count: 100, 
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Acompanhantes', 'Massagem', 'Trans', 'Masculinos']
  }
];

export const MOCK_ADS: Ad[] = [
  {
    id: 'adult-1',
    title: 'Luana',
    price: 300,
    category: 'adultos',
    subcategory: 'Acompanhantes',
    location: 'Ingleses - Florianópolis',
    state: 'SC',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80'],
    description: 'Oii amores, tudo bem? sou uma loira bem safada e gulosa, adoro preliminares e sentar gostoso, meu atendimento é bem tranquilo sou estilo namoradinha, realizo fetiches e faço inversão. Atendo em um local bem discreto e climatizado com toalhas limpinhas e ducha. Me chame e vamos agendar um horário para gozar gostoso.',
    attributes: {},
    createdAt: 'Há 10 min',
    isVip: true,
    tier: 'premium',
    age: 24,
    verified: true,
    online: true,
    ethnicity: 'Branco',
    gender: 'Mulher',
    languages: ['Português', 'Outros'],
    targetAudience: ['Homens', 'Casais'],
    locationType: 'Local próprio, Hotéis e Motéis',
    services: [
        'Acompanhante', 'Beijo na boca', 'Festas e Eventos', 'Inversão de papéis', 'Passiva',
        'Ativa', 'Dominação', 'Fetiche', 'Massagem', 'Striptease'
    ],
    rates: [
        { time: '30 minutos', value: 150 },
        { time: '1 hora', value: 300 },
        { time: '2 horas', value: 550 }
    ]
  },
  {
    id: 'adult-2',
    title: 'Julia',
    price: 500,
    category: 'adultos',
    subcategory: 'Acompanhantes',
    location: 'Jurerê Internacional',
    state: 'SC',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'],
    description: 'Atendimento de alto nível para homens exigentes.',
    attributes: {},
    createdAt: 'Há 30 min',
    isVip: true,
    tier: 'highlight',
    age: 28,
    verified: true,
    online: true,
    ethnicity: 'Morena',
    gender: 'Mulher',
    services: ['Acompanhante', 'Jantares', 'Viagens'],
    rates: [
        { time: '1 hora', value: 500 },
        { time: '2 horas', value: 900 }
    ]
  },
  {
    id: 'adult-3',
    title: 'Fernanda',
    price: 150,
    category: 'adultos',
    subcategory: 'Acompanhantes',
    location: 'Centro - Florianópolis',
    state: 'SC',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'],
    description: 'Recém chegada na cidade. Carinhosa e atenciosa. Atendo em local próprio.',
    attributes: {},
    createdAt: 'Há 1 hora',
    isVip: false,
    tier: 'free',
    age: 21,
    verified: false,
    online: false,
    ethnicity: 'Parda',
    gender: 'Mulher',
    services: ['Acompanhante', 'Massagem'],
    rates: [
        { time: '1 hora', value: 150 }
    ]
  },
  {
    id: '1',
    title: 'Apartamento 2 Quartos Centro - Vista Mar',
    price: 350000,
    category: 'imoveis',
    subcategory: 'Apartamentos',
    location: 'Florianópolis, SC',
    state: 'SC',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
    description: 'Lindo apartamento reformado no centro da cidade. Próximo a metrô e comércio. Vista espetacular.',
    attributes: { 'Quartos': 2, 'Área': '65m²', 'Vagas': 1 },
    createdAt: 'Há 20 min',
    isVip: true,
    tier: 'highlight'
  },
  {
    id: '2',
    title: 'Honda Civic 2020 Touring Turbo',
    price: 125900,
    category: 'autos',
    subcategory: 'Carros, vans e utilitários',
    location: 'Curitiba, PR',
    state: 'PR',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80'],
    description: 'Carro em estado de zero, todas as revisões na concessionária.',
    attributes: { 'Ano': 2020, 'Km': 45000, 'Combustível': 'Flex' },
    createdAt: 'Há 1 hora',
    isVip: true,
    tier: 'premium'
  },
  {
    id: '3',
    title: 'MacBook Pro M1 16GB 512GB',
    price: 8500,
    category: 'eletronicos',
    subcategory: 'Notebooks',
    location: 'São Paulo, SP',
    state: 'SP',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80'],
    description: 'Máquina voando baixo. Bateria 98%. Sem detalhes.',
    attributes: { 'Memória': '16GB', 'Armazenamento': '512GB' },
    createdAt: 'Há 2 horas',
    isVip: false,
    tier: 'free'
  },
  {
    id: '4',
    title: 'Sofá Retrátil 3 Lugares',
    price: 1200,
    category: 'casa',
    subcategory: 'Móveis',
    location: 'Porto Alegre, RS',
    state: 'RS',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'],
    description: 'Sofá muito confortável, suede marrom. Retrátil e reclinável.',
    attributes: { 'Condição': 'Usado', 'Cor': 'Marrom' },
    createdAt: 'Há 3 horas',
    isVip: false,
    tier: 'free'
  },
  {
    id: '5',
    title: 'Filhotes de Golden Retriever',
    price: 2000,
    category: 'animais',
    subcategory: 'Cachorros',
    location: 'Belo Horizonte, MG',
    state: 'MG',
    image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=800&q=80'],
    description: 'Filhotes vacinados e vermifugados, pais com pedigree.',
    attributes: { 'Raça': 'Golden', 'Idade': '2 meses' },
    createdAt: 'Ontem',
    isVip: false,
    tier: 'free'
  },
  {
    id: '6',
    title: 'Guitarra Fender Stratocaster',
    price: 5500,
    category: 'musica',
    subcategory: 'Instrumentos musicais',
    location: 'Rio de Janeiro, RJ',
    state: 'RJ',
    image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=800&q=80'],
    description: 'Guitarra original mexicana. Som incrível. Acompanha case.',
    attributes: { 'Marca': 'Fender', 'Modelo': 'Stratocaster' },
    createdAt: 'Ontem',
    isVip: false,
    tier: 'free'
  },
];

export const STATES = ['SC', 'SP', 'RJ', 'MG', 'RS', 'PR', 'BA', 'PE', 'DF'];
