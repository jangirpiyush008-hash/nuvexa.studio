// Supabase client for Nuvexa
const SUPABASE_URL = 'https://dxweiclrlfbumesqcsdt.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ruEXQ9RRV6Qn3I0HJNxrAQ_h8v9XF3g';

// UMD build exposes window.supabase.createClient
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
window.nuvexaDB = sb;
