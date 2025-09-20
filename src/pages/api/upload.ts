import formidable from 'formidable';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// disable default bodyParser for formidable
export const config = { api: { bodyParser: false } };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // MUST be set on server
const BUCKET = 'post-images';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parse error' });

    const file = (files?.file as any);
    if (!file) return res.status(400).json({ error: 'No file' });

    try {
      const data = fs.readFileSync((file as any).filepath);
      const ext = ((file as any).originalFilename || (file as any).newFilename || 'img').split('.').pop();
      const fileName = `post_img_${Date.now()}.${ext}`;

      const { error } = await supabaseAdmin.storage.from(BUCKET).upload(fileName, data, { contentType: (file as any).mimetype, upsert: true });
      if (error) return res.status(500).json({ error: error.message });

      const { data: publicData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName);
      return res.status(200).json({ publicUrl: publicData?.publicUrl || null });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Upload failed' });
    }
  });
}