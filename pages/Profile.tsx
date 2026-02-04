import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Icon } from '../components/Icon';
import { Ad } from '../types';
import AdCard from '../components/AdCard';

interface ProfileProps {
    onNavigate: (page: string, params?: any) => void;
    initialTab?: 'ads' | 'messages' | 'notifications';
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, initialTab = 'ads' }) => {
    const [user, setUser] = useState<any>(null);
    const [myAds, setMyAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ads' | 'messages' | 'notifications'>(initialTab);

    // Messages state
    const [conversations, setConversations] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Notifications state
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    useEffect(() => {
        fetchProfile();
        fetchConversations();
        fetchNotifications();
    }, []);

    // Watch for tab changes from URL
    useEffect(() => {
        if (initialTab && initialTab !== activeTab) {
            setActiveTab(initialTab);
        }
    }, [initialTab]);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                onNavigate('auth');
                return;
            }

            const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();
            setUser(userData || { email: user.email });

            // TODO: Fetch user's listings when listings table is ready
            // const { data: adsData } = await supabase.from('listings').select('*').eq('user_id', user.id);
            // setMyAds(adsData || []);

        } catch (error) {
            console.error('Error loading profile', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConversations = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('conversations' as any)
                .select(`
                    *,
                    messages(content, created_at, read, sender_id)
                `)
                .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
                .order('last_message_at', { ascending: false });

            if (error) throw error;

            setConversations(data || []);

            // Count unread messages
            const unread = (data || []).reduce((count: number, conv: any) => {
                const unreadInConv = (conv.messages || []).filter((msg: any) =>
                    !msg.read && msg.sender_id !== user.id
                ).length;
                return count + unreadInConv;
            }, 0);
            setUnreadCount(unread);

        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('notifications' as any)
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;

            setNotifications(data || []);
            setUnreadNotifications((data || []).filter((n: any) => !n.read).length);

        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleMarkNotificationRead = async (id: number) => {
        try {
            await supabase.from('notifications' as any).update({ read: true }).eq('id', id);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadNotifications(Math.max(0, unreadNotifications - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        onNavigate('home');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando perfil...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">

                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-brand-red text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Usuário'}</h1>
                                <p className="text-gray-500">{user?.email}</p>
                                {user?.phone && <p className="text-sm text-gray-400 mt-1">{user.phone}</p>}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => onNavigate('user-settings')}
                                className="text-sm text-gray-700 hover:text-brand-red font-semibold flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-brand-red transition-colors"
                            >
                                <Icon name="Settings" size={16} />
                                Configurações
                            </button>
                            <button
                                onClick={() => onNavigate('store-settings')}
                                className="text-sm text-gray-700 hover:text-brand-red font-semibold flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-brand-red transition-colors"
                            >
                                <Icon name="Store" size={16} />
                                Minha Loja
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-red-600 hover:text-red-800 font-semibold flex items-center gap-2"
                            >
                                <Icon name="LogOut" size={16} />
                                Sair
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`flex-1 py-4 px-6 font-semibold transition-colors relative ${activeTab === 'ads' ? 'bg-brand-red text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('ads')}
                        >
                            <Icon name="ShoppingBag" size={18} className="inline mr-2" />
                            Meus Anúncios ({myAds.length})
                        </button>
                        <button
                            className={`flex-1 py-4 px-6 font-semibold transition-colors relative ${activeTab === 'messages' ? 'bg-brand-red text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('messages')}
                        >
                            <Icon name="MessageCircle" size={18} className="inline mr-2" />
                            Mensagens
                            {unreadCount > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <button
                            className={`flex-1 py-4 px-6 font-semibold transition-colors relative ${activeTab === 'notifications' ? 'bg-brand-red text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            <Icon name="Bell" size={18} className="inline mr-2" />
                            Notificações
                            {unreadNotifications > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {unreadNotifications}
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Meus Anúncios Tab */}
                        {activeTab === 'ads' && (
                            <div>
                                {myAds.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Icon name="Package" size={48} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum anúncio ainda</h3>
                                        <p className="text-gray-500 mb-6">Comece a vender agora mesmo!</p>
                                        <button
                                            onClick={() => onNavigate('publish')}
                                            className="bg-brand-red text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
                                        >
                                            Criar Primeiro Anúncio
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {myAds.map(ad => (
                                            <AdCard key={ad.id} ad={ad} onClick={(id) => onNavigate('detail', { id })} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mensagens Tab */}
                        {activeTab === 'messages' && (
                            <div>
                                {conversations.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Icon name="MessageCircle" size={48} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma mensagem ainda</h3>
                                        <p className="text-gray-500">Suas conversas com compradores aparecerão aqui.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {conversations.map((conv) => {
                                            const lastMessage = conv.messages?.[conv.messages.length - 1];
                                            const hasUnread = conv.messages?.some((m: any) => !m.read && m.sender_id !== user?.id);

                                            return (
                                                <div
                                                    key={conv.id}
                                                    className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${hasUnread ? 'border-brand-red bg-red-50' : 'border-gray-200'}`}
                                                    onClick={() => {/* TODO: Open chat view */ }}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">
                                                                Conversa sobre Anúncio #{conv.listing_id}
                                                                {hasUnread && <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">Nova</span>}
                                                            </h4>
                                                            {lastMessage && (
                                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                                    {lastMessage.content}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <Icon name="ChevronRight" size={20} className="text-gray-400" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Notificações Tab */}
                        {activeTab === 'notifications' && (
                            <div>
                                {notifications.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Icon name="Bell" size={48} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma notificação</h3>
                                        <p className="text-gray-500">Você será notificado sobre mensagens, visualizações e mais.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {notifications.map((notif) => {
                                            const getIcon = (type: string) => {
                                                switch (type) {
                                                    case 'new_message': return 'MessageCircle';
                                                    case 'listing_views': return 'Eye';
                                                    case 'promote_suggestion': return 'Star';
                                                    default: return 'Bell';
                                                }
                                            };

                                            return (
                                                <div
                                                    key={notif.id}
                                                    className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                                                    onClick={() => {
                                                        handleMarkNotificationRead(notif.id);
                                                        if (notif.link) {
                                                            // Parse link and navigate
                                                            const url = new URL(notif.link, window.location.origin);
                                                            const tab = url.searchParams.get('tab');
                                                            if (tab) setActiveTab(tab as any);
                                                        }
                                                    }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-2 rounded-lg ${!notif.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                                            <Icon name={getIcon(notif.type)} size={20} className={!notif.read ? 'text-blue-600' : 'text-gray-600'} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">{notif.title}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                                            <p className="text-xs text-gray-400 mt-2">
                                                                {new Date(notif.created_at).toLocaleString('pt-BR')}
                                                            </p>
                                                        </div>
                                                        {!notif.read && (
                                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
