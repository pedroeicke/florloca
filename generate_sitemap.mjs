
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import xmlbuilder from 'xmlbuilder';
// Since this is node, we can't import .tsx easily without transpilation. 
// I will redefine the data for the script to ensure robustness.

const BASE_URL = 'https://brickcerto.com.br'; // Replace with actual domain

// Hardcoded constants since we cannot import .tsx in node easily without build step
const CATEGORY_SLUGS = [
    'acompanhantes', 'autos', 'imoveis', 'empregos', 'eletronicos', 'moda', 'casa', 'musica', 'esportes'
];

const MAJOR_CITIES = [
    'sao-paulo-sp', 'rio-de-janeiro-rj', 'belo-horizonte-mg', 'brasilia-df', 'salvador-ba',
    'fortaleza-ce', 'curitiba-pr', 'manaus-am', 'recife-pe', 'porto-alegre-rs',
    'florianopolis-sc', 'goiania-go', 'belem-pa', 'campinas-sp', 'sao-luis-ma',
    'maceio-al', 'natal-rn', 'teresina-pi', 'joao-pessoa-pb', 'aracaju-se',
    'cuiaba-mt', 'campo-grande-ms', 'vitoria-es', 'joinville-sc', 'londrina-pr',
    'sorocaba-sp', 'ribeirao-preto-sp', 'uberlandia-mg', 'sao-jose-dos-campos-sp'
];

const supabaseUrl = 'https://plubjqspxikmpviazjcm.supabase.co'; // Hardcoded from client file inspection
const supabaseKey = process.env.SUPABASE_KEY || ''; // Need key to actually fetch listings

async function generateSitemap() {
    const root = xmlbuilder.create('urlset', { encoding: 'UTF-8' })
        .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

    // 1. Static Pages
    const staticPages = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/publish', changefreq: 'monthly', priority: 0.8 },
        { url: '/auth', changefreq: 'monthly', priority: 0.5 },
    ];

    staticPages.forEach(page => {
        const loc = page.url === '/' ? BASE_URL : `${BASE_URL}${page.url}`;

        const item = root.ele('url');
        item.ele('loc', loc);
        item.ele('changefreq', page.changefreq);
        item.ele('priority', page.priority);
    });

    // 2. Category + City Pages (Programmatic SEO)
    CATEGORY_SLUGS.forEach(cat => {
        // Main Category
        const catItem = root.ele('url');
        catItem.ele('loc', `${BASE_URL}/listing?category=${cat}`);
        catItem.ele('changefreq', 'hourly');
        catItem.ele('priority', 0.9);

        // Category + City
        MAJOR_CITIES.forEach(city => {
            const cityItem = root.ele('url');
            // Assuming we implement state/city filter in query params
            // Current app uses ?category=id&state=XX. 
            // My major cities list has "city-st". I need to parse state.
            const state = city.split('-').pop().toUpperCase();

            cityItem.ele('loc', `${BASE_URL}/listing?category=${cat}&state=${state}&city=${city}`);
            cityItem.ele('changefreq', 'hourly');
            cityItem.ele('priority', 0.8);
        });
    });

    // 3. Listings (If we had the key, we would fetch them)
    // For now, let's just make the script.

    const xml = root.end({ pretty: true });
    fs.writeFileSync('public/sitemap.xml', xml);
    console.log('Sitemap generated at public/sitemap.xml');
}

generateSitemap();
