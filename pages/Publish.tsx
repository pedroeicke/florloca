import React, { useState } from 'react';
import { CATEGORIES, STATES } from '../constants';
import { Icon } from '../components/Icon';

interface PublishProps {
  onNavigate: (page: string) => void;
}

const Publish: React.FC<PublishProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    price: '',
    state: '',
    city: ''
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Wizard Progress */}
        <div className="flex justify-between items-center mb-8 relative">
           <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded"></div>
           <div className={`absolute top-1/2 left-0 h-1 bg-brand-red -z-10 rounded transition-all duration-500`} style={{ width: `${((step-1)/3)*100}%` }}></div>
           
           {[1, 2, 3, 4].map(num => (
             <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors ${step >= num ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
               {num}
             </div>
           ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            
            {/* Step 1: Category & Location */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">O que você vai anunciar?</h2>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Categoria</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {CATEGORIES.map(cat => (
                      <div 
                        key={cat.id}
                        onClick={() => setFormData({...formData, category: cat.id})}
                        className={`p-4 rounded-lg border cursor-pointer text-center transition-all ${formData.category === cat.id ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="mb-2 mx-auto"><Icon name={cat.icon} /></div>
                        <div className="text-sm font-medium">{cat.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div>
                     <label className="block text-gray-700 font-semibold mb-2">Estado</label>
                     <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-red focus:outline-none">
                       <option>Selecione</option>
                       {STATES.map(st => <option key={st}>{st}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="block text-gray-700 font-semibold mb-2">Cidade</label>
                     <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-red focus:outline-none" placeholder="Ex: São Paulo" />
                   </div>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
               <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Descreva seu anúncio</h2>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Título do Anúncio</label>
                    <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-red focus:outline-none" placeholder="Ex: iPhone 13 Pro Max 256GB - Impecável" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Descrição</label>
                    <textarea rows={6} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-red focus:outline-none" placeholder="Conte os detalhes do seu produto/serviço..." />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Preço (R$)</label>
                    <input type="number" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-red focus:outline-none font-bold text-lg" placeholder="0,00" />
                  </div>
               </div>
            )}

            {/* Step 3: Photos */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Fotos</h2>
                <p className="text-gray-500 mb-6">Anúncios com fotos recebem até 5x mais cliques.</p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Icon name="Camera" size={32} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">Adicionar fotos</h3>
                  <p className="text-sm text-gray-400 mt-2">Arraste e solte ou clique para selecionar</p>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-4">
                   {/* Mock uploaded photos */}
                   <div className="aspect-square bg-gray-100 rounded-lg"></div>
                   <div className="aspect-square bg-gray-100 rounded-lg"></div>
                </div>
              </div>
            )}

            {/* Step 4: Finish */}
            {step === 4 && (
              <div className="text-center py-8">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Icon name="ShieldCheck" size={40} />
                 </div>
                 <h2 className="text-3xl font-bold text-gray-900 mb-4">Tudo pronto!</h2>
                 <p className="text-gray-600 mb-8 max-w-md mx-auto">
                   Para finalizar, precisamos que você se identifique ou crie uma conta. É rápido e aumenta a segurança da negociação.
                 </p>
                 
                 <div className="max-w-sm mx-auto space-y-4">
                    <button className="w-full bg-brand-red text-white font-bold py-3 rounded-lg shadow-md hover:bg-red-700">Criar conta e publicar</button>
                    <button className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50">Já tenho conta</button>
                 </div>
              </div>
            )}

          </div>
          
          {/* Footer Actions */}
          {step < 4 && (
            <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-200">
               {step > 1 ? (
                 <button onClick={handleBack} className="text-gray-600 font-semibold hover:text-gray-900">Voltar</button>
               ) : ( <div></div> )}
               
               <button 
                 onClick={handleNext}
                 className="bg-brand-red text-white font-bold py-2 px-8 rounded-lg shadow hover:bg-red-700 transition-colors"
               >
                 Continuar
               </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Publish;