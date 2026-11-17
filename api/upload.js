import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { image, filename: requestedName, folder = 'uploads' } = req.body || {};

    if (!image) {
      return res.status(400).json({ success: false, message: 'No image data provided' });
    }

    let buffer;
    let contentType = 'image/webp';
    let ext = 'webp';

    if (image.startsWith('data:')) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        contentType = match[1];
        buffer = Buffer.from(match[2], 'base64');
        if (contentType.includes('png')) ext = 'png';
        else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpeg';
        else if (contentType.includes('webp')) ext = 'webp';
        else if (contentType.includes('gif')) ext = 'gif';
      } else {
        return res.status(400).json({ success: false, message: 'Invalid data URL format' });
      }
    } else {
      buffer = Buffer.from(image, 'base64');
    }

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const cleanPrefix = (requestedName || 'media').replace(/[^a-zA-Z0-9_-]/g, '-').substring(0, 30);
    const finalFilename = `${folder}/${cleanPrefix}-${uniqueId}.${ext}`;

    const { data, error } = await supabase.storage.from('product-images').upload(finalFilename, buffer, {
      contentType,
      upsert: true,
    });

    if (error) {
      console.error('[UploadAPI] Supabase storage error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }

    const { data: pubData } = supabase.storage.from('product-images').getPublicUrl(finalFilename);

    return res.status(200).json({
      success: true,
      publicUrl: pubData.publicUrl,
      path: finalFilename,
    });
  } catch (err) {
    console.error('[UploadAPI] Unexpected error:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Upload failed' });
  }
}
