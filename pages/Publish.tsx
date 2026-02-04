import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { CATEGORIES, CATEGORY_DB_MAPPING, STATE_DB_MAPPING, STATES } from '../constants';
import { Icon } from '../components/Icon';

interface PublishProps {
  onNavigate: (page: string) => void;
}

const Publish: React.FC<PublishProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    price: '',
    state: '',
    city: ''
  });

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setLoading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(e.target.files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `listings/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('store-assets')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('store-assets')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setImages([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erro ao fazer upload das imagens');
    } finally {
      setLoading(false);
    }
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handlePublish = async () => {
    if (!session) {
      onNavigate('auth');
      return;
    }

    setLoading(true);
    try {
      const slug = `${slugify(formData.title)}-${Math.random().toString(36).substring(2, 6)}`;

      const mappedCategorySlug = CATEGORY_DB_MAPPING[formData.category]?.[0] || formData.category;
      const { data: categoryRow, error: categoryError } = await supabase
        .from('categories' as any)
        .select('id')
        .eq('slug', mappedCategorySlug)
        .single();

      if (categoryError) throw categoryError;
      if (!categoryRow?.id) throw new Error('Categoria inválida');

      const stateValue = STATE_DB_MAPPING[formData.state] || formData.state;

      const { error } = await supabase
        .from('listings' as any)
        .insert({
          owner_id: session.user.id,
          title: formData.title,
          slug: slug,
          description: formData.description,
          price: parseFloat(formData.price),
          category_id: categoryRow?.id,
          state: stateValue,
          city: formData.city,
          images: images,
          status: 'active'
        });

      if (error) throw error;

      alert('Anúncio publicado com sucesso!');
      onNavigate('profile');
    } catch (error) {
      console.error('Publish error:', error);
      alert('Erro ao publicar anúncio. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    // Skip step 4 (login) if already authenticated
    if (step === 3 && session) {
      handlePublish();
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => setStep(step - 1);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Wizard Progress */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded"></div>
          <div className={`absolute top-1/2 left-0 h-1 bg-brand-red -z-10 rounded transition-all duration-500`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>

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
                        onClick={() => setFormData({ ...formData, category: cat.id })}
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
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-red focus:outline-none"
                    >
                      <option value="">Selecione</option>
                      {STATES.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Cidade</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-red focus:outline-none"
                      placeholder="Ex: São Paulo"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalhes do anúncio</h2>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-red focus:outline-none"
                    placeholder="Ex: iPhone 13 Pro Max 256GB"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Descrição</label>
                  <textarea
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-red focus:outline-none"
                    placeholder="Descreva seu produto..."
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">Preço</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">R$</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full p-3 pl-12 bg-gray-50 border border-gray-200 rounded-lg focus:border-brand-red focus:outline-none"
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Photos */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Fotos</h2>
                <p className="text-gray-500 mb-6">Anúncios com fotos recebem até 5x mais cliques.</p>

                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <label
                  htmlFor="file-upload"
                  className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors block"
                >
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Icon name="Camera" size={32} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    {loading ? 'Enviando...' : 'Adicionar fotos'}
                  </h3>
                  <p className="text-sm text-gray-400 mt-2">Arraste e solte ou clique para selecionar</p>
                </label>

                {images.length > 0 && (
                  <div className="mt-6 grid grid-cols-4 gap-4">
                    {images.map((url, idx) => (
                      <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                        <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Finish (only if not logged in) */}
            {step === 4 && !session && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="ShieldCheck" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Tudo pronto!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Para finalizar, precisamos que você se identifique ou crie uma conta. É rápido e aumenta a segurança da negociação.
                </p>

                <div className="max-w-sm mx-auto space-y-4">
                  <button
                    onClick={() => onNavigate('auth')}
                    className="w-full bg-brand-red text-white font-bold py-3 rounded-lg shadow-md hover:bg-red-700"
                  >
                    Criar conta e publicar
                  </button>
                  <button
                    onClick={() => onNavigate('auth')}
                    className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50"
                  >
                    Já tenho conta
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          {step < 4 && (
            <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-t border-gray-200">
              {step > 1 ? (
                <button onClick={handleBack} className="text-gray-600 font-semibold hover:text-gray-900">Voltar</button>
              ) : (<div></div>)}

              <button
                onClick={handleNext}
                disabled={loading}
                className="bg-brand-red text-white font-bold py-2 px-8 rounded-lg shadow hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Aguarde...' : step === 3 && session ? 'Publicar' : 'Continuar'}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Publish;
