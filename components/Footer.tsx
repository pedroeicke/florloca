import React from 'react';
import { Icon } from './Icon';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4 text-white">
              <div className="bg-brand-red p-1.5 rounded mr-2">
                <Icon name="ShoppingBag" className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold">ClassiWeb</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              O maior portal de classificados do Brasil. Encontre imóveis, veículos, empregos e muito mais com segurança e rapidez.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-brand-red cursor-pointer transition-colors">FB</div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-brand-red cursor-pointer transition-colors">IG</div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-brand-red cursor-pointer transition-colors">TW</div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">ClassiWeb</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Quem somos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trabalhe conosco</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mapa do site</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Ajuda</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dicas de segurança</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de privacidade</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Anunciante</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Entrar na minha conta</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Planos profissionais</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gerenciar anúncios</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2023 ClassiWeb. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <span>Brasil</span>
             <span>Portugal</span>
             <span>Itália</span>
             <span>França</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;