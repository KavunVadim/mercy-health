import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import JSZip from 'jszip';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const zip = new JSZip();
    
    // Add data folder
    const dataDir = path.join(process.cwd(), 'data');
    const dataFiles = await fs.readdir(dataDir);
    for (const file of dataFiles) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
        zip.file(`data/${file}`, content);
      }
    }

    // Add dictionaries folder
    const dictDir = path.join(process.cwd(), 'src', 'dictionaries');
    const dictFiles = await fs.readdir(dictDir);
    for (const file of dictFiles) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(dictDir, file), 'utf-8');
        zip.file(`dictionaries/${file}`, content);
      }
    }

    const zipData = await zip.generateAsync({ type: 'uint8array' });
    
    return new NextResponse(zipData, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=mercy-health-backup.zip',
      },
    });
  } catch (error) {
    console.error('Backup failed:', error);
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}
