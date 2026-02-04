
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://plubjqspxikmpviazjcm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdWJqcXNweGlrbXB2aWF6amNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMTMxMTIsImV4cCI6MjA4NDU4OTExMn0.LGWzg6Cz0FOpnErliRrKNPVtlvORKstnxPNDupcIunY';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
