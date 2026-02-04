
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';
import AdCard from '../components/AdCard';
import { Icon } from '../components/Icon';
import { Ad } from '../types';


interface SellerProfileProps {
    onNavigate: (page: string, params?: any) => void;
    id: string; // Seller ID (User ID)
}

const SellerProfile: React.FC<SellerProfileProps> = ({ onNavigate, id }) => {
    const [seller, setSeller] = useState<any>(null);
    const [store, setStore] = useState<any>(null);
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSellerData();
    }, [id]);

    const fetchSellerData = async () => {
        try {
            // 1. Fetch User (Seller) info
            // Note: Users table needs RLS allowing public read of name/avatar, or we use a public_profiles table.
            // For this MVP, assuming 'users' is readable or we use metadata.

            // To be robust, let's assume we can fetch basic user/store_member info.
            // We join with store_members to find which store this seller belongs to.

            // Getting store membership first to identify the store context
            // Fetch Profile
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !profile) {
                console.error('Error fetching profile:', error);
                // Handle not found
            } else {
                setSeller({ name: profile.name || 'Usuário', id: profile.id, avatar_url: profile.avatar_url });

                // Fetch Ads for this seller
                const { data: adsData } = await supabase
                    .from('listings')
                    .select('*')
                    .eq('owner_id', id);

                if (adsData) {
                    // Map to Ad interface
                    const mappedAds: Ad[] = adsData.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        price: item.price || 0,
                        category: '', // TODO: join to get category slug if needed
                        location: item.location || '',
                        state: item.state || 'SC',
                        image: item.image_url || 'https://via.placeholder.com/300',
                        images: item.images || [],
                        description: item.description || '',
                        attributes: (item.attributes as Record<string, string | number>) || {},
                        createdAt: item.created_at || new Date().toISOString(),
                        tier: (item.tier as 'free' | 'highlight' | 'premium') || 'free',
                        verified: item.verified || false
                    }));
                    setAds(mappedAds);
                }
            }
        } catch (error) {
            console.error('Error loading seller profile', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando perfil...</div>;

    if (!seller) return <div className="min-h-screen flex items-center justify-center">Vendedor não encontrado.</div>;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header onNavigate={onNavigate} session={null} />

            <div className="container mx-auto px-4 py-8">

                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">


                    <div className="px-8 pb-8 relative">
                        {/* Avatar */}
                        <div className="-mt-12 mb-4 flex justify-between items-end">
                            <div className="flex items-end gap-4">
                                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md">
                                    <div className="w-full h-full bg-brand-red text-white flex items-center justify-center rounded-full text-3xl font-bold">
                                        {seller.name?.charAt(0)}
                                    </div>
                                </div>
                                <div className="mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        {seller.name}
                                        <Icon name="CheckCircle" className="text-blue-500 w-5 h-5" />
                                    </h1>
                                    <p className="text-gray-500">Vendedor Especialista</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-sm transition-all flex items-center gap-2">
                                    <Icon name="Phone" size={18} />
                                    Falar com {seller.name.split(' ')[0]}
                                </button>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Ads Grid */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <Icon name="Tag" size={20} />
                        Anúncios de {seller.name}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {ads.map(ad => (
                            <AdCard
                                key={ad.id}
                                ad={ad}
                                onClick={(id) => onNavigate('detail', { id })}
                            // In the future, we pass sellerContext here to AdCard overrides the contact button
                            />
                        ))}
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default SellerProfile;
