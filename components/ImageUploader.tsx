import React, { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Icon } from './Icon';

interface ImageUploaderProps {
    currentImageUrl?: string;
    onUploadComplete: (url: string) => void;
    bucket: 'avatars' | 'store-assets';
    shape?: 'circle' | 'square' | 'wide';
    label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    currentImageUrl,
    onUploadComplete,
    bucket,
    shape = 'square',
    label = 'Upload Image'
}) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                return;
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError, data } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            setPreview(publicUrl);
            onUploadComplete(publicUrl);
        } catch (error) {
            alert('Erro ao fazer upload da imagem!');
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const shapeClasses = {
        circle: 'w-32 h-32 rounded-full',
        square: 'w-32 h-32 rounded-lg',
        wide: 'w-full h-48 rounded-lg'
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-700">{label}</label>

            <div className="flex items-center gap-4">
                {/* Preview */}
                <div className={`${shapeClasses[shape]} bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative`}>
                    {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <Icon name="Image" size={32} className="text-gray-400" />
                    )}

                    {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    )}
                </div>

                {/* Upload Button */}
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploading}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-4 py-2 bg-brand-red text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <Icon name="Upload" size={18} />
                        {uploading ? 'Enviando...' : 'Escolher Imagem'}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG ou GIF (máx. 5MB)</p>
                </div>
            </div>
        </div>
    );
};
