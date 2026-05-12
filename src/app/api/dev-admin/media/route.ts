import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const publicImagesDir = path.join(process.cwd(), 'public', 'images');
    
    // Check if directory exists
    try {
      await fs.access(publicImagesDir);
    } catch {
      return NextResponse.json({ files: [] });
    }

    const getAllFiles = async (dirPath: string, folderName: string = ''): Promise<any[]> => {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      let files: any[] = [];

      for (const item of items) {
        if (item.name.startsWith('.')) continue;

        const relativePath = path.join(folderName, item.name);
        const fullPath = path.join(dirPath, item.name);

        if (item.isDirectory()) {
          const nestedFiles = await getAllFiles(fullPath, relativePath);
          files = [...files, ...nestedFiles];
        } else {
          files.push({
            name: item.name,
            url: `/images/${relativePath.replace(/\\/g, '/')}`,
            path: relativePath
          });
        }
      }
      return files;
    };

    const files = await getAllFiles(publicImagesDir);
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error listing media:', error);
    return NextResponse.json({ error: 'Failed to list media' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Convert URL back to filesystem path
    const relativePath = url.replace('/images/', '');
    const fullPath = path.join(process.cwd(), 'public', 'images', relativePath);

    // Security check: ensure the path is within public/images
    const resolvedPath = path.resolve(fullPath);
    const publicImagesDir = path.resolve(path.join(process.cwd(), 'public', 'images'));
    
    if (!resolvedPath.startsWith(publicImagesDir)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await fs.unlink(fullPath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
