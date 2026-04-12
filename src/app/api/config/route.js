import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const CONFIG_PATH = path.join(process.cwd(), 'config.json');

// Helper to determine if we should use KV or File
const isCloud = !!process.env.KV_REST_API_URL;

async function getConfig() {
  try {
    if (isCloud) {
      const data = await kv.get('pwa_config');
      if (data) return data;
    }
  } catch (e) {
    console.error('KV Error:', e);
  }

  // Fallback to local file (default/dev)
  try {
    const file = await fs.readFile(CONFIG_PATH, 'utf8');
    return JSON.parse(file);
  } catch (e) {
    // Default config if no file exists
    return {
      affiliateLink: 'https://ganhou.bet/?register=true&campaign=300girospwatest',
      gtmId: 'GTM-PNLMZZ8V',
      appName: 'GanhouBet App',
      pushMessages: []
    };
  }
}

export async function GET() {
  const config = await getConfig();
  return NextResponse.json(config);
}

export async function POST(req) {
  try {
    const newConfig = await req.json();

    if (isCloud) {
       await kv.set('pwa_config', newConfig);
    } else {
       await fs.writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
    }

    return NextResponse.json({ success: true, config: newConfig });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao salvar configuração' }, { status: 500 });
  }
}
