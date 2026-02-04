import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Icon } from '../../components/Icon';

interface Member {
    id: string; // member relation id
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    role: 'owner' | 'seller';
}

const Team: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [adding, setAdding] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get My Store
            const { data: store } = await supabase.from('stores').select('id').eq('owner_id', user.id).single();

            if (store) {
                // Get Members
                const { data: membersData, error } = await supabase
                    .from('store_members')
                    .select('id, role, user_id')
                    .eq('store_id', store.id);

                if (error) throw error;

                // Fetch user details for each member manually or via join if relations were simpler
                // Here doing parallel fetch for simplicity in this mock-ish env
                const enrichedMembers = await Promise.all(membersData.map(async (m: any) => {
                    const { data: u } = await supabase.from('users').select('name, email, phone').eq('id', m.user_id).single();
                    // Fallback if public profile read fails or is restricted
                    return {
                        id: m.id,
                        role: m.role,
                        user: {
                            id: m.user_id,
                            name: u?.name || 'Usuário',
                            email: u?.email || 'email@oculto.com',
                            phone: u?.phone || ''
                        }
                    };
                }));

                setMembers(enrichedMembers as Member[]);
            }
        } catch (error) {
            console.error('Error fetching team', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        setMsg(null);

        try {
            // 1. Find user by email (This usually requires a secure server function, but assuming we can query public profiles or by precise email for MVP)
            // Note: In secure prod, you'd use an Edge Function. Here we simulate finding by exact email match if RLS allows or invite flow.

            // For MVP: We assume the user needs to exist.
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('id, name')
                .eq('email', inviteEmail)
                .single();

            if (userError || !user) {
                throw new Error('Usuário não encontrado. Peça para ele criar uma conta na plataforma primeiro.');
            }

            const { data: { user: currentUser } } = await supabase.auth.getUser();
            const { data: store } = await supabase.from('stores').select('id').eq('owner_id', currentUser?.id).single();

            if (!store) throw new Error('Loja não encontrada');

            // 2. Add to store_members
            const { error: insertError } = await supabase.from('store_members').insert({
                store_id: store.id,
                user_id: user.id,
                role: 'seller'
            });

            if (insertError) {
                if (insertError.code === '23505') throw new Error('Usuário já é membro da equipe.');
                throw insertError;
            }

            setMsg({ type: 'success', text: `Vendedor ${user.name || inviteEmail} adicionado com sucesso!` });
            setInviteEmail('');
            fetchMembers(); // Refresh list

        } catch (err: any) {
            setMsg({ type: 'error', text: err.message });
        } finally {
            setAdding(false);
        }
    };

    const handleRemove = async (memberId: string) => {
        if (!confirm('Tem certeza que deseja remover este vendedor da equipe?')) return;

        try {
            await supabase.from('store_members').delete().eq('id', memberId);
            setMembers(members.filter(m => m.id !== memberId));
        } catch (error) {
            console.error(error);
            alert('Erro ao remover membro');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando equipe...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Icon name="Users" className="text-brand-red" />
                Minha Equipe de Vendas
            </h2>

            {/* Add Member Form */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Novo Vendedor</h3>
                <form onSubmit={handleInvite} className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="email"
                            placeholder="Email do vendedor (deve ter conta na plataforma)"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-brand-red focus:border-brand-red"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={adding}
                        className="bg-brand-red text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {adding ? 'Adicionando...' : 'Adicionar'}
                    </button>
                </form>
                {msg && (
                    <div className={`mt-3 p-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {msg.text}
                    </div>
                )}
            </div>

            {/* Members List */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {members.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    Nenhum membro na equipe ainda.
                                </td>
                            </tr>
                        ) : members.map((member) => (
                            <tr key={member.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-sm">
                                            {member.user.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{member.user.name || 'Sem nome'}</div>
                                            <div className="text-sm text-gray-500">{member.user.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{member.user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${member.role === 'owner' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                        {member.role === 'owner' ? 'Dono' : 'Vendedor'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {member.role !== 'owner' && (
                                        <button
                                            onClick={() => handleRemove(member.id)}
                                            className="text-red-600 hover:text-red-900 font-semibold"
                                        >
                                            Remover
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Link para Vendedores</h3>
                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                    <Icon name="Info" className="text-blue-500 mt-1" />
                    <div>
                        <p className="text-sm text-blue-800 font-medium">Como funciona a comissão</p>
                        <p className="text-sm text-blue-600 mt-1">
                            Cada vendedor tem seu próprio link de perfil público (ex: <strong>classiweb.com/u/vendedor-id</strong>).
                            Quando um cliente entra em contato através do link do vendedor, o WhatsApp de destino será o do vendedor,
                            permitindo que ele negocie diretamente. Você, como dono, terá visibilidade total das vendas no ranking.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
