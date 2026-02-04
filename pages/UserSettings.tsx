import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ImageUploader } from '../components/ImageUploader';
import { Icon } from '../components/Icon';

interface UserSettingsProps {
    onNavigate: (page: string) => void;
}

export const UserSettings: React.FC<UserSettingsProps> = ({ onNavigate }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'personal' | 'security'>('personal');

    // Personal Info State
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // Security State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profile) {
                setFullName(profile.full_name || '');
                setPhone(profile.phone || '');
                setAvatarUrl(profile.avatar_url || '');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePersonalInfo = async () => {
        try {
            setSaving(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    phone: phone,
                    avatar_url: avatarUrl
                })
                .eq('id', user.id);

            if (error) throw error;
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erro ao atualizar perfil');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        try {
            if (newPassword !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }

            if (newPassword.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres');
                return;
            }

            setSaving(true);

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            alert('Senha alterada com sucesso!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Erro ao alterar senha');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
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
                        Voltar ao Perfil
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'personal'
                                    ? 'border-brand-red text-brand-red'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon name="User" size={18} className="inline mr-2" />
                                Dados Pessoais
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'security'
                                    ? 'border-brand-red text-brand-red'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Icon name="Lock" size={18} className="inline mr-2" />
                                Segurança
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Personal Info Tab */}
                        {activeTab === 'personal' && (
                            <div className="space-y-6">
                                <ImageUploader
                                    currentImageUrl={avatarUrl}
                                    onUploadComplete={setAvatarUrl}
                                    bucket="avatars"
                                    shape="circle"
                                    label="Foto de Perfil"
                                />

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                        placeholder="Seu nome completo"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>

                                <button
                                    onClick={handleSavePersonalInfo}
                                    disabled={saving}
                                    className="w-full bg-brand-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-blue-800">
                                        <Icon name="Info" size={16} className="inline mr-2" />
                                        Por segurança, você será desconectado após alterar a senha.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nova Senha
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirmar Nova Senha
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
                                        placeholder="Digite novamente"
                                    />
                                </div>

                                <button
                                    onClick={handleChangePassword}
                                    disabled={saving || !newPassword || !confirmPassword}
                                    className="w-full bg-brand-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {saving ? 'Alterando...' : 'Alterar Senha'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
