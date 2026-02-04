import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ImageUploader } from '../components/ImageUploader';
import { Icon } from '../components/Icon';

interface StoreSettingsProps {
    onNavigate: (page: string) => void;
}

export const StoreSettings: React.FC<StoreSettingsProps> = ({ onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'branding' | 'contact' | 'team'>('branding');

    const [storeId, setStoreId] = useState<string | null>(null);

    // Branding State
    const [storeName, setStoreName] = useState('');
    const [description, setDescription] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [coverUrl, setCoverUrl] = useState('');

    // Contact State
    const [address, setAddress] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [instagram, setInstagram] = useState('');
    const [facebook, setFacebook] = useState('');
    const [website, setWebsite] = useState('');

    // Team State
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [newMemberEmail, setNewMemberEmail] = useState('');

    useEffect(() => {
        loadStore();
    }, []);

    const loadStore = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get user's store
            const { data: store } = await supabase
                .from('stores')
                .select('*')
                .eq('owner_id', user.id)
                .single();

            if (store) {
                setStoreId(store.id);
                setStoreName(store.name || '');
                setDescription(store.description || '');
                setLogoUrl(store.logo_url || '');
                setCoverUrl(store.cover_url || '');
                setAddress(store.address || '');
                setWhatsapp(store.whatsapp || '');

                const socialLinks = store.social_links || {};
                setInstagram(socialLinks.instagram || '');
                setFacebook(socialLinks.facebook || '');
                setWebsite(socialLinks.website || '');

                // Load team members
                loadTeamMembers(store.id);
            }
        } catch (error) {
            console.error('Error loading store:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTeamMembers = async (storeId: string) => {
        try {
            const { data: members } = await supabase
                .from('store_members')
                .select(`
          *,
          profiles:user_id (full_name, avatar_url)
        `)
                .eq('store_id', storeId);

            setTeamMembers(members || []);
        } catch (error) {
            console.error('Error loading team:', error);
        }
    };

    const handleSaveBranding = async () => {
        try {
            setSaving(true);
            if (!storeId) return;

            const { error } = await supabase
                .from('stores')
                .update({
                    name: storeName,
                    description: description,
                    logo_url: logoUrl,
                    cover_url: coverUrl
                })
                .eq('id', storeId);

            if (error) throw error;
            alert('Identidade da loja atualizada!');
        } catch (error) {
            console.error('Error updating branding:', error);
            alert('Erro ao atualizar');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveContact = async () => {
        try {
            setSaving(true);
            if (!storeId) return;

            const { error } = await supabase
                .from('stores')
                .update({
                    address: address,
                    whatsapp: whatsapp,
                    social_links: {
                        instagram,
                        facebook,
                        website
                    }
                })
                .eq('id', storeId);

            if (error) throw error;
            alert('Informações de contato atualizadas!');
        } catch (error) {
            console.error('Error updating contact:', error);
            alert('Erro ao atualizar');
        } finally {
            setSaving(false);
        }
    };

    const handleAddMember = async () => {
        try {
            if (!newMemberEmail || !storeId) return;

            // Find user by email
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', newMemberEmail)
                .single();

            if (!profiles) {
                alert('Usuário não encontrado. Verifique o email.');
                return;
            }

            // Add to store_members
            const { error } = await supabase
                .from('store_members')
                .insert({
                    store_id: storeId,
                    user_id: profiles.id,
                    role: 'seller'
                });

            if (error) throw error;

            alert('Vendedor adicionado com sucesso!');
            setNewMemberEmail('');
            loadTeamMembers(storeId);
        } catch (error) {
            console.error('Error adding member:', error);
            alert('Erro ao adicionar vendedor');
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        try {
            if (!confirm('Tem certeza que deseja remover este vendedor?')) return;

            const { error } = await supabase
                .from('store_members')
                .delete()
                .eq('id', memberId);

            if (error) throw error;

            alert('Vendedor removido!');
            if (storeId) loadTeamMembers(storeId);
        } catch (error) {
            console.error('Error removing member:', error);
            alert('Erro ao remover vendedor');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
            </div>
        );
    }

    if (!storeId) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <Icon name="AlertCircle" size={48} className="mx-auto text-yellow-600 mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Você não possui uma loja</h2>
                        <p className="text-gray-600 mb-4">Crie uma loja para acessar as configurações.</p>
                        <button
                            onClick={() => onNavigate('home')}
                            className="bg-brand-red text-white px-6 py-2 rounded-lg hover:bg-red-700"
                        >
                            Voltar ao Início
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => onNavigate('profile')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <Icon name="ArrowLeft" size={20} className="mr-2" />
                        Voltar
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Configurações da Loja</h1>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('branding')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'branding'
                                    ? 'border-brand-red text-brand-red'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon name="Image" size={18} className="inline mr-2" />
                                Identidade
                            </button>
                            <button
                                onClick={() => setActiveTab('contact')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'contact'
                                    ? 'border-brand-red text-brand-red'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon name="MapPin" size={18} className="inline mr-2" />
                                Contato
                            </button>
                            <button
                                onClick={() => setActiveTab('team')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'team'
                                    ? 'border-brand-red text-brand-red'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon name="Users" size={18} className="inline mr-2" />
                                Equipe
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Branding Tab */}
                        {activeTab === 'branding' && (
                            <div className="space-y-6">
                                <ImageUploader
                                    currentImageUrl={logoUrl}
                                    onUploadComplete={setLogoUrl}
                                    bucket="store-assets"
                                    shape="square"
                                    label="Logo da Loja"
                                />

                                <ImageUploader
                                    currentImageUrl={coverUrl}
                                    onUploadComplete={setCoverUrl}
                                    bucket="store-assets"
                                    shape="wide"
                                    label="Capa da Loja (Banner)"
                                />

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nome da Loja
                                    </label>
                                    <input
                                        type="text"
                                        value={storeName}
                                        onChange={(e) => setStoreName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                        placeholder="Nome da sua loja"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                        placeholder="Conte sobre sua loja..."
                                    />
                                </div>

                                <button
                                    onClick={handleSaveBranding}
                                    disabled={saving}
                                    className="w-full bg-brand-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                                >
                                    {saving ? 'Salvando...' : 'Salvar Identidade'}
                                </button>
                            </div>
                        )}

                        {/* Contact Tab */}
                        {activeTab === 'contact' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Endereço Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                        placeholder="Rua, número, bairro, cidade - UF"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        WhatsApp da Loja
                                    </label>
                                    <input
                                        type="tel"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Redes Sociais</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Instagram
                                            </label>
                                            <input
                                                type="text"
                                                value={instagram}
                                                onChange={(e) => setInstagram(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                                placeholder="@sualojaoficial"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Facebook
                                            </label>
                                            <input
                                                type="text"
                                                value={facebook}
                                                onChange={(e) => setFacebook(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                                placeholder="facebook.com/sualoja"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Website
                                            </label>
                                            <input
                                                type="url"
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                                placeholder="https://sualoja.com.br"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSaveContact}
                                    disabled={saving}
                                    className="w-full bg-brand-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                                >
                                    {saving ? 'Salvando...' : 'Salvar Contato'}
                                </button>
                            </div>
                        )}

                        {/* Team Tab */}
                        {activeTab === 'team' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-800">
                                        <Icon name="Info" size={16} className="inline mr-2" />
                                        Adicione vendedores à sua equipe. Eles poderão divulgar seus anúncios com o próprio contato.
                                    </p>
                                </div>

                                {/* Add Member */}
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={newMemberEmail}
                                        onChange={(e) => setNewMemberEmail(e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                        placeholder="Email do vendedor"
                                    />
                                    <button
                                        onClick={handleAddMember}
                                        className="bg-brand-red text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                                    >
                                        <Icon name="Plus" size={18} />
                                        Adicionar
                                    </button>
                                </div>

                                {/* Team List */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900">Membros da Equipe</h3>

                                    {teamMembers.length === 0 ? (
                                        <p className="text-gray-500 text-sm py-8 text-center">
                                            Nenhum vendedor adicionado ainda.
                                        </p>
                                    ) : (
                                        teamMembers.map((member) => (
                                            <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                                        {member.profiles?.avatar_url ? (
                                                            <img src={member.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Icon name="User" size={20} className="text-gray-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{member.profiles?.full_name || 'Sem nome'}</p>
                                                        <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                                                    </div>
                                                </div>

                                                {member.role !== 'owner' && (
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="text-red-600 hover:text-red-800 p-2"
                                                    >
                                                        <Icon name="Trash2" size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
