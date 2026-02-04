import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://djpjaktzstbcwcrzfcun.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcGpha3R6c3RiY3djcnpmY3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMzU2NzcsImV4cCI6MjA1MjgxMTY3N30.eBiKKPEDLYjnJZGvfPqGQQDQQXzZjmPIjGCJZZLsWxE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    try {
        console.log('📦 Lendo migration...');
        const sql = readFileSync('migrations/create_listings_table.sql', 'utf-8');

        console.log('🚀 Executando migration...');

        // Split by semicolon and execute each statement
        const statements = sql.split(';').filter(s => s.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
                if (error) {
                    console.error('❌ Erro:', error);
                }
            }
        }

        console.log('✅ Migration aplicada com sucesso!');
        console.log('Agora você pode publicar anúncios! 🎉');

    } catch (err) {
        console.error('❌ Erro ao executar migration:', err);
        console.log('\n📝 Execute manualmente no SQL Editor do Supabase:');
        console.log('https://supabase.com/dashboard/project/djpjaktzstbcwcrzfcun/sql/new');
    }
}

runMigration();
