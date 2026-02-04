
import React, { useState } from 'react';
import { Icon } from '../components/Icon';



interface StoreProps {
    onNavigate: (page: string, params?: any) => void;
    id?: string;
    slug?: string;
}

const Store: React.FC<StoreProps> = ({ onNavigate, id, slug }) => {
    // TODO: Implement real store fetching
    const store = null;

    // Since we don't have real stores yet, we just show the 'Not Found' or a construction state
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            <Icon name="Store" size={48} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700">Loja não encontrada</h2>
            <p className="text-gray-500 mt-2">O recurso de lojas está sendo implementado.</p>
            <button
                onClick={() => onNavigate('home')}
                className="mt-4 text-brand-red font-semibold hover:underline"
            >
                Voltar para Home
            </button>
        </div>
    );
};

export default Store;
