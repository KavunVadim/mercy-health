import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const dataDir = path.join(process.cwd(), 'data');
    const dictDir = path.join(process.cwd(), 'src/dictionaries');

    const dataFiles = await fs.readdir(dataDir).catch(() => []);
    const dictFiles = await fs.readdir(dictDir).catch(() => []);

    const files = [
      ...dataFiles
        .filter(f => f.endsWith('.json'))
        .map(f => ({
          name: f,
          path: `data/${f}`,
          type: 'data'
        })),
      ...dictFiles
        .filter(f => f.endsWith('.json'))
        .map(f => ({
          name: f,
          path: `src/dictionaries/${f}`,
          type: 'dictionary'
        }))
    ];

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error listing dev-admin files:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
