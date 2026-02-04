import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase config (usando as mesmas credenciais do supabaseClient.ts)
const supabaseUrl = 'https://djpjaktzstbcwcrzfcun.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcGpha3R6c3RiY3djcnpmY3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMzU2NzcsImV4cCI6MjA1MjgxMTY3N30.eBiKKPEDLYjnJZGvfPqGQQDQQXzZjmPIjGCJZZLsWxE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFavicon() {
    try {
        console.log('📤 Fazendo upload do favicon.svg...');

        // Ler o arquivo
        const faviconPath = join(__dirname, 'public', 'favicon.svg');
        const fileBuffer = readFileSync(faviconPath);

        // Fazer upload para o bucket 'store-assets' (ou criar um bucket específico 'assets')
        const { data, error } = await supabase.storage
            .from('store-assets')
            .upload('favicon.svg', fileBuffer, {
                contentType: 'image/svg+xml',
                upsert: true // Sobrescreve se já existir
            });

        if (error) {
            console.error('❌ Erro ao fazer upload:', error);
            return;
        }

        // Pegar URL pública
        const { data: { publicUrl } } = supabase.storage
            .from('store-assets')
            .getPublicUrl('favicon.svg');

        console.log('✅ Upload concluído!');
        console.log('🔗 URL pública:', publicUrl);
        console.log('\n📋 Adicione esta URL no index.html:');
        console.log(`<link rel="icon" type="image/svg+xml" href="${publicUrl}" />`);

    } catch (err) {
        console.error('❌ Erro:', err);
    }
}

uploadFavicon();
