import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize folder name to prevent path traversal
    const safeFolder = folder.replace(/\.\.\//g, '').replace(/[^\w\s-]/gi, '');
    const publicDir = path.join(process.cwd(), 'public', 'images', safeFolder);
    
    // Ensure folder exists
    await fs.mkdir(publicDir, { recursive: true });

    // Check if it's an image
    const isImage = file.type.startsWith('image/');
    
    let finalFileName = file.name;
    let finalBuffer = buffer;

    if (isImage) {
      // Convert to WebP using Sharp
      const nameWithoutExt = path.parse(file.name).name;
      finalFileName = `${nameWithoutExt}.webp`;
      
      finalBuffer = await sharp(buffer)
        .webp({ quality: 85 })
        .toBuffer();
    }

    const filePath = path.join(publicDir, finalFileName);
    await fs.writeFile(filePath, finalBuffer);

    return NextResponse.json({ 
      success: true, 
      url: `/images/${safeFolder}/${finalFileName}` 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
