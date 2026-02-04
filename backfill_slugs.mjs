
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://plubjqspxikmpviazjcm.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
    console.error('SUPABASE_KEY environment variable is required.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Split accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start
        .replace(/-+$/, ''); // Trim - from end
}

async function backfillSlugs() {
    console.log('Fetching listings without slugs...');

    // 1. Fetch all listings (or just those without slugs if possible, but let's just do all to be safe/idempotent)
    const { data: listings, error } = await supabase
        .from('listings')
        .select('id, title, slug');

    if (error) {
        console.error('Error fetching listings:', error);
        return;
    }

    console.log(`Found ${listings.length} listings.`);

    for (const ad of listings) {
        if (ad.slug) {
            console.log(`Skipping ${ad.id} (already has slug: ${ad.slug})`);
            continue;
        }

        let baseSlug = slugify(ad.title);
        // Add a short random suffix to ensure uniqueness strictly, as per plan, mainly for the backfill collision avoidance
        // But for better SEO, maybe just ID suffix if collision? 
        // Plan said: "slugify(title) + '-' + short_random"
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        const finalSlug = `${baseSlug}-${randomSuffix}`;

        console.log(`Updating ${ad.id} with slug: ${finalSlug}`);

        const { error: updateError } = await supabase
            .from('listings')
            .update({ slug: finalSlug })
            .eq('id', ad.id);

        if (updateError) {
            console.error(`Failed to update ${ad.id}:`, updateError);
        }
    }

    console.log('Backfill complete.');
}

backfillSlugs();
