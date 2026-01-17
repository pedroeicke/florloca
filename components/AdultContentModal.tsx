
import React from 'react';
import { Icon } from './Icon';

interface AdultContentModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const AdultContentModal: React.FC<AdultContentModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - Changed to solid white as requested to hide content behind */}
      <div 
        className="absolute inset-0 bg-white transition-opacity"
        onClick={onCancel}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn border border-gray-100">
        
        {/* Header */}
        <div className="bg-brand-red p-6 text-white rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold flex items-center">
              <Icon name="AlertTriangle" className="mr-3" size={28} />
              Conteúdo adulto
            </h2>
            <button onClick={onCancel} className="text-white/80 hover:text-white transition-colors">
              <Icon name="X" size={24} />
            </button>
          </div>
          <p className="text-white/90 font-medium">FloripaLocal</p>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 text-gray-700 space-y-6">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm leading-relaxed">
            <p className="font-semibold mb-2 text-gray-900">Aviso Legal:</p>
            O FloripaLocal é uma plataforma onde se pode encontrar anúncios de profissionais independentes. O FloripaLocal não é uma agência de acompanhantes e não participa de nenhuma etapa das negociações entre anunciantes e interessados.
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Termos de Uso</h3>
            <p className="mb-4 text-sm font-semibold text-gray-600">Para acessar esta categoria você precisa confirmar que:</p>
            
            <ul className="space-y-3 text-sm list-none">
              <li className="flex items-start">
                <Icon name="CheckCircle" size={18} className="text-brand-red mr-3 shrink-0 mt-0.5" />
                <span>Você é maior de 18 anos ou se encaixa no mínimo estabelecido de maioridade de acordo com a legislação atual do local de onde está acessando o site.</span>
              </li>
              <li className="flex items-start">
                <Icon name="CheckCircle" size={18} className="text-brand-red mr-3 shrink-0 mt-0.5" />
                <span>Você entende que esta parte do site apresenta conteúdo explicito, por isso requer maioridade para acessar, incluindo nudez e imagens natureza sexual.</span>
              </li>
              <li className="flex items-start">
                <Icon name="CheckCircle" size={18} className="text-brand-red mr-3 shrink-0 mt-0.5" />
                <span>Você não vai copiar ou divulgar qualquer conteúdo do site sem consentimento expresso do dono do conteúdo.</span>
              </li>
              <li className="flex items-start">
                <Icon name="CheckCircle" size={18} className="text-brand-red mr-3 shrink-0 mt-0.5" />
                <span>Você está acessando o site de uma localidade em que é permitido por lei acessar sites de conteúdo adulto e material explícito de natureza sexual.</span>
              </li>
              <li className="flex items-start">
                <Icon name="CheckCircle" size={18} className="text-brand-red mr-3 shrink-0 mt-0.5" />
                <span>Você não vai permitir que menores de idade tenham acesso a esta parte do site.</span>
              </li>
              <li className="flex items-start">
                <Icon name="CheckCircle" size={18} className="text-brand-red mr-3 shrink-0 mt-0.5" />
                <span>Você leu e concorda com os Termos de Uso e Política de Privacidade do site.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="p-6 border-t border-gray-100 flex flex-col md:flex-row gap-4 justify-end bg-gray-50 rounded-b-lg">
          <button 
            onClick={onCancel}
            className="px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition-colors border border-gray-300"
          >
            Voltar
          </button>
          <button 
            onClick={onConfirm}
            className="px-8 py-3 rounded-lg font-bold text-white bg-brand-red hover:bg-red-700 shadow-md transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
          >
            Eu concordo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdultContentModal;
