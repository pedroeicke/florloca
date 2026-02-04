
import { Category, Ad, Store } from './types';
import React from 'react';

// Categories matching the user request with subcategories
export const CATEGORIES: Category[] = [
  {
    id: 'acompanhantes',
    name: 'Acompanhantes',
    icon: 'Heart',
    count: 0,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Mulheres', 'Homens', 'Trans', 'Massagem']
  },
  {
    id: 'imoveis',
    name: 'Imóveis',
    icon: 'Home',
    count: 0,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Apartamentos', 'Casas', 'Aluguel de quartos', 'Temporada', 'Terrenos, sítios e fazendas', 'Comércio e indústria']
  },

  {
    id: 'autos',
    name: 'Autos e Peças',
    icon: 'Car',
    count: 0,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Carros, vans e utilitários', 'Motos', 'Ônibus', 'Caminhões', 'Barcos e aeronaves', 'Autopeças']
  },
  {
    id: 'casa',
    name: 'Para a sua casa',
    icon: 'Armchair',
    count: 0,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Móveis', 'Eletrodomésticos', 'Materiais de construção', 'Jardinagem e construção', 'Cama, mesa e banho', 'Decoração']
  },
  {
    id: 'eletronicos',
    name: 'Eletrônicos e Celulares',
    icon: 'Smartphone',
    count: 0,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Celulares e Smartphones', 'Computadores e Desktops', 'Notebooks', 'Videogames', 'TVs e Vídeo', 'Áudio', 'Câmeras']
  },
  {
    id: 'empregos',
    name: 'Vagas de Emprego',
    icon: 'Briefcase',
    count: 0,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Administrativo', 'Vendas', 'Construção', 'Saúde', 'TI', 'Outras Vagas']
  },
  {
    id: 'servicos',
    name: 'Serviços',
    icon: 'Wrench',
    count: 0,
    image: 'https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Serviços Domésticos', 'Manutenção', 'Saúde e Beleza', 'Informática', 'Transporte', 'Turismo']
  },
  {
    id: 'musica',
    name: 'Música e Hobbies',
    icon: 'Music',
    count: 0,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Instrumentos musicais', 'Livros e revistas', 'Antiguidades', 'Coleções']
  },
  {
    id: 'esportes',
    name: 'Esportes e Lazer',
    icon: 'Dumbbell',
    count: 0,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Ciclismo', 'Fitness', 'Esportes Aquáticos', 'Camping']
  },
  {
    id: 'moda',
    name: 'Moda e Beleza',
    icon: 'Shirt',
    count: 0,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Roupas e calçados', 'Bolsas e acessórios', 'Beleza e saúde', 'Relógios e joias']
  },
  {
    id: 'infantil',
    name: 'Artigos Infantis',
    icon: 'Baby',
    count: 0,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Roupas', 'Brinquedos', 'Carrinhos', 'Berços e móveis']
  },
  {
    id: 'animais',
    name: 'Animais',
    icon: 'Dog',
    count: 0,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Cachorros', 'Gatos', 'Acessórios', 'Outros']
  },
  {
    id: 'agro',
    name: 'Agro e Indústria',
    icon: 'Tractor',
    count: 0,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    subcategories: ['Máquinas agrícolas', 'Produção rural', 'Indústria']
  }
];

// MOCK DATA REMOVED

export const STATES = ['SC', 'SP', 'RJ', 'MG', 'RS', 'PR', 'BA', 'PE', 'DF'];

export const STATE_DB_MAPPING: Record<string, string> = {
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  RJ: 'Rio de Janeiro',
  MG: 'Minas Gerais',
  RS: 'Rio Grande do Sul',
  PR: 'Paraná',
  BA: 'Bahia',
  PE: 'Pernambuco',
  DF: 'Distrito Federal'
};

// Mapping from UI Category IDs (constants) to Database Category Slugs
export const CATEGORY_DB_MAPPING: Record<string, string[]> = {
  'autos': ['carros-usados', 'motos-scooters', 'caminhoes-comerciais', 'onibus-venda', 'barcos-lanchas', 'pecas-acessorios', 'caravanas-trailers'],
  'imoveis': ['alugar-casa-apartamento', 'comprar-imovel', 'aluguel-temporada', 'lancamentos-imobiliarios', 'garagens-venda', 'imoveis-exterior', 'aluguel-temporada-exterior', 'terrenos-exterior', 'pontos-comerciais', 'terrenos-venda', 'aluguel-quarto', 'troca-de-imoveis'],
  'acompanhantes': ['acompanhantes', 'acompanhantes-trans', 'acompanhantes-masculinos', 'mulher-procura-homem', 'homem-procura-mulher', 'mulher-procura-mulher', 'homem-procura-homem', 'encontros', 'namoro', 'amizade'],
  'casa': ['moveis-decoracao', 'utilidades-domesticas', 'eletrodomesticos', 'jardinagem-construcao', 'materiais-construcao', 'artesanato', 'presentes'],
  'eletronicos': ['celulares-acessorios', 'computadores-perifericos', 'games-livros-filmes', 'tv-audio-video', 'frequencias-radio', 'telefonia-pabx', 'copiadoras-impressoras'],
  'empregos': ['vagas-emprego', 'estagios-trainee', 'curriculos', 'cuidador-idosos', 'empregada-domestica', 'trabalho-em-casa', 'servicos-domesticos', 'babas'],
  'moda': ['roupas-calcados', 'beleza-saude', 'joias-relogios', 'bolsas-malas-mochilas'],
  'musica': ['instrumentos-musicais', 'cds-dvds-discos'],
  'esportes': ['esportes-lazer', 'bicicletas-ciclismo'],
  'animais': ['animais-estimacao-venda', 'adocao-animais', 'servicos-animais'],
  'servicos': ['servicos-informatica', 'cursos-idiomas', 'turismo', 'traducoes', 'mudancas-fretes', 'profissionais-liberais', 'reformas-manutencao', 'saude-beleza', 'esoterismo', 'outros-servicos', 'cursos-informatica', 'cursos-profissionalizantes', 'aulas-particulares', 'esportes-danca', 'musica-teatro', 'outros-cursos'],
  'negocios': ['equipamentos-profissionais', 'negocios-industria']
};

export const SUBCATEGORY_DB_MAPPING: Record<string, string> = {
  // Autos
  'Carros, vans e utilitários': 'carros-usados',
  'Motos': 'motos-scooters',
  'Caminhões': 'caminhoes-comerciais',
  'Ônibus': 'onibus-venda',
  'Barcos e aeronaves': 'barcos-lanchas',
  'Autopeças': 'pecas-acessorios',
  // Acompanhantes
  'Mulheres': 'acompanhantes',
  'Homens': 'acompanhantes-masculinos',
  'Trans': 'acompanhantes-trans',
  // Eletronicos
  'Celulares e Smartphones': 'celulares-acessorios',
  'Computadores e Desktops': 'computadores-perifericos',
  'Notebooks': 'computadores-perifericos',
  'Videogames': 'games-livros-filmes',
  'TVs e Vídeo': 'tv-audio-video',
  'Áudio': 'tv-audio-video',
  // Empregos
  'Outras Vagas': 'vagas-emprego'
};

export const ACOMPANHANTES_SERVICES: string[] = [
  'Acompanhante',
  'Beijo na boca',
  'Festas e Eventos',
  'Inversão de papéis',
  'Massagem',
  'Massagem Tântrica',
  'Outras opções',
  'Striptease',
  'Ativa',
  'Dominação',
  'Fetiche',
  'Namoradinha',
  'Passiva',
  'Homens',
  'Mulheres',
  'Casais'
];
