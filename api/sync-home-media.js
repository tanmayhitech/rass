import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch the current home-media-config.json
  if (req.method === 'GET') {
    try {
      const pub = supabase.storage.from('product-images').getPublicUrl('home-media-config.json').data.publicUrl;
      const resp = await fetch(pub);
      if (resp.ok) {
        const json = await resp.json();
        return res.status(200).json({ success: true, data: json });
      }
      return res.status(404).json({ success: false, message: 'No custom config found' });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  // POST: Save the updated home-media-config.json
  if (req.method === 'POST') {
    try {
      const { items } = req.body || {};
      if (!Array.isArray(items)) {
        return res.status(400).json({ success: false, message: 'Invalid items array' });
      }

      const buffer = Buffer.from(JSON.stringify(items, null, 2));
      const { data, error } = await supabase.storage.from('product-images').upload('home-media-config.json', buffer, {
        contentType: 'application/json',
        upsert: true,
      });

      if (error) {
        return res.status(500).json({ success: false, message: error.message });
      }

      const pub = supabase.storage.from('product-images').getPublicUrl('home-media-config.json').data.publicUrl;
      return res.status(200).json({ success: true, publicUrl: pub });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message || 'Sync failed' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
