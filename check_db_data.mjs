
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://plubjqspxikmpviazjcm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdWJqcXNweGlrbXB2aWF6amNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTMxMTIsImV4cCI6MjA4NDU4OTExMn0.LGWzg6Cz0FOpnErliRrKNPVtlvORKstnxPNDupcIunY';

const supabase = createClient(supabaseUrl, supabaseKey);

function log(msg) {
    console.log(msg);
    fs.appendFileSync('db_dump.txt', msg + '\n');
}

async function checkData() {
    // Clear file
    fs.writeFileSync('db_dump.txt', '');

    log('Checking Categories...');
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*');

    if (catError) {
        log('Error fetching categories: ' + JSON.stringify(catError));
    } else {
        log('Categories found: ' + categories.length);
        categories.forEach(c => log(`Slug: ${c.slug}, Name: ${c.name}, ID: ${c.id}`));
    }

    log('\nChecking Listings (Grouped by Category)...');

    const { data: listings, error: listError } = await supabase
        .from('listings')
        .select('id, title, category_id, categories(slug, name)');

    if (listError) {
        log('Error fetching listings: ' + JSON.stringify(listError));
    } else {
        log('Total listings: ' + listings.length);

        const counts = {};
        const unassigned = [];

        listings.forEach(l => {
            if (l.categories) {
                const slug = l.categories.slug;
                if (!counts[slug]) counts[slug] = 0;
                counts[slug]++;
            } else {
                unassigned.push(l);
            }
        });

        log('Counts per Category Slug: ' + JSON.stringify(counts, null, 2));

        if (unassigned.length > 0) {
            log('Unassigned Listings: ' + unassigned.length);
        }

        const carListings = listings.filter(l => l.categories && (l.categories.slug === 'autos' || l.categories.slug === 'carros'));
        log(`\nListings in 'autos' or 'carros': ${carListings.length}`);
        carListings.forEach(l => log(`- ${l.title} (${l.categories.slug})`));
    }
}

checkData();
