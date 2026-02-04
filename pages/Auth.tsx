
import React, { useState } from 'react';
import { Icon } from '../components/Icon';
import { supabase } from '../supabaseClient';

interface AuthProps {
    onNavigate: (page: string) => void;
}

type AuthView = 'login' | 'register' | 'forgot_password';
type AccountType = 'personal' | 'business';

const Auth: React.FC<AuthProps> = ({ onNavigate }) => {
    const [view, setView] = useState<AuthView>('login');
    const [accountType, setAccountType] = useState<AccountType>('personal');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    // Business Specific
    const [storeName, setStoreName] = useState('');
    const [cnpj, setCnpj] = useState('');

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.href, // Redirect back to app
            });
            if (error) throw error;
            setSuccessMsg('Email de recuperação enviado! Verifique sua caixa de entrada.');
        } catch (err: any) {
            setError(err.message || 'Erro ao enviar email.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        // 1. Sign Up User
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    phone,
                    account_type: accountType,
                    store_name: accountType === 'business' ? storeName : undefined,
                    cnpj: accountType === 'business' ? cnpj : undefined
                }
            }
        });

        if (authError) throw authError;

        // 2. If Business, Create Store Entry
        if (accountType === 'business' && authData.user) {
            const { error: storeError } = await supabase.from('stores').insert({
                name: storeName,
                slug: storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                owner_id: authData.user.id,
                whatsapp: phone,
                description: `Loja oficial de ${name}`,
                verified: false // Requires admin approval
            });

            if (storeError) {
                console.error("Error creating store:", storeError);
                // Non-blocking, but good to log. User exists, just store creation failed.
            }
        }

        setSuccessMsg('Cadastro realizado com sucesso! Verifique seu email para confirmar.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            if (view === 'login') {
                const { error, data } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;

                // Check if user owns a store
                try {
                    const { data: store } = await supabase.from('stores' as any).select('id').eq('owner_id', data.user?.id).single();

                    if (store) {
                        onNavigate('dashboard/team'); // Store owner
                    } else {
                        onNavigate('profile'); // Regular user
                    }
                } catch (storeError) {
                    // If there's an error checking stores, just go to profile
                    console.log('Error checking store:', storeError);
                    onNavigate('profile');
                }
            } else if (view === 'register') {
                await handleSignUp();
                // After signup, redirect based on account type
                // Note: User might need to confirm email first, but we set the intended destination
                try {
                    if (accountType === 'business') {
                        onNavigate('dashboard/team'); // Or create a store dashboard overview
                    } else {
                        onNavigate('profile');
                    }
                } catch (navError) {
                    console.log('Navigation error:', navError);
                    onNavigate('home');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fadeIn">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="bg-brand-red w-12 h-12 rounded-lg flex items-center justify-center text-white">
                        <Icon name="ShoppingBag" size={24} />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {view === 'login' && 'Entre na sua conta'}
                    {view === 'register' && 'Crie sua conta grátis'}
                    {view === 'forgot_password' && 'Recuperar senha'}
                </h2>

                {view !== 'forgot_password' && (
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ou{' '}
                        <button
                            onClick={() => {
                                setView(view === 'login' ? 'register' : 'login');
                                setError(null);
                                setSuccessMsg(null);
                            }}
                            className="font-medium text-brand-red hover:text-red-500 transition-colors"
                        >
                            {view === 'login' ? 'cadastre-se agora' : 'já possui conta? Faça login'}
                        </button>
                    </p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">

                    {view === 'forgot_password' ? (
                        <form className="space-y-6" onSubmit={handlePasswordReset}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email cadastrado</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red sm:text-sm"
                                    placeholder="seu@email.com"
                                />
                            </div>

                            {successMsg && (
                                <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm">{successMsg}</div>
                            )}
                            {error && (
                                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red"
                            >
                                {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setView('login')}
                                className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
                            >
                                Voltar para Login
                            </button>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>

                            {view === 'register' && (
                                <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setAccountType('personal')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${accountType === 'personal' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Particular
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAccountType('business')}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${accountType === 'business' ? 'bg-white shadow text-brand-red' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        Lojista
                                    </button>
                                </div>
                            )}

                            {/* Register Fields */}
                            {view === 'register' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nome completo</label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Icon name="User" size={16} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="focus:ring-brand-red focus:border-brand-red block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-3 border"
                                                placeholder="Seu nome"
                                            />
                                        </div>
                                    </div>

                                    {accountType === 'business' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Nome da Loja</label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Icon name="Store" size={16} className="text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={storeName}
                                                        onChange={(e) => setStoreName(e.target.value)}
                                                        className="focus:ring-brand-red focus:border-brand-red block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-3 border"
                                                        placeholder="Ex: AutoMotors Floripa"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">CNPJ (Opcional)</label>
                                                <input
                                                    type="text"
                                                    value={cnpj}
                                                    onChange={(e) => setCnpj(e.target.value)}
                                                    className="mt-1 focus:ring-brand-red focus:border-brand-red block w-full sm:text-sm border-gray-300 rounded-md p-3 border"
                                                    placeholder="00.000.000/0000-00"
                                                />
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Icon name="Mail" size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="focus:ring-brand-red focus:border-brand-red block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-3 border"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            {/* Phone Field (Register Only) */}
                            {view === 'register' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Telefone / WhatsApp</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Icon name="Phone" size={16} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="focus:ring-brand-red focus:border-brand-red block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-3 border"
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Password Field */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Senha</label>
                                    {view === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setView('forgot_password')}
                                            className="text-xs text-brand-red hover:underline"
                                        >
                                            Esqueceu a senha?
                                        </button>
                                    )}
                                </div>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Icon name="Lock" size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="focus:ring-brand-red focus:border-brand-red block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-3 border"
                                        placeholder="••••••••"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            {successMsg && (
                                <div className="rounded-md bg-green-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <Icon name="CheckCircle" size={20} className="text-green-400" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">
                                                {successMsg}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className="rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <Icon name="AlertCircle" size={20} className="text-red-400" />
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                {error}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-brand-red hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-all`}
                                >
                                    {loading ? 'Processando...' : (view === 'login' ? 'Entrar' : 'Criar Conta')}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Protegido e seguro
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
